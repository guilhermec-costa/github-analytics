import { BackendHttpClient } from "@/lib/http/BackendClient";
import { ProjectLanguages } from "@/utils/types";

export class GithubUserService {
  static async getRepositoriesAndLanguages(username: string) {
    const data = await BackendHttpClient.get<ProjectLanguages>(
      `repo/languages/owner/${username}`,
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
