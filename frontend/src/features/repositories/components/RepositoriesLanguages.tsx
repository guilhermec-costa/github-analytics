import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { LanguageCount, RepoMeasureDimension } from "@/utils/types";
import useRepositoriesLanguages from "@/api/queries/useRepositoriesLanguages";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
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
    if (useRepos.data) {
      switch (selectedDimension) {
        case RepoMeasureDimension.megabytes:
          // Transform data to MB if needed
          break;
        case RepoMeasureDimension.gigabytes:
          // Transform data to GB if needed
          break;
        default:
          // Default to bytes
          break;
      }
    }
  }, [selectedDimension, useRepos.data]);

  if (useRepos.isLoading)
    return (
      <div
        id={sectionId}
        className="flex flex-col items-center p-8 space-y-6 bg-background rounded-xl shadow-lg w-full max-w-screen-lg mx-auto"
      >
        <h2 className="text-3xl font-semibold text-foreground">
          Loading Repository Languages
        </h2>
        <p className="text-foreground">Please wait while we fetch the data.</p>
      </div>
    );

  if (useRepos.isError)
    return (
      <div
        id={sectionId}
        className="flex flex-col items-center p-8 space-y-6 bg-background rounded-xl shadow-lg w-full max-w-screen-lg mx-auto"
      >
        <h2 className="text-3xl font-semibold text-error">
          Failed to Load Data
        </h2>
        <p className="text-foreground">
          An error occurred while fetching repository languages. Please try
          again.
        </p>
        <button
          className="px-4 py-2 bg-accent text-white rounded-md"
          onClick={() => useRepos.refetch()}
        >
          Retry
        </button>
      </div>
    );

  const repositoryCount = Object.keys(useRepos.data || {}).length;

  return (
    <div
      id={sectionId}
      className="flex flex-col items-center space-y-6 p-8 bg-secondary rounded-xl shadow-lg w-full max-w-screen-lg mx-auto"
    >
      <h1 className="text-4xl font-bold text-foreground">
        Repository Languages Analysis
      </h1>
      <p className="text-lg text-muted-foreground">
        View and analyze the programming languages used across your
        repositories.
      </p>
      <p className="text-sm text-muted-foreground">
        Total repositories: <strong>{repositoryCount}</strong>
      </p>

      <div className="w-full flex flex-col items-center space-y-6">
        <div className="flex justify-center space-x-6 w-full">
          <Select
            onValueChange={(e) => setSelectedRepository(useRepos.data![e])}
          >
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

        {selectedRepository ? (
          <div className="w-full md:w-2/3 lg:w-1/2 p-4 bg-card rounded-lg shadow-xl">
            <ChartContainer config={chartConfig} className="w-full">
              <BarChart
                data={selectedRepository}
                layout="vertical"
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
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-desktop)"
                  radius={10}
                  fontSize={13}
                />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            Please select a repository to view its language data.
          </p>
        )}
      </div>
    </div>
  );
}
