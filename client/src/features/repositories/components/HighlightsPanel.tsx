import MetricCard from "@/components/MetricCard";
import { ChartArea, Code, Database, FolderCode, Star } from "lucide-react";
import React from "react";
import { RepoAnalyser } from "../services/RepoAnalyser";
import { RepoMetrics } from "shared/types";
import { formatBytes } from "@/utils/bytes";

interface HighlightsPanelProps {
  metrics: RepoMetrics | undefined;
  targetUser: string | undefined;
}

interface HighlightsReducerState {
  commitCount?: number;
  topLanguage?: string;
  averageRepoSize?: string;
  topStargazers?: {
    repo?: string | undefined;
    count?: number | undefined;
  };
  repoCount?: number;
}

interface HighlightsReducerAction {
  actionType: "SETUP" | "RESET";
}

const initialState: HighlightsReducerState = {
  commitCount: undefined,
  topLanguage: undefined,
  averageRepoSize: undefined,
  topStargazers: {
    count: undefined,
    repo: undefined,
  },
  repoCount: undefined,
};

export default function HighlightsPanel({
  metrics,
  targetUser,
}: HighlightsPanelProps) {
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

      case "RESET": {
        return {
          commitCount: undefined,
          topLanguage: undefined,
          averageRepoSize: undefined,
          topStargazers: undefined,
          repoCount: undefined,
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

  React.useEffect(() => {
    if (targetUser && metrics) {
      highlightDispatchFn({ actionType: "RESET" });
    }
  }, [targetUser, metrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 xl:grid-rows-1 xl:grid-cols-5 gap-4">
      <MetricCard
        icon={<FolderCode className="h-4 w-4" color="hsl(var(--primary)" />}
        title="Repositories"
        value={highlightState.repoCount?.toString()}
      />
      <MetricCard
        icon={<ChartArea className="h-4 w-4" color="hsl(var(--primary)" />}
        title="Commits last 30 days"
        value={
          highlightState.commitCount
            ? highlightState.commitCount.toString()
            : undefined
        }
      />
      <MetricCard
        icon={<Code className="h-4 w-4" color="hsl(var(--primary)" />}
        title="Top Language"
        value={highlightState.topLanguage}
      />
      <MetricCard
        icon={<Database className="h-4 w-4" color="hsl(var(--primary)" />}
        title={`Average Repo Size`}
        value={
          highlightState.averageRepoSize &&
          formatBytes(parseInt(highlightState.averageRepoSize))
        }
      />
      <MetricCard
        icon={<Star className="h-4 w-4" color="hsl(var(--primary)" />}
        title={`Top stargazers`}
        value={`${highlightState.topStargazers?.repo} ( ${highlightState.topStargazers?.count?.toString()} )`}
      />
    </div>
  );
}
