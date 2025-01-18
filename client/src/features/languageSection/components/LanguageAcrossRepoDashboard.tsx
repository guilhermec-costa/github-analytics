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
  CartesianGrid,
} from "recharts";
import { MetricUnit } from "@/utils/types";
import { formatBytes } from "@/utils/bytes";
import { getFillColor } from "@/utils/chartColors";

interface LanguageAcrossRepoDashboardProps {
  metrics: MetricUnit[];
}

export default function LanguageAcrossRepoDashboard({
  metrics,
}: LanguageAcrossRepoDashboardProps) {
  const data = React.useMemo(() => {
    const metricDetails = metrics.reduce<Record<string, number>>(
      (acc, metric) => {
        metric.LanguageDetails.forEach(({ language, count }) => {
          acc[language] = (acc[language] || 0) + count;
        });

        return acc;
      },
      {},
    );

    return Object.entries(metricDetails)
      .map(([language, count]) => ({ language, count }))
      .sort((lA, lB) => lB.count - lA.count);
  }, [metrics]);

  const maxCount = Math.max(...data.map((item) => item.count));
  return (
    <Card className="w-full mt-8 p-0">
      <CardHeader className="p-0">
        <CardTitle>Language Distribution</CardTitle>
        <CardDescription>
          Top 10 languages used across the repository
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer className="aspect-auto h-[250px] w-full">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, bottom: 5 }}
            >
              <XAxis type="number" hide domain={[0, maxCount]} />
              <YAxis
                dataKey="language"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                width={100}
              />
              <CartesianGrid opacity={"0.2"} strokeDasharray="3 3" />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="font-medium">
                          {payload[0].payload.language}
                        </p>
                        <h5 className="text-sm text-muted-foreground">
                          Count:{" "}
                          <span className="font-medium">
                            {formatBytes(
                              parseInt(payload[0].value?.toString() || ""),
                            )}
                          </span>
                        </h5>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={getFillColor(idx)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((item, index) => (
            <div key={item.language} className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getFillColor(index) }}
              />
              <span className="text-sm">{item.language}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
