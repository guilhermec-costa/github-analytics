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
import { LanguageCount, RepoMeasureDimension } from "@/utils/types";
import useRepositoriesLanguages from "@/api/queries/useRepositoriesLanguages";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--accent))", // Usando a variável de cor do shadcn/ui
  },
} satisfies ChartConfig;

export default function RepositoriesLanguages({
  sectionId,
}: {
  sectionId: string;
}) {
  const useRepos = useRepositoriesLanguages();

  const [selectedRepository, setSelectedRepository] =
    React.useState<LanguageCount[]>();
  const [selectedDimension, setSelectedDimension] = React.useState<string>(
    RepoMeasureDimension.bytes,
  );

  React.useEffect(() => {
    switch (selectedDimension) {
      case RepoMeasureDimension.bytes: {
        break;
      }
      case RepoMeasureDimension.megabytes: {
        break;
      }
      case RepoMeasureDimension.gigabytes: {
        break;
      }
    }
  }, [selectedDimension, useRepos.data]);

  if (useRepos.isLoading)
    return <h2 className="text-foreground">Loading repositories...</h2>;
  if (useRepos.isError) {
    return <h2 className="text-foreground">Failed to fetch repositories</h2>;
  }

  return (
    <div
      id={sectionId}
      className="flex flex-col items-center space-y-6 p-8 bg-background rounded-xl shadow-lg w-full max-w-screen-lg mx-auto"
    >
      <h1 className="text-3xl font-semibold text-foreground">
        Repository Languages
      </h1>

      <div className="w-full flex justify-center space-x-6">
        <Select onValueChange={(e) => setSelectedRepository(useRepos.data![e])}>
          <SelectTrigger className="border border-border rounded-md p-2">
            <SelectValue placeholder="Select Repository" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            {useRepos.data &&
              Object.keys(useRepos.data!).map((repoName) => (
                <SelectItem value={repoName} key={repoName}>
                  {repoName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => setSelectedDimension(e)}>
          <SelectTrigger className="border border-border rounded-md p-2">
            <SelectValue placeholder="Select Dimension" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            <SelectItem value={RepoMeasureDimension.bytes}>Bytes</SelectItem>
            <SelectItem value={RepoMeasureDimension.megabytes}>
              MegaBytes
            </SelectItem>
            <SelectItem value={RepoMeasureDimension.gigabytes}>
              GigaBytes
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedRepository && (
        <div className="w-full md:w-2/3 lg:w-1/2 p-4 bg-card rounded-lg shadow-xl">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={selectedRepository}
              layout="vertical"
              height={300}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              barSize={20}
              className="transition-all"
            >
              <XAxis type="number" dataKey={"count"} hide />
              <YAxis
                type="category"
                dataKey={"language"}
                tickLine={false}
                tickMargin={10}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--accent))"
                radius={10}
                fontSize={16}
              />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
