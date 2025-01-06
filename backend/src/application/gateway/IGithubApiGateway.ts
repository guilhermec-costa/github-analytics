import {
  CommitDetail,
  CommitResponse,
  GitHubRepository,
  GitHubUser,
} from "../../utils/types";

export interface IGithubApiGateway {
  fetchUserInfo(userToken: string): Promise<GitHubUser>;
  fetchUserRepos(userToken: string): Promise<GitHubRepository[]>;
  fetchRepoLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<{ [language: string]: number }>;
  fetchUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<CommitResponse[]>;
  fetchCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail>;
}
