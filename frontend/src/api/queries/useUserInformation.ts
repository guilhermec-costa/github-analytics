import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useUserInformation() {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["userInformation"],
    queryFn: () => GithubUserService.getLoggedUserInfo(token!),
    enabled: !!token,
  });
}
