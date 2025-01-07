import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart } from "recharts";

export default function ContributorsDashboard({
  selectedRepo,
}: {
  selectedRepo: string;
}) {
  const { data } = useRepositoriesMetrics();
  const [contributionsData, setContributionsData] = useState<
    {
      author: string;
      contributions: number;
    }[]
  >();

  React.useEffect(() => {
    const contributionsByAuthor: {
      [author: string]: number;
    } = {};

    const commitGroups = data![selectedRepo].CommitDetails.map(
      (dateGroup) => dateGroup.details,
    );

    for (const group of commitGroups) {
      for (const { author } of group) {
        if (!contributionsByAuthor[author]) {
          contributionsByAuthor[author] = 1;
          continue;
        }

        contributionsByAuthor[author]++;
      }
    }

    setContributionsData(
      Object.entries(contributionsByAuthor).map(([author, contributions]) => ({
        author,
        contributions,
      })),
    );
  }, [data, selectedRepo]);

  React.useEffect(() => {
    console.log(contributionsData);
  }, [contributionsData]);

  return (
    <Card className="w-full shadow-xl border border-border bg-background">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Contribution Distribution by Author
        </CardTitle>
        <CardDescription>
          Breakdown of commit contributions by author
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={contributionsData}
            margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
          >
            <XAxis
              type="category"
              dataKey="author"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: "#ffffff" }}
            />
            <YAxis
              type="number"
              dataKey="contributions"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 13,
                fontWeight: "bold",
                fill: "#ffffff",
              }}
            />
            <Bar
              dataKey="contributions"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]} // Smooth rounded corners
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={({ active, payload }) =>
                active && payload && payload.length ? (
                  <div className="p-3 bg-popover text-popover-foreground rounded-md shadow-md">
                    <p className="font-semibold">{payload[0].payload.author}</p>
                    <p>{`Contributions: ${payload[0].value}`}</p>
                  </div>
                ) : null
              }
            />
            <defs>
              <linearGradient
                id="barGradient"
                x1="0%"
                x2="100%"
                y1="0%"
                y2="100%"
              >
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
