import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricUnit, RepoMeasureDimension } from "@/utils/types";
import { DetailedRepoCommit } from "shared/types";
import LanguageChart from "./LanguageChart";
import CommitChart from "./CommitChart";
import useRepositoriesMetrics from "@/api/queries/useRepositoriesMetrics";
import DetailedCommit from "./DetailedCommit";
import { Separator } from "@/components/ui/separator";
import ContributorsDashboard from "./ContributorsDashboard";
import Loading from "./Loading";
import Error from "./Error";
import InputSelect from "@/components/InputSelect";

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
  const [selectedDetailedCommitPeriod, setDetailedCommitPeriod] =
    React.useState<DetailedRepoCommit>();
  const [selectedRepository, setSelectedRepository] = React.useState<string>();
  const [repoSearchInputOpen, setRepoSearchInputOpen] =
    React.useState<boolean>(false);

  if (useReposMetrics.isLoading) return <Loading />;
  if (useReposMetrics.isError) return <Error />;

  const repositoryCount = Object.keys(useReposMetrics.data || {}).length;

  function handleMetricChange(repo: string) {
    setSelectedMetric(useReposMetrics.data![repo]);
    setDetailedCommitPeriod(undefined);
    setSelectedRepository(repo);
    setRepoSearchInputOpen(false);
  }

  return (
    <div
      id={sectionId}
      className="flex flex-col items-center p-10 bg-white shadow-md rounded-xl max-w-7xl mx-auto space-y-8"
    >
      <h1 className="text-4xl font-extrabold text-gray-800">
        Repository Metrics
      </h1>
      <Separator className="bg-gray-300" />
      <p className="text-lg text-gray-600">
        Gain insights into your repositories with{" "}
        <span className="font-bold bg-gradient-to-r from-orange-500 to-orange-400 inline-block text-transparent bg-clip-text">
          detailed metrics
        </span>{" "}
        and{" "}
        <span className="font-bold bg-gradient-to-r from-orange-500 to-orange-400 inline-block text-transparent bg-clip-text">
          data visualizations
        </span>{" "}
      </p>
      <p className="text-sm text-gray-500">
        Total repositories:{" "}
        <span className="text-gray-700 font-medium">{repositoryCount}</span>
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center w-full space-y-4 md:space-y-0 md:space-x-6">
        {useReposMetrics.data && (
          <InputSelect
            options={Object.keys(useReposMetrics.data)}
            onSelectionChange={handleMetricChange}
            openState={repoSearchInputOpen}
            setOpenState={setRepoSearchInputOpen}
            selectedOption={selectedRepository}
          />
        )}
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
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Language Breakdown
              </h3>
              <LanguageChart
                metric={selectedMetric}
                dimension={selectedDimension}
              />
            </div>

            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Commit Activity
              </h3>
              <CommitChart
                metric={selectedMetric}
                setDetailedCommitPeriod={setDetailedCommitPeriod}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            Please select a repository to view its data.
          </p>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Detailed Commits on {selectedDetailedCommitPeriod?.date}
      </h3>
      <Separator className="bg-gray-300" />
      {selectedDetailedCommitPeriod && selectedRepository ? (
        <section className="w-full">
          <DetailedCommit
            commitDetails={selectedDetailedCommitPeriod}
            selectedRepository={selectedRepository}
          />
        </section>
      ) : (
        <p className="text-gray-500 text-center col-span-2">
          Please select a commit on the above chart
        </p>
      )}
      {selectedRepository && (
        <ContributorsDashboard selectedRepo={selectedRepository} />
      )}
    </div>
  );
}
