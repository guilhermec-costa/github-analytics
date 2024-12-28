export interface IGithubGateway {
    auth(code: string): Promise<string>
}