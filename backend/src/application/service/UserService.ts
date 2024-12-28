import { IGithubGateway } from "../gateway/IGithubGateway";

export class UserService {
    constructor(private readonly githubGateway: IGithubGateway) {}

    async auth(code: string): Promise<string> {
        const token = this.githubGateway.auth(code);
        return token;
    }
}