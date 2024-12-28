import axios from "axios";
import { IGithubGateway } from "../../application/gateway/IGithubGateway";

export class GithubGatewayHttp implements IGithubGateway {
    constructor(private readonly GITHUB_ACCESS_TOKEN_URL: string, private readonly GITHUB_CLIENT_SECRET: string, private readonly GITHUB_CLIENT_ID: string) {
    }

    async auth(code: string): Promise<string> {
        const url = this.GITHUB_ACCESS_TOKEN_URL;
        const response = await axios.post(url, null, {
            params: {
                client_id: this.GITHUB_CLIENT_ID,
                client_secret: this.GITHUB_CLIENT_SECRET,
                code: code
            },
            headers: {
                Accept: 'application/json',
            },
        });

        const token = response.data.access_token
        return token
    }

}