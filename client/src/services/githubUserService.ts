import { BackendHttpClient } from "@/lib/http/BackendClient";
import { GithubUser, RepoMetrics } from "shared/types";
import { CommitDetail } from "../../../server/src/utils/types/commit";

export class GithubUserService {
  static async getRepositoryMetrics(username: string) {
    const cachedData = localStorage.getItem("metricsData");

    // if (cachedData) {
    //   return JSON.parse(cachedData) as RepoMetrics;
    // }
    const data = await BackendHttpClient.get<RepoMetrics>(
      `repo/metrics/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    if (!cachedData) {
      localStorage.setItem("metricsData", JSON.stringify(data.data));
    }

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
    const data = await BackendHttpClient.get<any>(
      `user/specific?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data.data;
  }
}
