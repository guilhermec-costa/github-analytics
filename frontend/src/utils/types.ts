export type LanguageCount = {
  language: string;
  count: number;
};

export type CommitCount = {
  commits: number;
  pctTotal: string;
  date: string;
  details: CommitDetail[];
};

export type CommitDetail = {
  sha: string;
  author: string;
  date: string;
  email: string;
  message: string;
};

export type CommitFile = {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
};

export type CommitStats = {
  total: number;
  additions: number;
  deletions: number;
};

export type DeepDetailedCommit = {
  sha: string;
  files: Array<Partial<CommitFile>>;
  stats: CommitStats;
};

export type DeepViewCommit = CommitDetail & DeepDetailedCommit;

export type MetricUnit = {
  LanguageDetails: LanguageCount[];
  CommitDetails: CommitCount[];
};

export type RepositoryMetrics = {
  [repoName: string]: MetricUnit;
};

export type authResponse = {
  accessToken: string;
  refreshToken: string;
};

export enum RepoMeasureDimension {
  bytes = "bytes",
  megabytes = "megabytes",
  gigabytes = "gigabytes",
}
