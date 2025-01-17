import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CommitPeriodProps,
  periodInitialValue,
} from "@/features/commitSection/components/CommitOvertimeDashboard";
import { GithubUserService } from "@/services/GithubUserService";
import { MetricUnit } from "@/utils/types";
import { differenceInDays, format, parseISO, subDays } from "date-fns";
import React from "react";
import { DetailedRepoCommit } from "shared/types";

export default function useCommitDashboardLogic(
  metrics: MetricUnit[],
  searchUser: string,
) {
  const [commitPeriod, setCommitPeriod] =
    React.useState<CommitPeriodProps>(periodInitialValue);
  const [data, setData] = React.useState<DetailedRepoCommit[]>([]);
  const transformData = React.useCallback((data: DetailedRepoCommit[]) => {
    const repoMap = new Map<string, Map<string, number>>();
    const dateSet = new Set<string>();

    data.forEach((item) => {
      dateSet.add(item.date);
      if (!repoMap.has(item.repo)) {
        repoMap.set(item.repo, new Map());
      }
      repoMap.get(item.repo)!.set(item.date, item.commits);
    });

    const sortedDates = Array.from(dateSet).sort();
    const repos = Array.from(repoMap.keys());

    return sortedDates.map((date) => {
      const dataPoint: { [key: string]: string | number } = { date };
      repos.forEach((repo) => {
        dataPoint[repo] = repoMap.get(repo)!.get(date) || 0;
      });
      return dataPoint;
    });
  }, []);

  const applyDateCompensationOnData = React.useCallback(
    (_data: DetailedRepoCommit[]) => {
      const datesLength =
        differenceInDays(commitPeriod.until, commitPeriod.since) + 10;

      const compensatedData = Array.from({ length: datesLength }, (_, i) => {
        const date = format(
          subDays(commitPeriod.until, datesLength - 1 - i),
          "yyyy-MM-dd",
        );
        const existingCommit = _data.find(
          (commit) => format(parseISO(commit.date), "yyyy-MM-dd") === date,
        );
        return (
          existingCommit ||
          ({
            commits: 0,
            date,
            details: [],
            repo: "",
          } as DetailedRepoCommit)
        );
      });

      return compensatedData;
    },
    [commitPeriod],
  );
  React.useEffect(() => {
    async function fetchData() {
      if (searchUser && commitPeriod && metrics) {
        const commitsData = await Promise.all(
          metrics.map((repo: any) =>
            GithubUserService.getCommitSinceUntil(
              searchUser,
              repo.repo!,
              commitPeriod.since,
              commitPeriod.until,
            ),
          ),
        ).then((arr) => arr.flat());
        setData(applyDateCompensationOnData(commitsData));
      }
    }

    fetchData();
  }, [applyDateCompensationOnData, commitPeriod, metrics, searchUser]);

  const transformedData = React.useMemo(
    () => transformData(data),
    [data, transformData],
  );

  const repos = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.repo))),
    [data],
  );

  return {
    commitPeriod,
    setCommitPeriod,
    transformedData,
    repos,
    data,
  };
}
