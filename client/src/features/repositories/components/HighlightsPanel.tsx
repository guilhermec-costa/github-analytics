import { ChartArea, Code, Database, FolderCode, Star } from "lucide-react";
import React from "react";
import { RepoAnalyser } from "../services/RepoAnalyser";
import { RepoMetrics } from "shared/types";
import { formatBytes } from "@/utils/bytes";
import { MetricCard } from "@/components/MetricCard/index";
import ProgrammingLanguageIcon from "@/components/ProgrammingLanguageIcon";

interface HighlightsPanelProps {
  metrics: RepoMetrics | undefined;
}

interface HighlightsReducerState {
  commitCount: number;
  topLanguage: string;
  averageRepoSize: string;
  topStargazers: {
    repo?: string;
    count?: number;
  };
  repoCount: number;
}

interface HighlightsReducerAction {
  actionType: "SETUP";
}

const initialState: HighlightsReducerState = {
  commitCount: 0,
  topLanguage: "",
  averageRepoSize: "",
  topStargazers: {
    count: 0,
    repo: "",
  },
  repoCount: 0,
};

export default function HighlightsPanel({ metrics }: HighlightsPanelProps) {
  function highlightReducer(
    state: HighlightsReducerState,
    action: HighlightsReducerAction,
  ) {
    switch (action.actionType) {
      case "SETUP": {
        const metricsValues = Object.values(metrics!);

        return {
          commitCount: RepoAnalyser.sumCommits(metricsValues),
          topLanguage: RepoAnalyser.findTopLanguage(metricsValues),
          averageRepoSize: RepoAnalyser.calcAvgRepoSize(metricsValues),
          topStargazers: RepoAnalyser.findTopStargazer(metricsValues),
          repoCount: metricsValues.length,
        };
      }

      default:
        return state;
    }
  }

  const [highlightState, highlightDispatchFn] = React.useReducer(
    highlightReducer,
    initialState,
  );

  React.useEffect(() => {
    if (metrics) {
      highlightDispatchFn({ actionType: "SETUP" });
    }
  }, [metrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 xl:grid-rows-1 xl:grid-cols-5 gap-4">
      <MetricCard.Root tooltipMsg="Total number of repositories owned by the user.">
        <MetricCard.Header
          title="Total Repositories"
          icon={<FolderCode className="h-4 w-4" color="hsl(var(--chart-4)" />}
        />
        <MetricCard.Content>
          <MetricCard.Value value={highlightState.repoCount.toString()} />
        </MetricCard.Content>
      </MetricCard.Root>
      <MetricCard.Root tooltipMsg="Total commits made in the last 30 days across all repositories.">
        <MetricCard.Header
          title="Commits Last 30 Days"
          icon={<ChartArea className="h-4 w-4" color="hsl(var(--chart-4)" />}
        />
        <MetricCard.Content>
          <MetricCard.Value
            value={highlightState.commitCount.toString() || "0"}
          />
        </MetricCard.Content>
      </MetricCard.Root>
      <MetricCard.Root tooltipMsg="Most frequently used programming language across repositories.">
        <MetricCard.Header
          title="Top Language"
          icon={<Code className="h-4 w-4" color="hsl(var(--chart-4)" />}
        />
        <MetricCard.Content>
          <div className="flex items-baseline space-x-4">
            <MetricCard.Value value={highlightState.topLanguage} />
            <ProgrammingLanguageIcon lang={highlightState.topLanguage} />
          </div>
        </MetricCard.Content>
      </MetricCard.Root>
      <MetricCard.Root tooltipMsg="Average repository size, calculated based on all repositories owned by the user.">
        <MetricCard.Header
          title="Average Repo Size"
          icon={<Database className="h-4 w-4" color="hsl(var(--chart-4)" />}
        />
        <MetricCard.Content>
          <MetricCard.Value
            value={
              highlightState.averageRepoSize &&
              formatBytes(parseInt(highlightState.averageRepoSize))
            }
          />
        </MetricCard.Content>
      </MetricCard.Root>
      <MetricCard.Root tooltipMsg="Repository with the highest number of stars and its star count.">
        <MetricCard.Header
          title="Top stargazers"
          icon={<Star className="h-4 w-4" color="hsl(var(--chart-4)" />}
        />
        <MetricCard.Content>
          <MetricCard.Value
            value={`${highlightState.topStargazers?.repo} ( ${highlightState.topStargazers?.count?.toString()} )`}
          />
        </MetricCard.Content>
      </MetricCard.Root>
    </div>
  );
}
