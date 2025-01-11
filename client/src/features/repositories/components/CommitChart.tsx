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
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { MetricUnit } from "@/utils/types";
import { CategoricalChartState } from "recharts/types/chart/types";
import { DetailedRepoCommit } from "shared/types";

export default function CommitChart({
  metric,
  setDetailedCommitPeriod,
}: {
  metric: MetricUnit;
  setDetailedCommitPeriod: (period: DetailedRepoCommit) => void;
}) {
  function manageSelectedDetailedCommit(e: CategoricalChartState) {
    const commitDetails = e.activePayload?.at(0).payload;
    setDetailedCommitPeriod(commitDetails as DetailedRepoCommit);
  }
  return (
    <Card className="w-full shadow-xl border border-border bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Commit Activity</CardTitle>
        <CardDescription>Daily commit activity over time.</CardDescription>
      </CardHeader>

      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={metric.CommitDetails}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            onClick={manageSelectedDetailedCommit}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
            <XAxis
              type="category"
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--foreground-muted)" }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="commits"
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) =>
                active && payload && payload.length ? (
                  <div className="p-3 bg-popover text-popover-foreground rounded-md shadow-md">
                    <p className="font-semibold">
                      {new Date(payload[0].payload.date).toLocaleDateString()}
                    </p>
                    <p>
                      Commits: <strong>{payload[0].value}</strong>
                    </p>
                  </div>
                ) : null
              }
            />
            <CartesianGrid />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="hsl(var(--primary))"
              fill="url(#gradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
