import { CommitPeriodProps } from "@/features/commitSection/components/CommitOvertimeDashboard";
import { GithubUserService } from "@/services/GithubUserService";
import { MetricUnit } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

interface UseCommitDataQueryProps {
  searchUser: string;
  commitPeriod: CommitPeriodProps;
  metrics: MetricUnit[];
}
function useCommitDataQuery({
  searchUser,
  commitPeriod,
  metrics,
}: UseCommitDataQueryProps) {
  const fetchCommits = async () => {
    if (!searchUser || !commitPeriod || !metrics) {
      throw new Error("Missing parameters");
    }

    const commitsData = await Promise.all(
      metrics.map((metric: MetricUnit) =>
        GithubUserService.getCommitSinceUntil(
          searchUser,
          metric.repo!,
          commitPeriod.since,
          commitPeriod.until,
        ),
      ),
    ).then((arr) => arr.flat());

    return commitsData;
  };

  return useQuery({
    queryKey: ["commits", searchUser, commitPeriod, metrics],
    queryFn: fetchCommits,
    enabled: !!searchUser && !!commitPeriod && !!metrics.length,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export default useCommitDataQuery;
