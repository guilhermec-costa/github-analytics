import useRepositoriesLangugaes from "@/api/queries/useRepositoriesLanguages";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "./ui/chart";
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
  const [selectedDimension, setSelectedDimension] =
    React.useState<string>("bytes");

  if (isLoading) return <h2>Loading repositories...</h2>;
  if (isError) return <h2>Failed to fetch repositories</h2>;

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-gray-50 rounded-xl shadow-lg w-full max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800">
        Repository Languages
      </h1>

      {/* Repository Selection */}
      <div className="w-full flex justify-center space-x-6">
        <Select onValueChange={(e) => setSelectedRepository(data![e])}>
          <SelectTrigger className="border-2 border-gray-300 rounded-md p-2">
            <SelectValue placeholder="Select Repository" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.keys(data!).map((repoName) => (
              <SelectItem value={repoName} key={repoName}>
                {repoName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Dimension Selection */}
        <Select onValueChange={setSelectedDimension}>
          <SelectTrigger className="border-2 border-gray-300 rounded-md p-2">
            <SelectValue placeholder="Select Dimension" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="bytes">Bytes</SelectItem>
            <SelectItem value="megaBytes">MegaBytes</SelectItem>
            <SelectItem value="gigaBytes">GigaBytes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display Chart */}
      {selectedRepository && (
        <div className="w-full md:w-2/3 lg:w-1/2 p-4 bg-white rounded-lg shadow-xl">
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
              <YAxis type="category" dataKey={"language"} />
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={10} />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
