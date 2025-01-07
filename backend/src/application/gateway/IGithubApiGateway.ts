import { RepoCommits, CommitDetail } from "../../utils/types/commit";
import { GithubUser } from "../../utils/types/githubUser";
import { GithubRepo, RepoLanguageCount } from "../../utils/types/repository";

export interface IGithubApiGateway {
  fetchUserInfo(userToken: string): Promise<GithubUser>;
  fetchUserRepos(userToken: string): Promise<GithubRepo[]>;
  fetchRepoLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<RepoLanguageCount>;
  fetchUserRepoCommits(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<RepoCommits[]>;
  fetchCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail>;
}
