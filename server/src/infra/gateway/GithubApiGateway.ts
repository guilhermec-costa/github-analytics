import { IGithubApiGateway } from "../../application/gateway/IGithubApiGateway";
import { GithubGateway } from "./GithubGateway";
import { GithubRepo, RepoLanguageCount } from "../../utils/types/repository";
import { GithubUser } from "../../utils/types/githubUser";
import { CommitDetail, RepoCommit } from "../../utils/types/commit";

export class GithubApiGateway
  extends GithubGateway
  implements IGithubApiGateway
{
  constructor() {
    super("https://api.github.com");
  }

  async fetchSpecificUserRepos(
    token: string,
    username: string,
  ): Promise<GithubRepo[]> {
    const url = `/users/${username}/repos`;
    const res = await this.httpClient().get<GithubRepo[]>(url, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  }

  async fetchSpecificUser(token: string, username: string): Promise<any> {
    const url = `/users/${username}`;
    const response = await this.httpClient().get<CommitDetail>(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async fetchCommitDetail(
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

  async fetchUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<RepoCommit[]> {
    const url = `/repos/${repoOwner}/${repoName}/commits?per_page=20`;
    const response = await this.httpClient().get<RepoCommit[]>(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async fetchRepoLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<RepoLanguageCount> {
    const url = `/repos/${repoOwner}/${repoName}/languages`;
    const response = await this.httpClient().get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  async fetchUserRepos(token: string, username: string): Promise<GithubRepo[]> {
    const url = `/users/${username}/repos`;
    const response = await this.httpClient().get<GithubRepo[]>(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async fetchAuthorizedUserInfo(userToken: string): Promise<GithubUser> {
    const url = "/user";
    const response = await this.httpClient().get<GithubUser>(url, {
      headers: {
        Authorization: userToken,
      },
    });

    return response.data;
  }
}
