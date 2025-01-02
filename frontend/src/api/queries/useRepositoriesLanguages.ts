import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useRepositoriesLangugaes() {
  return useQuery({
    queryKey: ["repoLanguages"],
    queryFn: GithubUserService.getRepositoriesAndLanguages,
  });
}
