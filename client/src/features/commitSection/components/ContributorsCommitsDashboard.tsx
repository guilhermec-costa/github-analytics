import React, { useState, useMemo } from "react";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function ContributorsCommitDashboard({
  selectedRepo,
  user,
}: {
  selectedRepo: string;
  user: string | undefined;
}) {
  const { data } = useRepositoriesMetrics(user);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const contributionsData = useMemo(() => {
    if (!data || !data[selectedRepo]) return [];

    const contributionsByAuthor: { [author: string]: number } = {};

    data[selectedRepo].CommitDetails.forEach((dateGroup) => {
      dateGroup.details.forEach(({ author }) => {
        contributionsByAuthor[author] =
          (contributionsByAuthor[author] || 0) + 1;
      });
    });

    return Object.entries(contributionsByAuthor)
      .map(([author, contributions]) => ({ author, contributions }))
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10);
  }, [data, selectedRepo]);

  const maxContributions = Math.max(
    ...contributionsData.map((d) => d.contributions),
  );

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  const handleMouseEnter = (_: any, index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contribution Distribution</CardTitle>
        <CardDescription>
          Top 10 contributors for {selectedRepo}
        </CardDescription>
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
              width={120}
            />
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
              {contributionsData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  fillOpacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.6
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
