import { GithubUserService } from "@/services/GithubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useLoggerUserInformation() {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["userInformation"],
    queryFn: () => GithubUserService.getLoggedUserInfo(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
}
