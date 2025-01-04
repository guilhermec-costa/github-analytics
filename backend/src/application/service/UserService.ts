import { ILogger } from "../../infra/config/ILogger";
import {
  CommitResponse,
  GitHubRepository,
  GitHubUser,
  RecursivePartial,
} from "../../utils/types";
import { IGithubGateway } from "../gateway/IGithubGateway";
import * as moment from "moment";

export class UserService {
  constructor(
    private readonly logger: ILogger,
    private readonly githubGateway: IGithubGateway,
  ) {}

  async auth(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log("Requesting Github Gateway for user authentication");
    return await this.githubGateway.auth(code);
  }

  async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(
      "Requesting Github Gateway for user authentication with refresh token",
    );
    return await this.githubGateway.refreshToken(token);
  }

  async getUserInformation(token: string): Promise<GitHubUser> {
    this.logger.log(
      "Requesting Github Gateway information about for authorized user",
    );
    return await this.githubGateway.getUserInformation(token);
  }

  async getUserRepositories(
    token: string,
  ): Promise<RecursivePartial<GitHubRepository>[]> {
    this.logger.log("Requesting Github Gateway for authorized user");
    const userRepos = await this.githubGateway.getUserRepositories(token);

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

  async getSingleRepositoryLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ) {
    const response = await this.githubGateway.getRepositoryLanguages(
      repoOwner,
      repoName,
      token,
    );

    return response;
  }

  async getUserRepositoriesLanguages(token: string, repoOwner: string) {
    this.logger.log(
      "Requesting Github Gateway for languages from user repositories",
    );
    const userRepos = await this.getUserRepositories(token);
    const awaitableRequests = [];
    const parsedResponse: Record<string, any> = {};

    for (const repo of userRepos) {
      awaitableRequests.push(
        this.getSingleRepositoryLanguages(repoOwner, repo.name!, token),
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

  async getUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<CommitResponse[]> {
    const userRepoCommits = await this.githubGateway.getUserRepoCommits(
      repoOwner,
      repoName,
      token,
    );

    const groupedData: any = {};
    for (const commit of userRepoCommits) {
      const committedAt = moment
        .default(commit.commit.author.date)
        .format("YYYY-MM-DD");

      if (!groupedData[committedAt]) {
        groupedData[committedAt] = 1;
        continue;
      }

      groupedData[committedAt] += 1;
    }

    const parsedGroupedData: any = {};
    for (const date of Object.keys(groupedData)) {
      const nrCommits = groupedData[date];
      parsedGroupedData[date] = {
        commits: nrCommits,
        pctTotal: ((nrCommits / userRepoCommits.length) * 100).toFixed(2),
      };
    }

    return parsedGroupedData;
  }
}
