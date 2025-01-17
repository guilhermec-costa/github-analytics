import React, { useState, useMemo } from "react";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { getFillColor } from "@/utils/chartColors";

interface ContributorsCommitDashboardProps {
  selectedRepos: string[];
  user: string | undefined;
}

export default function ContributorsCommitDashboard({
  selectedRepos,
  user,
}: ContributorsCommitDashboardProps) {
  const { data: metrics } = useRepositoriesMetrics(user);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const contributionsData = useMemo(() => {
    if (!metrics) return [];

    const filteredContributions = Object.values(metrics)
      .filter((metric) => selectedRepos.includes(metric.repo))
      .flatMap((metric) => metric.CommitDetails)
      .reduce<Record<string, number>>((acc, { details }) => {
        details.forEach(({ author }) => {
          acc[author] = (acc[author] || 0) + 1;
        });

        return acc;
      }, {});

    return Object.entries(filteredContributions)
      .map(([author, contributions]) => ({
        author,
        contributions,
      }))
      .sort((iA, iB) => iB.contributions - iA.contributions)
      .slice(0, 10);
  }, [metrics, selectedRepos]);

  const maxContributions = Math.max(
    ...contributionsData.map((d) => d.contributions),
  );

  const handleMouseEnter = (_: any, index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={contributionsData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, maxContributions]}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="author"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: "hsl(var(--foreground))" }}
              width={120}
            />
            <CartesianGrid vertical={true} opacity={"0.1"} />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="font-medium">{payload[0].payload.author}</p>
                      <p className="text-sm text-muted-foreground">
                        Contributions:{" "}
                        <span className="font-medium">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="contributions"
              radius={[0, 4, 4, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {contributionsData.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={getFillColor(idx)}
                  fillOpacity={
                    activeIndex === null || activeIndex === idx ? 1 : 0.6
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
