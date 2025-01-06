import { AuthCredentials } from "../../utils/types";

export interface IGithubWebGateway {
  oauth(code: string): Promise<AuthCredentials>;
  refreshToken(refreshToken: string): Promise<AuthCredentials>;
}
