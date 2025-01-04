import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { CommitCount, MetricUnit } from "@/utils/types";
import { CategoricalChartState } from "recharts/types/chart/types";

export default function CommitChart({
  metric,
  setDetailedCommitPeriod,
}: {
  metric: MetricUnit;
  setDetailedCommitPeriod: (period: CommitCount) => void;
}) {
  function manageSelectedDetailedCommit(e: CategoricalChartState) {
    const commitDetails = e.activePayload?.at(0).payload;
    setDetailedCommitPeriod(commitDetails as CommitCount);
  }
  return (
    <Card className="w-full shadow-xl border border-border bg-background">
      {/* Cabeçalho do Card */}
      <CardHeader>
        <CardTitle className="text-lg font-bold">Commit Activity</CardTitle>
        <CardDescription>Daily commit activity over time.</CardDescription>
      </CardHeader>

      {/* Gráfico */}
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={metric.CommitDetails}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            onClick={manageSelectedDetailedCommit}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
            {/* Eixo X */}
            <XAxis
              type="category"
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--foreground-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            {/* Eixo Y */}
            <YAxis
              type="number"
              dataKey="commits"
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            {/* Tooltip Customizado */}
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
            {/* Área do Gráfico */}
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
