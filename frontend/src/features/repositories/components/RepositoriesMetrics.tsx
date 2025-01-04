import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricUnit, RepoMeasureDimension } from "@/utils/types";
import LanguageChart from "./LanguageChart";
import CommitChart from "./CommitChart";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";

export default function RepositoriesMetrics({
  sectionId,
}: {
  sectionId: string;
}) {
  const useReposMetrics = useRepositoriesMetrics();

  const [selectedMetric, setSelectedMetric] = React.useState<MetricUnit>();
  const [selectedDimension, setSelectedDimension] = React.useState<string>(
    RepoMeasureDimension.bytes,
  );

  if (useReposMetrics.isLoading)
    return (
      <div
        id={sectionId}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="animate-spin w-16 h-16 border-4 border-t-accent border-gray-200 rounded-full" />
        <h2 className="text-2xl font-semibold text-gray-700 mt-6">
          Loading Repository Metrics
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we fetch the data for you.
        </p>
      </div>
    );

  if (useReposMetrics.isError)
    return (
      <div
        id={sectionId}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
      >
        <h2 className="text-2xl font-semibold text-red-500">
          Failed to Load Data
        </h2>
        <p className="text-gray-500 mt-2 text-center">
          An error occurred while fetching repository metrics. Please try again.
        </p>
        <button
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg mt-4 hover:bg-red-600 transition-all"
          onClick={() => useReposMetrics.refetch()}
        >
          Retry
        </button>
      </div>
    );

  const repositoryCount = Object.keys(useReposMetrics.data || {}).length;

  return (
    <div
      id={sectionId}
      className="flex flex-col items-center p-10 bg-white shadow-md rounded-xl max-w-7xl mx-auto space-y-8"
    >
      <h1 className="text-4xl font-extrabold text-gray-800">
        Repository Metrics
      </h1>
      <p className="text-lg text-gray-600">
        Gain insights into your repositories with detailed metrics and data
        visualizations.
      </p>
      <p className="text-sm text-gray-500">
        Total repositories:{" "}
        <span className="text-gray-700 font-medium">{repositoryCount}</span>
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center w-full space-y-4 md:space-y-0 md:space-x-6">
        <Select
          onValueChange={(e) => setSelectedMetric(useReposMetrics.data![e])}
        >
          <SelectTrigger className="border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow-sm p-3 w-64">
            <SelectValue placeholder="Select Repository" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-700 rounded-lg shadow-lg">
            {useReposMetrics.data &&
              Object.keys(useReposMetrics.data!).map((repoName) => (
                <SelectItem value={repoName} key={repoName}>
                  {repoName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(e) => setSelectedDimension(e)}>
          <SelectTrigger className="border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow-sm p-3 w-64">
            <SelectValue placeholder="Select Dimension" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-700 rounded-lg shadow-lg">
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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {selectedMetric ? (
          <>
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Language Breakdown
              </h3>
              <LanguageChart metric={selectedMetric} />
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Commit Activity
              </h3>
              <CommitChart metric={selectedMetric} />
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            Please select a repository to view its data.
          </p>
        )}
      </div>
    </div>
  );
}
