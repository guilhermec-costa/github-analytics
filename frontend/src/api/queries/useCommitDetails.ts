import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";
import useUserInformation from "./useUserInformation";
import { CommitCount, DeepDetailedCommit } from "@/utils/types";

export default function useCommitDetails(
  repo: string,
  commitDetails: CommitCount,
) {
  const userInfo = useUserInformation();
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["commitDetails", repo, commitDetails.date],
    queryFn: async () => {
      const data: DeepDetailedCommit[] = [];
      for (const commit of commitDetails.details) {
        data.push(
          await GithubUserService.getCommitDetails(
            userInfo.data.login,
            repo,
            commit.sha,
            token!,
          ),
        );
      }

      return data;
    },
    enabled: userInfo.status === "success" && !!commitDetails && !!repo,
  });
}
