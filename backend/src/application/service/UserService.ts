import { ILogger } from "../../infra/config/ILogger";
import { GitHubRepository, GitHubUser, RecursivePartial } from "../../utils/types";
import { IGithubGateway } from "../gateway/IGithubGateway";

export class UserService {
    constructor(private readonly logger: ILogger, private readonly githubGateway: IGithubGateway) { }

    async auth(code: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Requesting Github Gateway for user authentication");
        return await this.githubGateway.auth(code);
    }

    async refresh(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Requesting Github Gateway for user authentication with refresh token");
        return await this.githubGateway.refreshToken(token);
    }

    async getUserInformation(token: string): Promise<GitHubUser> {
      this.logger.log("Requesting Github Gateway information about for authorized user");
      return await this.githubGateway.getUserInformation(token);
    }

    async getUserRepositories(token: string): Promise<RecursivePartial<GitHubRepository>[]> {
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
        owner: repo.owner ? {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url
        }: {},
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url
      }));
    }
}