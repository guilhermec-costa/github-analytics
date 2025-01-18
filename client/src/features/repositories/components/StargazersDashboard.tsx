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

  return (
    <Card className="w-full mt-8 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <section>
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6" />
            <CardTitle>Top Stargazers</CardTitle>
          </div>
          <CardDescription className="mt-2 text-sm sm:text-base">
            Repositories with the most stars (Top 10)
          </CardDescription>
        </section>
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground text-sm sm:text-base">Total: </p>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">
              {totalStars.toLocaleString()}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-4">
        <div className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" tickLine={false} hide />
              <YAxis
                type="category"
                dataKey="repo"
                width={140}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                tickLine={false}
              />
              <CartesianGrid opacity={"0.2"} strokeDasharray="3 3" />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border p-3 bg-popover">
                        <h5 className="font-medium text-popover-foreground">
                          {payload[0].payload.repo}
                        </h5>
                        <small className="text-sm text-popover-foreground">
                          <Star className="inline h-4 w-4 mr-1 text-yellow-500" />
                          {payload[0].value?.toString()} stars
                        </small>
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
        </div>
      </CardContent>
    </Card>
  );
}
