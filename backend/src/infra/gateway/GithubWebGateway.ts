import { IGithubWebGateway } from "../../application/gateway/IGithubWebGateway";
import { AuthCredentials } from "../../utils/types/githubUser";
import { GithubGateway } from "./GithubGateway";

export class GithubWebGateway
  extends GithubGateway
  implements IGithubWebGateway
{
  constructor(
    private readonly GITHUB_CLIENT_SECRET: string,
    private readonly GITHUB_CLIENT_ID: string,
  ) {
    super("https://github.com");
  }

  async oauth(code: string): Promise<AuthCredentials> {
    const url = "/login/oauth/access_token";
    const response = await this.httpClient().post(url, null, {
      params: {
        client_id: this.GITHUB_CLIENT_ID,
        client_secret: this.GITHUB_CLIENT_SECRET,
        code: code,
      },
    });

    const { access_token: accessToken, refresh_token: refreshToken } =
      response.data;
    return { accessToken, refreshToken };
  }

  async refreshToken(_refreshToken: string): Promise<AuthCredentials> {
    const url = "/login/oauth/access_token";
    const response = await this.httpClient().post(url, null, {
      params: {
        client_id: this.GITHUB_CLIENT_ID,
        client_secret: this.GITHUB_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: _refreshToken,
      },
    });

    const { access_token: accessToken, refresh_token: refreshToken } =
      response.data;
    return { accessToken, refreshToken };
  }
}
