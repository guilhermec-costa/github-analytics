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
