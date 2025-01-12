import { CommitDetail, RepoCommit } from "../../utils/types/commit";
import { GithubUser } from "../../utils/types/githubUser";
import { GithubRepo, RepoLanguageCount } from "../../utils/types/repository";

export interface IGithubApiGateway {
  fetchAuthorizedUserInfo(userToken: string): Promise<GithubUser>;
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
  ): Promise<RepoCommit[]>;
  fetchCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail>;
  fetchSpecificUser(token: string, username: string): Promise<any>;
}
