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
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { DetailedRepoCommit } from "shared/types";
import { subDays } from "date-fns";
import CommitPeriodPicker from "./CommitPeriodPicker";
import { MetricUnit } from "@/utils/types";
import { getFillColor } from "@/utils/chartColors";
import { CategoricalChartState } from "recharts/types/chart/types";
import useCommitDashboardLogic from "@/hooks/useCommitDashboardLogic";

export interface CommitPeriodProps {
  since: Date;
  until: Date;
}

interface CommitOvertimeDashboardProps {
  metrics: MetricUnit[];
  setDetailedCommitsPeriods: (period: DetailedRepoCommit[]) => void;
  searchUser: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const periodInitialValue = {
  since: subDays(new Date(), 30),
  until: new Date(),
};

export default function CommitOvertimeDashboard({
  setDetailedCommitsPeriods,
  searchUser,
  metrics,
}: CommitOvertimeDashboardProps) {
  const {
    commitPeriod,
    setCommitPeriod,
    transformedData,
    repos,
    data,
    maxCommits,
  } = useCommitDashboardLogic(metrics, searchUser);

  const handleChartClick = React.useCallback(
    (e: CategoricalChartState) => {
      if (e && e.activePayload && e.activePayload.length) {
        const clickedDate = Array.from(
          new Set(e.activePayload.map((i) => i.payload.date)),
        )[0];
        const detailedCommits = data
          .filter((detail) => detail.date === clickedDate)
          .flat();

        setDetailedCommitsPeriods(detailedCommits);
      }
    },
    [setDetailedCommitsPeriods, data],
  );

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
            data={transformedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={handleChartClick}
          >
            <CartesianGrid stroke="hsl(var(--secondary))" />
            <XAxis
              dataKey="date"
              stroke="#24292e"
              tick={{ fill: "#24292e", fontSize: 12 }}
            />
            <YAxis
              stroke="#24292e"
              domain={[0, maxCommits]}
              tick={{ fill: "#24292e" }}
              label={{
                value: "Commits",
                angle: -90,
                position: "insideLeft",
                fill: "#24292e",
              }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="font-medium">{payload[0].name}</p>
                      <small className="text-foreground/70 block">
                        Commits: {payload[0].value?.toString()}
                      </small>
                      <small className="text-foreground/70">
                        Date: {payload[0].payload.date}
                      </small>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {repos.map((repo, index) => {
              return (
                !!repo && (
                  <Line
                    key={repo}
                    type="monotone"
                    dataKey={repo}
                    stroke={getFillColor(index)}
                  />
                )
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
