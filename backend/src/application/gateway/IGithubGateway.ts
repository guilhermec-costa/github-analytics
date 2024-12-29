import { GitHubUser } from "../../utils/types";

export interface IGithubGateway {
    auth(code: string): Promise<{ accessToken: string, refreshToken: string }>
    refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }>
    getUserInformation(userToken: string): Promise<GitHubUser>;
    getUserRepositories(userToken: string): Promise<any>
}