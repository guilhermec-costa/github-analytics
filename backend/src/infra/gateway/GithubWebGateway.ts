import { IGithubWebGateway } from "../../application/gateway/IGithubWebGateway";
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

  async auth(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const url = "/login/oauth/access_token";
    const response = await this.httpClient().post(url, null, {
      params: {
        client_id: this.GITHUB_CLIENT_ID,
        client_secret: this.GITHUB_CLIENT_SECRET,
        code: code,
      },
    });

    const { access_token, refresh_token } = response.data;
    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const url = "/login/oauth/access_token";
    const response = await this.httpClient().post(url, null, {
      params: {
        client_id: this.GITHUB_CLIENT_ID,
        client_secret: this.GITHUB_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    });

    const { access_token, refresh_token } = response.data;
    return { accessToken: access_token, refreshToken: refresh_token };
  }
}
