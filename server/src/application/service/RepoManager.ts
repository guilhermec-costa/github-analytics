import { ILogger } from "../../infra/config/ILogger";
import { IGithubApiGateway } from "../gateway/IGithubApiGateway";
import { GithubGateway } from "../../infra/gateway/GithubGateway";
import { RecursivePartial } from "../../utils/types/shared";
import {
  GithubRepo,
  RepoLanguages,
  RepoMetrics,
} from "../../utils/types/repository";
import { CommitDetail } from "../../utils/types/commit";
import { CommitDataTransformer } from "./CommitDataTransformer";
import { DetailedRepoCommit } from "../../utils/types/githubUser";

export class RepoManager {
  private readonly commitTransformer = new CommitDataTransformer();

  constructor(
    private readonly logger: ILogger,
    private readonly githubApi: IGithubApiGateway & GithubGateway,
  ) {}

  /**
   * Retrieves repositories for an user.
   *
   * @param token - The access token of the authenticated user.
   * @param username - The user to fetch repositories
   * @returns A list of repositories with partial details.
   */
  async loadUserRepos(
    token: string,
    username: string,
  ): Promise<RecursivePartial<GithubRepo>[]> {
    const userRepos = await this.githubApi.fetchUserRepos(token, username);

    return userRepos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      fork: repo.fork,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      language: repo.language,
      license: repo.license ? repo.license : null,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
      },
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      ssh_url: repo.ssh_url,
    }));
  }

  /**
   * Retrieves the languages used in a specific repository.
   *
   * @param repoOwner - The owner of the repository.
   * @param repoName - The name of the repository.
   * @param token - The access token of the authenticated user.
   * @returns A mapping of languages and their usage in the repository.
   */
  async loadRepoLanguages(repoOwner: string, repoName: string, token: string) {
    const response = await this.githubApi.fetchRepoLanguages(
      repoOwner,
      repoName,
      token,
    );

    return response;
  }

  /**
   * Retrieves languages used across all repositories of an authenticated user.
   *
   * @param token - The access token of the authenticated user.
   * @param repoOwner - The owner of the repositories.
   * @returns A mapping of repositories to their language usage details.
   */
  async loadUserReposLanguages(token: string, repoOwner: string) {
    this.logger.log(
      "Requesting Github Gateway for languages from user repositories",
    );
    const userRepos = await this.loadUserRepos(token, repoOwner);
    const awaitableRequests = [];
    const parsedResponse: RepoLanguages = {};

    for (const repo of userRepos) {
      awaitableRequests.push(
        this.loadRepoLanguages(repoOwner, repo.name!, token),
      );
    }

    const resolvedRequests = await Promise.all(awaitableRequests);

    for (const [idx, item] of resolvedRequests.entries()) {
      const repoName = userRepos[idx].name!;

      parsedResponse[repoName] = Object.entries(item).map(
        ([language, count]) => ({
          language,
          count,
        }),
      );
    }

    return parsedResponse;
  }

  /**
   * Retrieves commit details grouped by date for a specific repository.
   *
   * @param repoOwner - The owner of the repository.
   * @param repoName - The name of the repository.
   * @param token - The access token of the authenticated user.
   * @returns Commit details grouped by date with percentages.
   */
  async getUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<DetailedRepoCommit[]> {
    const repoCommits = await this.githubApi.fetchUserRepoCommits(
      repoOwner,
      repoName,
      token,
    );

    const groupedCommitDetails =
      this.commitTransformer.groupRepoCommitsByDate(repoCommits);

    const parsedGroupedData = [];
    for (const date of Object.keys(groupedCommitDetails)) {
      const nrCommits = groupedCommitDetails[date].count;
      parsedGroupedData.push({
        date,
        commits: nrCommits,
        pctTotal: ((nrCommits / repoCommits.length) * 100).toFixed(2),
        details: groupedCommitDetails[date].details,
      });
    }

    return parsedGroupedData;
  }

  /**
   * Aggregates metrics for all repositories of an authenticated user.
   *
   * @param owner - The owner of the repositories.
   * @param token - The access token of the authenticated user.
   * @returns A mapping of repositories to their metrics including languages and commits.
   */
  async loadUserRepositoriesMetrics(owner: string, token: string) {
    const userRepos = await this.loadUserRepos(token, owner);
    const repositoriesLanguages = await this.loadUserReposLanguages(
      token,
      owner,
    );
    const parsedMetrics: RepoMetrics = {};

    for (const repo of userRepos) {
      parsedMetrics[repo.name!] = {
        LanguageDetails: repositoriesLanguages[repo.name!],
        CommitDetails: await this.getUserRepoCommits(owner, repo.name!, token),
        StargazersCount: repo.stargazers_count,
        repo: repo.name!,
      };
    }

    return parsedMetrics;
  }

  /**
   * Retrieves detailed information about a specific commit in a repository.
   *
   * @param owner - The owner of the repository.
   * @param repo - The name of the repository.
   * @param token - The access token of the authenticated user.
   * @param id - The ID or SHA of the commit.
   * @returns Details of the specified commit including files and statistics.
   */
  async loadCommitDetails(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<RecursivePartial<CommitDetail>> {
    const data = await this.githubApi.fetchCommitDetail(owner, repo, token, id);
    const extractedFiles = this.commitTransformer.refineFilesInfo(data);

    return {
      sha: data.sha,
      files: extractedFiles,
      stats: data.stats,
    };
  }
}
