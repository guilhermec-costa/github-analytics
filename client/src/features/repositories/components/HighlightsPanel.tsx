import MetricCard from "@/components/MetricCard";
import { ChartArea, Code, Database, Star } from "lucide-react";
import React from "react";
import { RepoAnalyser } from "../services/RepoAnalyser";
import { RepoMetrics } from "shared/types";

export default function HighlightsPanel({
  metrics,
  selectedDimension,
}: {
  selectedDimension: string;
  metrics: RepoMetrics | undefined;
}) {
  const [commitCount, setCommitCount] = React.useState<number | undefined>(0);
  const [topLanguage, setTopLanguage] = React.useState<string | undefined>("");
  const [averageRepoSize, setAverageRepoSize] = React.useState<
    string | undefined
  >("");
  const [topStargazers, setTopStargazers] = React.useState<string | undefined>(
    "",
  );
  React.useEffect(() => {
    if (metrics) {
      const metricsValues = Object.values(metrics);
      setCommitCount(RepoAnalyser.sumCommits(metricsValues));
      setTopLanguage(RepoAnalyser.findTopLanguage(metricsValues));
      setAverageRepoSize(RepoAnalyser.calcAvgRepoSize(metricsValues));
      setTopStargazers(RepoAnalyser.findTopStargazer(metricsValues));
    }
  }, [metrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        icon={<ChartArea className="h-4 w-4" />}
        title="Total Commits"
        value={commitCount ? commitCount.toString() : undefined}
      />
      <MetricCard
        icon={<Code className="h-4 w-4" />}
        title="Top Language"
        value={topLanguage}
      />
      <MetricCard
        icon={<Database className="h-4 w-4" />}
        title={`Average Repo Size (${selectedDimension})`}
        value={averageRepoSize}
      />
      <MetricCard
        icon={<Star className="h-4 w-4" color="#fad900" fill="#fad900" />}
        title={`Top stargazers`}
        value={topStargazers}
      />
    </div>
  );
}
