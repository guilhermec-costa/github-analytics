import {
  RecursivePartial,
  GitHubRepository,
  CommitDetail,
  CommitFile,
} from "../../utils/types";
import { ILogger } from "../../infra/config/ILogger";
import * as moment from "moment";
import { IGithubApiGateway } from "../gateway/IGithubApiGateway";
import { GithubGateway } from "../../infra/gateway/GithubGateway";

export class RepositoryService {
  constructor(
    private readonly logger: ILogger,
    private readonly githubApi: IGithubApiGateway & GithubGateway,
  ) {}

  /**
   * Retrieves repositories for an authenticated user.
   *
   * @param token - The access token of the authenticated user.
   * @returns A list of repositories with partial details.
   */
  async loadUserRepos(
    token: string,
  ): Promise<RecursivePartial<GitHubRepository>[]> {
    const userRepos = await this.githubApi.fetchUserRepos(token);

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
    const userRepos = await this.loadUserRepos(token);
    const awaitableRequests = [];
    const parsedResponse: Record<string, any> = {};

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
  ): Promise<any> {
    const userRepoCommits = await this.githubApi.fetchUserRepoCommits(
      repoOwner,
      repoName,
      token,
    );

    const groupedData: any = {};
    for (const _commit of userRepoCommits) {
      const { commit } = _commit;
      const committedAt = moment
        .default(commit.author.date)
        .format("YYYY-MM-DD");

      const commitDetail = {
        sha: _commit.sha,
        author: commit.author.name,
        date: commit.author.date,
        email: commit.author.email,
        message: commit.message,
      };

      if (!groupedData[committedAt]) {
        groupedData[committedAt] = {
          count: 1,
          details: [commitDetail],
        };
        continue;
      }

      groupedData[committedAt] = {
        count: groupedData[committedAt].count + 1,
        details: [commitDetail, ...groupedData[committedAt].details],
      };
    }

    const parsedGroupedData = [];
    for (const date of Object.keys(groupedData)) {
      const nrCommits = groupedData[date].count;
      parsedGroupedData.push({
        date,
        commits: nrCommits,
        pctTotal: ((nrCommits / userRepoCommits.length) * 100).toFixed(2),
        details: groupedData[date].details,
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
    const userRepos = await this.loadUserRepos(token);
    const repositoriesLanguages = await this.loadUserReposLanguages(
      token,
      owner,
    );
    const parsedMetrics: any = {};
    for (const repo of userRepos) {
      parsedMetrics[repo.name!] = {};
      parsedMetrics[repo.name!]["LanguageDetails"] =
        repositoriesLanguages[repo.name!];
      parsedMetrics[repo.name!]["CommitDetails"] =
        await this.getUserRepoCommits(owner, repo.name!, token);
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

    const parsedFiles: RecursivePartial<CommitFile>[] = [];
    for (const file of data.files) {
      parsedFiles.push({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
      });
    }

    return {
      sha: data.sha,
      files: parsedFiles,
      stats: data.stats,
    };
  }
}
