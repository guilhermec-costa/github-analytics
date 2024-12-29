import { IGithubGateway } from "../gateway/IGithubGateway";

export class UserService {
    constructor(private readonly githubGateway: IGithubGateway) {}

    async auth(code: string): Promise<{ accessToken: string, refreshToken: string}> {
        return await this.githubGateway.auth(code);
    }
}