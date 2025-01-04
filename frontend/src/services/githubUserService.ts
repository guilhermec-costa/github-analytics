import { BackendHttpClient } from "@/lib/http/BackendClient";
import { RepositoryMetrics } from "@/utils/types";

export class GithubUserService {
  static async getRepositoryMetrics(username: string) {
    const data = await BackendHttpClient.get<RepositoryMetrics>(
      `repo/metrics/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

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
