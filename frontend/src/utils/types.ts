export type LanguageCount = {
  language: string;
  count: number;
};

export type CommitCount = {
  commits: number;
  pctTotal: string;
};

export type CommitCountPeriod = Record<string, CommitCount>;

export type MetricUnit = {
  LanguageDetails: LanguageCount[];
  CommitDetails: CommitCountPeriod[];
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
