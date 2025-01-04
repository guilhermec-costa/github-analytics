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
import LanguageChart from "./LanguageChart";
import CommitChart from "./CommitChart";

export default function RepositoriesMetrics({
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

  if (useRepos.isLoading)
    return (
      <div
        id={sectionId}
        className="flex flex-col items-center p-8 space-y-6 bg-background rounded-xl shadow-lg w-full max-w-screen-lg mx-auto"
      >
        <h2 className="text-3xl font-semibold text-foreground">
          Loading Repository Metrics
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
          An error occurred while fetching repository metrics. Please try again.
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
        Repository Metrics{" "}
      </h1>
      <p className="text-lg text-muted-foreground">
        View and analyze metrics across your repositories.
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
          <>
            <LanguageChart selectedRepository={selectedRepository} />
            <CommitChart selectedRepository={selectedRepository} />
          </>
        ) : (
          <p className="text-muted-foreground text-center">
            Please select a repository to view its language data.
          </p>
        )}
      </div>
    </div>
  );
}