import { GithubUserService } from "@/services/GithubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useRepositoriesMetrics(username?: string) {
  return useQuery({
    queryKey: ["repoMetrics", username],
    queryFn: () => GithubUserService.getRepositoryMetrics(username!),
    enabled: !!username,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}
