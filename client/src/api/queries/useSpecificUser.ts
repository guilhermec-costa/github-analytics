import { GithubUserService } from "@/services/GithubUserService";
import { useQuery } from "@tanstack/react-query";

export default function useSpecificUser(targetUser?: string) {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["userInformation", targetUser],
    queryFn: () => GithubUserService.getSpecificUser(targetUser!, token!),
    enabled: !!token && !!targetUser,
    refetchOnWindowFocus: false,
  });
}
