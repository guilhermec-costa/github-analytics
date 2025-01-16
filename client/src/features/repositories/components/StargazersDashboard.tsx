import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFillColor } from "@/utils/chartColors";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RepoMetrics } from "shared/types";
import { Star } from "lucide-react";

interface StargazersDashboardProps {
  metrics?: RepoMetrics;
}

export default function StargazersDashboard({
  metrics,
}: StargazersDashboardProps) {
  const data = React.useMemo(() => {
    if (metrics) {
      return Object.entries(metrics)
        .map(([repo, metric]) => ({
          repo,
          stars: metric.StargazersCount || 0,
        }))
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10);
    }
    return [];
  }, [metrics]);

  return (
    <Card className="w-full mt-8 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6" />
          <CardTitle>Top Stargazers</CardTitle>
        </div>
        <CardDescription>
          Repositories with the most stars (Top 10)
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
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="repo"
                width={200}
                tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border p-3 bg-popover">
                        <p className="font-medium text-popover-foreground">
                          {payload[0].payload.repo}
                        </p>
                        <p className="text-sm text-popover-foreground">
                          <Star className="inline h-4 w-4 mr-1 text-yellow-500" />
                          {payload[0].value?.toString()} stars
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="stars" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getFillColor(index)}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
