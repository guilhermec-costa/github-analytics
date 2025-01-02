import useRepositoriesLangugaes from "@/api/queries/useRepositoriesLanguages";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React from "react";
import { LanguageCount } from "@/utils/types";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RepositoriesLanguages() {
  const { data, isLoading, isError } = useRepositoriesLangugaes();

  const [selectedRepository, setSelectedRepository] =
    React.useState<LanguageCount[]>();

  if (isLoading) return <h2>Loading repositories...</h2>;
  if (isError) return <h2>Failed to fetch repositories</h2>;

  console.log(selectedRepository);

  return (
    <>
      <Select onValueChange={(e) => setSelectedRepository(data![e])}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Repository" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(data!).map((repoName) => {
            return <SelectItem value={repoName}>{repoName}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      {selectedRepository && (
        <ChartContainer config={chartConfig}>
          <BarChart
            data={selectedRepository}
            layout="vertical"
            height={100}
            accessibilityLayer
          >
            <XAxis type="number" dataKey={"count"} hide />
            <YAxis type="category" dataKey={"language"} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
