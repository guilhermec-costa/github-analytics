import { ILogger } from "../../infra/config/ILogger";
import { GithubGateway } from "../../infra/gateway/GithubGateway";
import { GitHubUser } from "../../utils/types";
import { IGithubApiGateway } from "../gateway/IGithubApiGateway";
import { IGithubWebGateway } from "../gateway/IGithubWebGateway";

export class UserService {
  constructor(
    private readonly logger: ILogger,
    private readonly githubWeb: IGithubWebGateway & GithubGateway,
    private readonly githubApi: IGithubApiGateway & GithubGateway,
  ) {}

  async auth(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log("Requesting Github Gateway for user authentication");
    return await this.githubWeb.auth(code);
  }

  async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(
      "Requesting Github Gateway for user authentication with refresh token",
    );
    return await this.githubWeb.refreshToken(token);
  }

  async getUserInformation(token: string): Promise<GitHubUser> {
    this.logger.log(
      "Requesting Github Gateway information about for authorized user",
    );
    return await this.githubApi.getUserInformation(token);
  }
}
