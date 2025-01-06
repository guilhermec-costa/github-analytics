import { ILogger } from "../../infra/config/ILogger";
import { GithubGateway } from "../../infra/gateway/GithubGateway";
import { AuthCredentials, GitHubUser } from "../../utils/types";
import { IGithubApiGateway } from "../gateway/IGithubApiGateway";
import { IGithubWebGateway } from "../gateway/IGithubWebGateway";

export class UserService {
  constructor(
    private readonly logger: ILogger,
    private readonly githubWeb: IGithubWebGateway & GithubGateway,
    private readonly githubApi: IGithubApiGateway & GithubGateway,
  ) {}

  /**
   * Authenticates a user using GitHub OAuth.
   *
   * This method exchanges the authentication code obtained from GitHub OAuth
   * for an access token and a refresh token.
   *
   * @param code - The authentication code provided by GitHub after OAuth authorization.
   * @returns An object containing `accessToken` and `refreshToken`.
   */
  async oauth(code: string): Promise<AuthCredentials> {
    this.logger.log("Requesting Github Gateway for user authentication");
    return await this.githubWeb.oauth(code);
  }

  /**
   * Refreshes the user authentication tokens.
   *
   * This method exchanges a refresh token for a new pair of access and refresh tokens.
   *
   * @param token - The refresh token used to generate new tokens.
   * @returns An object containing the new `accessToken` and `refreshToken`.
   */
  async refresh(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(
      "Requesting Github Gateway for user authentication with refresh token",
    );
    return await this.githubWeb.refreshToken(token);
  }

  /**
   * Retrieves user information from GitHub.
   *
   * This method fetches details about the authenticated user from the GitHub API.
   *
   * @param token - The access token of the authenticated user.
   * @returns A `GitHubUser` object containing user information like username, avatar, etc.
   */
  async loadUserInfo(token: string): Promise<GitHubUser> {
    this.logger.log(
      "Requesting Github Gateway information about for authorized user",
    );
    return await this.githubApi.fetchUserInfo(token);
  }
}
