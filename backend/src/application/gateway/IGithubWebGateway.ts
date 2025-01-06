export interface IGithubWebGateway {
  auth(code: string): Promise<{ accessToken: string; refreshToken: string }>;
  refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
