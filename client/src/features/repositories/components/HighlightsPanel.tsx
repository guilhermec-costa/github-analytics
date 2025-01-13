import MetricCard from "@/components/MetricCard";
import { ChartArea, Code, Database, Star } from "lucide-react";
import React from "react";
import { RepoAnalyser } from "../services/RepoAnalyser";
import { RepoMetrics } from "shared/types";

interface HighlightsPanelProps {
  selectedDimension: string;
  metrics: RepoMetrics | undefined;
  targetUser: string | undefined;
}

interface HighlightsReducerState {
  commitCount: number | undefined;
  topLanguage: string | undefined;
  averageRepoSize: string | undefined;
  topStargazers:
    | {
        repo: string | undefined;
        count: number | undefined;
      }
    | undefined;
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
};

export default function HighlightsPanel({
  metrics,
  selectedDimension,
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
        };
      }

      case "RESET": {
        return {
          commitCount: undefined,
          topLanguage: undefined,
          averageRepoSize: undefined,
          topStargazers: undefined,
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        icon={<ChartArea className="h-4 w-4" color="hsl(var(--primary)" />}
        title="Total Commits"
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
        title={`Average Repo Size (${selectedDimension})`}
        value={highlightState.averageRepoSize}
      />
      <MetricCard
        icon={<Star className="h-4 w-4" color="hsl(var(--primary)" />}
        title={`Top stargazers`}
        value={`${highlightState.topStargazers?.repo} ( ${highlightState.topStargazers?.count?.toString()} )`}
      />
    </div>
  );
}
