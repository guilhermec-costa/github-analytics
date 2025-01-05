import { BackendHttpClient } from "@/lib/http/BackendClient";
import { RepositoryMetrics } from "@/utils/types";

export class GithubUserService {
  static async getRepositoryMetrics(username: string) {
    const cachedData = localStorage.getItem("metricsData");

    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const data = await BackendHttpClient.get<RepositoryMetrics>(
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
    const data = await BackendHttpClient.get("user/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  }
}
