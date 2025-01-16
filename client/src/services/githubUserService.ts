import { BackendHttpClient } from "@/lib/http/BackendClient";
import { DetailedRepoCommit, GithubUser, RepoMetrics } from "shared/types";
import { CommitDetail } from "../../../server/src/utils/types/commit";

export class GithubUserService {
  static async getRepositoryMetrics(username: string) {
    const data = await BackendHttpClient.get<RepoMetrics>(
      `repo/metrics/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    return data.data;
  }

  static async getLoggedUserInfo(token: string): Promise<GithubUser> {
    const useInfoCacheKey = "userInfo";
    const userCacheInfo = localStorage.getItem(useInfoCacheKey);
    if (userCacheInfo) {
      return JSON.parse(userCacheInfo);
    }

    const data = await BackendHttpClient.get<GithubUser>("user/authorized", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userCacheInfo) {
      localStorage.setItem(useInfoCacheKey, JSON.stringify(data.data));
    }

    return data.data;
  }

  static async getCommitDetails(
    owner: string,
    repo: string,
    sha: string,
    token: string,
  ) {
    const data = await BackendHttpClient.get<CommitDetail>(
      `repo/owner/${owner}/repo/${repo}/commitDetail/${sha}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data.data;
  }

  static async getSpecificUser(username: string, token: string) {
    const data = await BackendHttpClient.get<GithubUser>(
      `user/specific?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data.data;
  }

  static async getCommitSinceUntil(
    user: string,
    repo: string,
    since: Date,
    until: Date = new Date(),
  ) {
    const formmatedSince = since.toISOString();
    const formmatedUntil = until.toISOString();

    const data = await BackendHttpClient.get<DetailedRepoCommit[]>(
      `commits/owner/${user}/repo/${repo}?since=${formmatedSince}&until=${formmatedUntil}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    return data.data;
  }
}
