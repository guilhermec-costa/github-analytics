import { CommitFile, CommitStats, DetailedRepoCommit } from "shared/types";
import { ParsedCommitDetails } from "../../../server/src/utils/types/commit";

export type LanguageCount = {
  language: string;
  count: number;
};

export type DeepDetailedCommit = {
  sha: string;
  files: Array<Partial<CommitFile>>;
  stats: CommitStats;
};

export type DeepViewCommit = ParsedCommitDetails & DeepDetailedCommit;

export type MetricUnit = {
  LanguageDetails: LanguageCount[];
  CommitDetails: DetailedRepoCommit[];
  StargazersCount?: number;
  repo?: string;
  watchersCount: number;
  size: number;
  licenseName?: string | null;
  updatedAt: string;
  createdAt: string;
  topLanguage: string;
};
