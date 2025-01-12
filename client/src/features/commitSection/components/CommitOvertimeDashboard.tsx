import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
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
import { MetricUnit } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import { format, parseISO, subDays } from "date-fns";

export default function CommitOvertimeDashboard({
  metric,
  setDetailedCommitPeriod,
}: {
  metric: MetricUnit;
  setDetailedCommitPeriod: (period: DetailedRepoCommit) => void;
}) {
  const data = React.useMemo(() => {
    const sortedCommits = [...metric.CommitDetails].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const today = new Date();

    return Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(today, 29 - i), "yyyy-MM-dd");
      const existingCommit = sortedCommits.find(
        (commit) => format(parseISO(commit.date), "yyyy-MM-dd") === date,
      );
      return existingCommit || { date, commits: 0 };
    });
  }, [metric.CommitDetails]);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>
          Daily commit activity over the last 30 days
        </CardDescription>
      </CardHeader>

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
