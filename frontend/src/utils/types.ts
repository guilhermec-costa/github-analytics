export interface repositoryLanguage {
  repoName: string;
  languages: { [language: string]: number };
}

export type authResponse = {
  accessToken: string;
  refreshToken: string;
};
