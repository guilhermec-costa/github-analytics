import { ILogger } from "../../infra/config/ILogger";
import { IGithubGateway } from "../gateway/IGithubGateway";

export class UserService {
    constructor(private readonly logger: ILogger, private readonly githubGateway: IGithubGateway) { }

    async auth(code: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Acessing Github Gateway for user authentication");
        return await this.githubGateway.auth(code);
    }

    async refresh(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        this.logger.log("Acessing Github Gateway for user authentication with refresh token");
        return await this.githubGateway.refreshToken(token);
    }

    async getUserInformation(token: string): Promise<any> {
      return await this.githubGateway.getUserInformation(token);
    }
}