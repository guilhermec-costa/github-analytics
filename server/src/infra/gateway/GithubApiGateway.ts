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

  async fetchUserRepoCommitsSinceUntil(
    repoOwner: string,
    repoName: string,
    token: string,
    since: string,
    until: string = new Date().toISOString(),
  ): Promise<RepoCommit[]> {
    let page = 1;
    const today = new Date();
    if (!since) {
      since = new Date(today.setDate(today.getDate() - 60)).toISOString();
    }

    let url = `/repos/${repoOwner}/${repoName}/commits`;
    let pagesRemaining: boolean = true;
    let data: RepoCommit[] = [];

    while (pagesRemaining) {
      const response = await this.httpClient().get<RepoCommit[]>(url, {
        headers: {
          Authorization: token,
        },
        params: {
          per_page: 100,
          page,
          since,
          until,
        },
      });

      data = [...data, ...response.data];

      const linkHeader: string = response.headers.link;
      pagesRemaining = !!linkHeader && linkHeader.includes(`rel=\"next\"`);

      if (pagesRemaining) {
        page += 1;
      }
    }

    return data;
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
    let page = 1;
    let url = `/users/${username}/repos?per_page=100&page=${page}`;
    let pagesRemaining: boolean = true;
    let data: GithubRepo[] = [];

    while (pagesRemaining) {
      const response = await this.httpClient().get<GithubRepo[]>(url, {
        headers: {
          Authorization: token,
        },
      });

      data = [...data, ...response.data];

      const linkHeader: string = response.headers.link;
      pagesRemaining = !!linkHeader && linkHeader.includes(`rel=\"next\"`);

      if (pagesRemaining) {
        page += 1;
        url = `/users/${username}/repos?per_page=100&page=${page}`;
      }
    }

    return data;
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
