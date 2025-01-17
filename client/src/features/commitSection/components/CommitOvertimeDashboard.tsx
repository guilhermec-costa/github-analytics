import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { DetailedRepoCommit } from "shared/types";
import { differenceInDays, format, parseISO, subDays } from "date-fns";
import CommitPeriodPicker from "./CommitPeriodPicker";
import { GithubUserService } from "@/services/GithubUserService";
import useUserInformation from "@/api/queries/useUserInformation";
import { MetricUnit } from "@/utils/types";
import { getFillColor } from "@/utils/chartColors";

export function transformData(data: DetailedRepoCommit[]) {
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
}

export interface CommitPeriodProps {
  since: Date;
  until: Date;
}

interface CommitOvertimeDashboardProps {
  commitsDetails: DetailedRepoCommit[];
  metrics: MetricUnit[];
  setDetailedCommitPeriod: (period: DetailedRepoCommit) => void;
  searchUser: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const periodInitialValue = {
  since: subDays(new Date(), 30),
  until: new Date(),
};

type DynamicCommitCount = {
  date: string;
  [key: string]: string | number;
};

export default function CommitOvertimeDashboard({
  commitsDetails,
  setDetailedCommitPeriod,
  searchUser,
  metrics,
}: CommitOvertimeDashboardProps) {
  const [commitPeriod, setCommitPeriod] =
    React.useState<CommitPeriodProps>(periodInitialValue);

  const [presentCommits, setPresentCommits] =
    React.useState<DetailedRepoCommit[]>(commitsDetails);

  const [data, setData] = React.useState<DetailedRepoCommit[]>([]);

  // const data = React.useMemo(() => {
  // const sortedCommits = presentCommits.sort(
  //   (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  // );
  // const datesLength =
  //   differenceInDays(commitPeriod.until, commitPeriod.since) + 10;
  // return Array.from({ length: datesLength }, (_, i) => {
  //   const date = format(
  //     subDays(commitPeriod.until, datesLength - 1 - i),
  //     "yyyy-MM-dd",
  //   );
  //   const existingCommit = sortedCommits.find(
  //     (commit) => format(parseISO(commit.date), "yyyy-MM-dd") === date,
  //   );
  //   return existingCommit || { date, commits: 0 };
  // });
  // }, [presentCommits, commitPeriod]);

  // const maxCommits = Math.max(...data.map((d) => d.commits));

  const handleChartClick = React.useCallback(
    (e: any) => {
      if (e && e.activePayload && e.activePayload.length) {
        setDetailedCommitPeriod(
          e.activePayload[0].payload as DetailedRepoCommit,
        );
      }
    },
    [setDetailedCommitPeriod],
  );

  React.useEffect(() => {
    const fetchCommitPeriod = async () => {
      if (searchUser && commitPeriod && metrics) {
        let commitsData: DetailedRepoCommit[];
        if (localStorage.getItem("commitsData")) {
          commitsData = JSON.parse(localStorage.getItem("commitsData")!);
        } else {
          commitsData = await Promise.all(
            metrics.map((repo) =>
              GithubUserService.getCommitSinceUntil(
                searchUser,
                repo.repo!,
                commitPeriod.since,
                commitPeriod.until,
              ),
            ),
          ).then((arr) => arr.flat());
          localStorage.setItem("commitData", JSON.stringify(commitsData));
        }

        setData(commitsData);
      }
    };

    fetchCommitPeriod();
  }, [commitPeriod, metrics, searchUser]);

  const repos = React.useMemo(() => {
    console.log("repos inside memo: ", data);
    return Array.from(new Set(data.map((item) => item.repo))) || [];
  }, [data]);

  return (
    <Card className="w-full">
      <section className="flex justify-between">
        <CardHeader>
          <CardDescription>
            Daily commit activity between {commitPeriod.since.toDateString()} -{" "}
            {commitPeriod.until.toDateString()}
          </CardDescription>
        </CardHeader>
        <CommitPeriodPicker setCommitPeriod={setCommitPeriod} />
      </section>

      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformData(data)}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="hsl(var(--secondary))" />
            <XAxis dataKey="date" stroke="#24292e" tick={{ fill: "#24292e" }} />
            <YAxis
              stroke="#24292e"
              tick={{ fill: "#24292e" }}
              label={{
                value: "Commits",
                angle: -90,
                position: "insideLeft",
                fill: "#24292e",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f6f8fa",
                border: "1px solid #e1e4e8",
                borderRadius: "6px",
              }}
            />
            <Legend />
            {repos.map((repo, index) => {
              console.log(repo);
              return (
                <Line
                  key={repo}
                  type="monotone"
                  dataKey={repo}
                  stroke={getFillColor(index)}
                  activeDot={{ r: 8 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
