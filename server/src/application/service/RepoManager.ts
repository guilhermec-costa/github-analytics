import { ILogger } from "../../infra/config/ILogger";
import { IGithubApiGateway } from "../gateway/IGithubApiGateway";
import { GithubGateway } from "../../infra/gateway/GithubGateway";
import { RecursivePartial } from "../../utils/types/shared";
import {
  GithubRepo,
  RepoLanguages,
  RepoMetrics,
} from "../../utils/types/repository";
import { CommitDetail, ParsedCommitDetails } from "../../utils/types/commit";
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
  async loadUserRepos(token: string, username: string): Promise<GithubRepo[]> {
    const userRepos = await this.githubApi.fetchUserRepos(token, username);
    return userRepos;
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
  async loadUserReposLanguages(
    token: string,
    repoOwner: string,
    repos: GithubRepo[],
  ) {
    this.logger.log(
      "Requesting Github Gateway for languages from user repositories",
    );

    const resolvedRequests = await Promise.all(
      repos.map((repo) => {
        return this.loadRepoLanguages(repoOwner, repo.name, token);
      }),
    );

    return repos.reduce<RepoLanguages>((acc, repo, idx) => {
      acc[repo.name] = Object.entries(resolvedRequests[idx]).map(
        ([language, count]) => ({ language, count }),
      );

      return acc;
    }, {});
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
    since: string,
    until: string = new Date().toISOString(),
  ): Promise<DetailedRepoCommit[]> {
    const repoCommits = await this.githubApi.fetchUserRepoCommitsSinceUntil(
      repoOwner,
      repoName,
      token,
      since,
      until,
    );

    const groupedCommitDetails =
      this.commitTransformer.groupRepoCommitsByDate(repoCommits);

    return Object.entries(groupedCommitDetails).map(([date, details]) => ({
      date,
      commits: details.count,
      details: details.details,
    }));
  }

  /**
   * Aggregates metrics for all repositories of an authenticated user.
   *
   * @param owner - The owner of the repositories.
   * @param token - The access token of the authenticated user.
   * @returns A mapping of repositories to their metrics including languages and commits.
   */
  async loadUserRepositoriesMetrics(owner: string, token: string) {
    const repos = await this.loadUserRepos(token, owner);
    const notEmptyRepos = repos.filter((repo) => repo.size > 0);

    const repositoriesLanguages = await this.loadUserReposLanguages(
      token,
      owner,
      notEmptyRepos,
    );

    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const commitRequests = await Promise.all(
      notEmptyRepos.map((repo) =>
        this.getUserRepoCommits(
          owner,
          repo.name,
          token,
          thirtyDaysAgo.toISOString(),
        ),
      ),
    );

    return notEmptyRepos.reduce<RepoMetrics>((acc, repo, idx) => {
      const languageDetails = repositoriesLanguages[repo.name];
      if (languageDetails && languageDetails.length > 0) {
        acc[repo.name] = {
          LanguageDetails: repositoriesLanguages[repo.name!],
          CommitDetails: commitRequests[idx],
          StargazersCount: repo.stargazers_count,
          repo: repo.name!,
          watchersCount: repo.watchers_count,
          size: repo.size,
          licenseName: repo.license?.name,
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
          topLanguage: repo.language || "",
        };
      }
      return acc;
    }, {});
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

  async loadCommitPeriod(
    repoOwner: string,
    repoName: string,
    token: string,
    since: string,
    until: string,
  ) {
    return await this.getUserRepoCommits(
      repoOwner,
      repoName,
      token,
      since,
      until,
    );
  }
}
