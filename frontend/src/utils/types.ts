export type LanguageCount = {
  language: string;
  count: number;
};

export type ProjectLanguages = Record<string, LanguageCount[]>;

export type authResponse = {
  accessToken: string;
  refreshToken: string;
};

export enum RepoMeasureDimension {
  bytes = "bytes",
  megabytes = "megabytes",
  gigabytes = "gigabytes",
}
