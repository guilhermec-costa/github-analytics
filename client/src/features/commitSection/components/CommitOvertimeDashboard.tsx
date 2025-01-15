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
} from "recharts";
import { DetailedRepoCommit } from "shared/types";
import { differenceInDays, format, parseISO, subDays } from "date-fns";
import CommitPeriodPicker from "./CommitPeriodPicker";
import { GithubUserService } from "@/services/GithubUserService";
import useUserInformation from "@/api/queries/useUserInformation";

export interface CommitPeriodProps {
  since: Date;
  until: Date;
}

interface CommitOvertimeDashboardProps {
  commitsDetails: DetailedRepoCommit[];
  setDetailedCommitPeriod: (period: DetailedRepoCommit) => void;
  selectedRepository: string;
}

export const periodInitialValue = {
  since: subDays(new Date(), 30),
  until: new Date(),
};

export default function CommitOvertimeDashboard({
  commitsDetails,
  setDetailedCommitPeriod,
  selectedRepository,
}: CommitOvertimeDashboardProps) {
  const userInfo = useUserInformation();
  const [commitPeriod, setCommitPeriod] =
    React.useState<CommitPeriodProps>(periodInitialValue);

  const [presentCommits, setPresentCommits] =
    React.useState<DetailedRepoCommit[]>(commitsDetails);

  const data = React.useMemo(() => {
    const sortedCommits = presentCommits.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const datesLength =
      differenceInDays(commitPeriod.until, commitPeriod.since) + 10;
    return Array.from({ length: datesLength }, (_, i) => {
      const date = format(
        subDays(commitPeriod.until, datesLength - 1 - i),
        "yyyy-MM-dd",
      );
      const existingCommit = sortedCommits.find(
        (commit) => format(parseISO(commit.date), "yyyy-MM-dd") === date,
      );
      return existingCommit || { date, commits: 0 };
    });
  }, [presentCommits, commitPeriod]);

  const maxCommits = Math.max(...data.map((d) => d.commits));

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
      if (userInfo.data?.login && commitPeriod) {
        const commitData = await GithubUserService.getCommitSinceUntil(
          userInfo.data?.login,
          selectedRepository,
          commitPeriod.since,
          commitPeriod.until,
        );
        setPresentCommits(commitData);
      }
    };

    fetchCommitPeriod();
  }, [commitPeriod, selectedRepository]);

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
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onClick={handleChartClick}
          >
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => format(parseISO(value), "MMM dd")}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(0)}
              domain={[0, maxCommits]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="font-medium">
                        {format(
                          parseISO(payload[0].payload.date),
                          "MMMM d, yyyy",
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Commits:{" "}
                        <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorCommits)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
