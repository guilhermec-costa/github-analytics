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
  CartesianGrid,
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
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const data = React.useMemo(() => {
    if (metrics) {
      return Object.entries(metrics)
        .map(([repo, metric]) => ({
          repo,
          stars: metric.StargazersCount || 0,
        }))
        .sort((a, b) => b.stars - a.stars)
        .filter(({ stars }) => stars > 0)
        .slice(0, 10);
    }
    return [];
  }, [metrics]);

  const totalStars = React.useMemo(() => {
    return data.reduce<number>((acc, i) => (acc += i.stars), 0);
  }, [data]);

  const handleMouseEnter = (_: any, index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);
  console.log("metrics", data);

  return (
    <Card className="w-full mt-8 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row justify-between">
        <section>
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6" />
            <CardTitle>Top Stargazers</CardTitle>
          </div>
          <CardDescription>
            Repositories with the most stars (Top 10)
          </CardDescription>
        </section>
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground">Total: </p>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">
              {totalStars.toLocaleString()}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[400px]">
        <ResponsiveContainer className="w-full h-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" tickLine={false} hide />
            <YAxis
              type="category"
              dataKey="repo"
              width={200}
              tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
              tickLine={false}
            />
            <CartesianGrid opacity={"0.1"} horizontal={false} />
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
            <Bar
              dataKey="stars"
              radius={[0, 4, 4, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getFillColor(index)}
                  fillOpacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.6
                  }
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
