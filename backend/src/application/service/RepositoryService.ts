import { RecursivePartial, GitHubRepository } from "../../utils/types";
import { IGithubGateway } from "../gateway/IGithubGateway";
import { ILogger } from "../../infra/config/ILogger";
import * as moment from "moment";

export class RepositoryService {
  constructor(
    private readonly logger: ILogger,
    private readonly githubGateway: IGithubGateway,
  ) {}

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
  ): Promise<any> {
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

    const parsedGroupedData = [];
    for (const date of Object.keys(groupedData)) {
      const nrCommits = groupedData[date];
      parsedGroupedData.push({
        date,
        commits: nrCommits,
        pctTotal: ((nrCommits / userRepoCommits.length) * 100).toFixed(2),
      });
    }

    return parsedGroupedData;
  }

  async getUserRepositoriesMetrics(owner: string, token: string) {
    const userRepos = await this.getUserRepositories(token);
    const repositoriesLanguages = await this.getUserRepositoriesLanguages(
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
}
