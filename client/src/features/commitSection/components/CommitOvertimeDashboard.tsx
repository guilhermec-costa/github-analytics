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
import { Separator } from "@/components/ui/separator";

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
      <section className="flex-col md:flex md:justify-between">
        <CardHeader className="p-0 mb-3">
          <CardDescription>
            Daily commit activity between {commitPeriod.since.toDateString()} -{" "}
            {commitPeriod.until.toDateString()}
          </CardDescription>
        </CardHeader>
        <CommitPeriodPicker setCommitPeriod={setCommitPeriod} />
      </section>

      {transformedData.length > 0 ? (
        <CardContent className="p-2 sm:p-4 h-[300px] sm:h-[400px] md:h-[500px]">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transformedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={handleChartClick}
              >
                <CartesianGrid
                  stroke="hsl(var(--secondary))"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
                  tickMargin={10}
                />
                <YAxis
                  stroke="hsl(var(--secondary))"
                  domain={[0, maxCommits]}
                  tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          {payload.map((point) => {
                            return (
                              <>
                                <small className="font-medium">
                                  {point.name}
                                </small>
                                <small className="text-foreground/70 block">
                                  Commits: {point.value?.toString()}
                                </small>
                              </>
                            );
                          })}
                          <Separator className="my-2" />
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
                        type="monotone"
                        key={repo}
                        dataKey={repo}
                        stroke={getFillColor(index)}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    )
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      ) : (
        <p className="text-foreground/70 text-center">
          No data available for the selected period.
        </p>
      )}
    </Card>
  );
}
