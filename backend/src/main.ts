import 'dotenv/config';
import env from '../env';
import { AuthController } from './api/AuthController';
import { UserService } from './application/service/UserService';
import { GithubGatewayHttp } from './infra/gateway/GithubGatewayHttp';
import { FastifyAdapter } from './infra/http/FastifyAdapter';
import WinstonLogger from './infra/config/WinstonLogger';

const port = env.PORT;

const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");

const logger = new WinstonLogger();
const githubGateway = new GithubGatewayHttp(env.GITHUB_CLIENT_SECRET, env.GITHUB_CLIENT_ID);
new AuthController(httpServer, new UserService(githubGateway, logger));

httpServer.listen(port);
