import useCommitDataQuery from "@/api/queries/userCommitDataQuery";
import {
  CommitPeriodProps,
  periodInitialValue,
} from "@/features/commitSection/components/CommitOvertimeDashboard";
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
  const maxCommits = Math.max(...data.map((d) => d.commits));

  const applyDateCompensationOnData = React.useCallback(
    (_data: DetailedRepoCommit[]) => {
      const sortedCommits = _data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const datesLength =
        differenceInDays(commitPeriod.until, commitPeriod.since) + 10;

      const compensatedData = Array.from({ length: datesLength }, (_, i) => {
        const date = format(
          subDays(commitPeriod.until, datesLength - 1 - i),
          "yyyy-MM-dd",
        );

        const _repos = _data.map((detail) => detail.repo);

        const existingCommit = sortedCommits.find(
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

  const { data: commitData, status } = useCommitDataQuery({
    searchUser,
    commitPeriod,
    metrics,
  });

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

  React.useEffect(() => {
    if (status === "success") {
      setData(commitData);
    }
  }, [applyDateCompensationOnData, commitData, status]);

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
    maxCommits,
  };
}
