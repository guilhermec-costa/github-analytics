import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MetricUnit, RepoMeasureDimension } from "@/utils/types";

export default function LanguageChart({
  metric,
  dimension,
}: {
  metric: MetricUnit;
  dimension: string;
}) {
  return (
    <Card className="w-full shadow-xl border border-border bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Language Distribution
        </CardTitle>
        <CardDescription>
          Breakdown of languages used across the repository.
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metric.LanguageDetails}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <XAxis
              type="number"
              dataKey="count"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
            />
            <YAxis
              type="category"
              dataKey="language"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 13,
                fontWeight: "regular",
                fill: "#ffffff",
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload }) =>
                active && payload && payload.length ? (
                  <div className="p-3 bg-popover text-popover-foreground rounded-md shadow-md">
                    <p className="font-semibold">
                      {payload[0].payload.language}
                    </p>
                    <p>
                      {dimension} Count: <strong>{payload[0].value}</strong>
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="count"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
