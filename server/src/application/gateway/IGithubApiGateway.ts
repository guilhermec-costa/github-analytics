import { CommitDetail, RepoCommit } from "../../utils/types/commit";
import { GithubUser } from "../../utils/types/githubUser";
import { GithubRepo, RepoLanguageCount } from "../../utils/types/repository";

export interface IGithubApiGateway {
  fetchAuthorizedUserInfo(userToken: string): Promise<GithubUser>;
  fetchUserRepos(userToken: string, username: string): Promise<GithubRepo[]>;
  fetchRepoLanguages(
    repoOwner: string,
    repoName: string,
    token: string,
  ): Promise<RepoLanguageCount>;
  fetchUserRepoCommitsSinceUntil(
    repoOwner: string,
    repoName: string,
    token: string,
    since: string,
    until: string,
  ): Promise<RepoCommit[]>;
  fetchCommitDetail(
    owner: string,
    repo: string,
    token: string,
    id: string,
  ): Promise<CommitDetail>;
  fetchSpecificUser(token: string, username: string): Promise<any>;
}
