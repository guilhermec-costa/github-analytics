import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";
import useUserInformation from "./useUserInformation";
import { ParsedCommitDetails } from "../../../../server/src/utils/types/commit";

export default function useCommitDetails(
  repo: string,
  commitDetail: ParsedCommitDetails,
) {
  const userInfo = useUserInformation();
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["commitDetails", repo, commitDetail],
    queryFn: async () =>
      GithubUserService.getCommitDetails(
        userInfo.data.login,
        repo,
        commitDetail.sha,
        token!,
      ),
    enabled: userInfo.status === "success" && !!commitDetail && !!repo,
  });
}
