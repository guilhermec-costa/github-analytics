import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useCommitDetails(
  repo: string,
  username: string,
  commitSha?: string,
) {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["commitDetails", commitSha],
    queryFn: () =>
      GithubUserService.getCommitDetails(username, repo, commitSha!, token!),
    enabled: !!commitSha,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
