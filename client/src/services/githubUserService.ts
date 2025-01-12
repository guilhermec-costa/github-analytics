import { BackendHttpClient } from "@/lib/http/BackendClient";
import { RepoMetrics } from "shared/types";
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

  static async getLoggedUserInfo(token: string) {
    const data = await BackendHttpClient.get("user/authorized", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
