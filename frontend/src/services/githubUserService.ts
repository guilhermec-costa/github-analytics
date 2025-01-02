import { BackendHttpClient } from "@/lib/http/BackendClient";
import { repositoryLanguage } from "@/utils/types";

export class GithubUserService {
  static async getRepositoriesAndLanguages() {
    const data = await BackendHttpClient.get<repositoryLanguage[]>(
      `repoLanguages/owner/${localStorage.getItem("username")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );

    return data;
  }
}
