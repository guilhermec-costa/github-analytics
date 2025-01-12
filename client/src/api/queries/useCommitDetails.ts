import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";
import { ParsedCommitDetails } from "../../../../server/src/utils/types/commit";

export default function useCommitDetails(
  repo: string,
  commitDetail: ParsedCommitDetails,
  username: string,
) {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["commitDetails", repo, commitDetail, username!],
    queryFn: async () =>
      GithubUserService.getCommitDetails(
        username,
        repo,
        commitDetail.sha,
        token!,
      ),
    enabled: !!commitDetail && !!repo && !!username,
  });
}
