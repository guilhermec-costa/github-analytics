import 'dotenv/config';
import env from '../env';
import { AuthController } from './api/AuthController';
import { UserService } from './application/service/UserService';
import { GithubGatewayHttp } from './infra/gateway/GithubGatewayHttp';
import { FastifyAdapter } from './infra/http/FastifyAdapter';

const port = env.PORT;

const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");
httpServer.listen(port);

const githubGateway = new GithubGatewayHttp(env.GITHUB_ACCESS_TOKEN_URL, env.GITHUB_CLIENT_SECRET, env.GITHUB_CLIENT_ID);

new AuthController(httpServer, new UserService(githubGateway));
