export interface IGithubGateway {
    auth(code: string): Promise<{ accessToken: string, refreshToken: string }>
}