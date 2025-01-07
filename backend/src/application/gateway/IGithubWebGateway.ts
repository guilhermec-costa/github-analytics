import { AuthCredentials } from "../../utils/types/githubUser";

export interface IGithubWebGateway {
  oauth(code: string): Promise<AuthCredentials>;
  refreshToken(refreshToken: string): Promise<AuthCredentials>;
}
