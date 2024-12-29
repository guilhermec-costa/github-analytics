import { ILogger } from "../../infra/config/ILogger";
import { inject } from "../../infra/DI/DIContainer";
import { IGithubGateway } from "../gateway/IGithubGateway";

export class UserService {
    @inject("githubGateway")
    private readonly githubGateway!: IGithubGateway;
    @inject("logger")
    private readonly logger!: ILogger;

    constructor() { }

    async auth(code: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Acessing Github Gateway for user authentication");
        return await this.githubGateway.auth(code);
    }

    async refresh(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Acessing Github Gateway for user authentication with refresh token");
        return await this.githubGateway.refreshToken(token);
    }
}