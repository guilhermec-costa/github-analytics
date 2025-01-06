import {
  CommitDetail,
  CommitResponse,
  GitHubRepository,
  GitHubUser,
} from "../../utils/types";
import { IGithubApiGateway } from "../../application/gateway/IGithubApiGateway";
import { GithubGateway } from "./GithubGateway";

export class GithubApiGateway
  extends GithubGateway
  implements IGithubApiGateway
{
  constructor() {
    super("https://api.github.com");
  }

  async getCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail> {
    const url = `/repos/${owner}/${repo}/commits/${id}`;
    const response = await this.httpClient().get<CommitDetail>(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async getUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<CommitResponse[]> {
    const url = `/repos/${repoOwner}/${repoName}/commits`;
    const response = await this.httpClient().get<CommitResponse[]>(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async getRepositoryLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<{ [language: string]: number }> {
    const url = `/repos/${repoOwner}/${repoName}/languages`;
    const response = await this.httpClient().get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  async getUserRepositories(userToken: string): Promise<GitHubRepository[]> {
    const url = "/user/repos";
    const response = await this.httpClient().get<GitHubRepository[]>(url, {
      headers: {
        Authorization: userToken,
      },
    });

    return response.data;
  }

  async getUserInformation(userToken: string): Promise<GitHubUser> {
    const url = "/user";
    const response = await this.httpClient().get<GitHubUser>(url, {
      headers: {
        Authorization: userToken,
      },
    });

    return response.data;
  }
}
