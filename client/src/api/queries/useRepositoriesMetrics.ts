import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";
import useUserInformation from "./useUserInformation";

export default function useRepositoriesMetrics() {
  const userInfo = useUserInformation();

  return useQuery({
    queryKey: ["repoMetrics"],
    queryFn: () => GithubUserService.getRepositoryMetrics(userInfo.data.login),
    enabled: userInfo.status === "success",
  });
}
