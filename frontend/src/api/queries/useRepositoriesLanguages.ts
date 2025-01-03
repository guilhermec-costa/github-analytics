import { useGithubUser } from "@/context/githubUserContext";
import { GithubUserService } from "@/services/githubUserService";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function useRepositoriesLanguages() {
  const { userDetails } = useGithubUser();

  React.useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  return useQuery({
    queryKey: ["repoLanguages", userDetails?.login],
    queryFn: () =>
      GithubUserService.getRepositoriesAndLanguages(userDetails.login),
    enabled: !!userDetails?.login,
  });
}
