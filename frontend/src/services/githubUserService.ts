import { BackendHttpClient } from "@/lib/http/BackendClient";
import { ProjectLanguages } from "@/utils/types";

export class GithubUserService {
  static async getRepositoriesAndLanguages(username: string) {
    const data = await BackendHttpClient.get<ProjectLanguages>(
      `repoLanguages/owner/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    return data.data;
  }

  static async getLoggedUserInfo(token: string) {
    const data = await BackendHttpClient.get("userInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  }
}
