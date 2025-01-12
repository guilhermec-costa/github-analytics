import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useRepositoriesMetrics(username: string | undefined) {
  return useQuery({
    queryKey: ["repoMetrics", username!],
    queryFn: () => GithubUserService.getRepositoryMetrics(username!),
    enabled: !!username,
  });
}
