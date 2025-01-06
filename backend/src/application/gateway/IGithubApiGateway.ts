import {
  CommitDetail,
  CommitResponse,
  GitHubRepository,
  GitHubUser,
} from "../../utils/types";

export interface IGithubApiGateway {
  getUserInformation(userToken: string): Promise<GitHubUser>;
  getUserRepositories(userToken: string): Promise<GitHubRepository[]>;
  getRepositoryLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<{ [language: string]: number }>;
  getUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<CommitResponse[]>;
  getCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail>;
}
