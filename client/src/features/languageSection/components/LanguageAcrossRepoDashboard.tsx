import React from "react";
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
  Cell,
} from "recharts";
import { MetricUnit } from "@/utils/types";
import { formatBytes } from "@/utils/bytes";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"];

export default function LanguageAcrossRepoDashboard({
  metric,
}: {
  metric: MetricUnit;
}) {
  const data = React.useMemo(() => {
    return metric.LanguageDetails.sort((a, b) => b.count - a.count).slice(
      0,
      10,
    );
  }, [metric.LanguageDetails]);

  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
        <CardDescription>
          Top 10 languages used across the repository
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide domain={[0, maxCount]} />
              <YAxis
                dataKey="language"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="font-medium">
                          {payload[0].payload.language}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Count:{" "}
                          <span className="font-medium">
                            {formatBytes(
                              parseInt(payload[0].value?.toString() || ""),
                            )}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {data.map((item, index) => (
            <div key={item.language} className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{item.language}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
