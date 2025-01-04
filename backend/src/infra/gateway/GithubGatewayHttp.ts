import axios, { AxiosError, AxiosInstance } from "axios";
import { IGithubGateway } from "../../application/gateway/IGithubGateway";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "../../utils/Exceptions";
import {
  CommitResponse,
  GitHubRepository,
  GitHubUser,
} from "../../utils/types";

export class GithubGatewayHttp implements IGithubGateway {
  private readonly GITHUB_BASE_URL = "https://github.com";
  private readonly GITHUB_API_URL = "https://api.github.com";

  private readonly baseGithubAxiosInstance: AxiosInstance;
  private readonly githubApiAxiosInstance: AxiosInstance;

  constructor(
    private readonly GITHUB_CLIENT_SECRET: string,
    private readonly GITHUB_CLIENT_ID: string,
  ) {
    this.baseGithubAxiosInstance = axios.create({
      baseURL: this.GITHUB_BASE_URL,
      headers: { Accept: "application/json" },
    });

    this.githubApiAxiosInstance = axios.create({
      baseURL: this.GITHUB_API_URL,
      headers: { Accept: "application/json" },
    });

    this.baseGithubAxiosInstance.interceptors.response.use(
      (response) => this.handleSucess(response),
      (error) => this.handleError(error),
    );

    this.githubApiAxiosInstance.interceptors.response.use(
      (response) => this.handleSucess(response),
      (error) => this.handleError(error),
    );
  }

  async getUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<CommitResponse[]> {
    const url = `/repos/${repoOwner}/${repoName}/commits`;
    const response = await this.githubApiAxiosInstance.get<CommitResponse[]>(
      url,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return response.data;
  }

  async getRepositoryLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<{ [language: string]: number }> {
    const url = `/repos/${repoOwner}/${repoName}/languages`;
    const response = await this.githubApiAxiosInstance.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  async getUserRepositories(userToken: string): Promise<GitHubRepository[]> {
    const url = "/user/repos";
    const response = await this.githubApiAxiosInstance.get<GitHubRepository[]>(
      url,
      {
        headers: {
          Authorization: userToken,
        },
      },
    );

    return response.data;
  }

  async getUserInformation(userToken: string): Promise<GitHubUser> {
    const url = "/user";
    const response = await this.githubApiAxiosInstance.get<GitHubUser>(url, {
      headers: {
        Authorization: userToken,
      },
    });

    return response.data;
  }

  async auth(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const url = "/login/oauth/access_token";
    const response = await this.baseGithubAxiosInstance.post(url, null, {
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
    const response = await this.baseGithubAxiosInstance.post(url, null, {
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

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error(
          `[HTTP Error] Status: ${status}, Data: ${JSON.stringify(data)}`,
        );

        switch (status) {
          case 422:
          case 400:
            throw new BadRequest(data?.message || "Bad Request");
          case 401:
            throw new Unauthorized(data?.message || "Unauthorized");
          case 404:
            throw new NotFound(data?.message || "Not Found");
          case 500:
          default:
            throw new InternalServerError(
              data?.message || "Internal Server Error",
            );
        }
      } else if (error.request) {
        console.error(`[Network Error] No response received: ${error.message}`);
        throw new InternalServerError("Network error: No response received");
      } else {
        console.error(`[Axios Error] ${error.message}`);
        throw new InternalServerError(`Request setup error: ${error.message}`);
      }
    } else {
      console.error(`[Unknown Error] ${String(error)}`);
      throw new InternalServerError(`Unknown error: ${String(error)}`);
    }
  }

  private handleSucess(response: any) {
    // Isso é porque o pessoal do gh curte xp programming (faltou daily, review, retro)
    if (response.data.error) {
      this.handleError(
        new AxiosError("", "", undefined, {}, {
          data: { message: response.data.error_description },
          status: 400,
        } as any),
      );
    }
    return response;
  }
}
