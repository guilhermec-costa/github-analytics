import 'dotenv/config';
import env from '../env';
import { AuthController } from './api/AuthController';
import { UserService } from './application/service/UserService';
import WinstonLogger from './infra/config/WinstonLogger';
import { GithubGatewayHttp } from './infra/gateway/GithubGatewayHttp';
import { FastifyAdapter } from './infra/http/FastifyAdapter';

const port = env.PORT;
const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");

const logger = new WinstonLogger();

const githubGateway = new GithubGatewayHttp(env.GITHUB_CLIENT_SECRET, env.GITHUB_CLIENT_ID);
const userService = new UserService(logger, githubGateway);


new AuthController(httpServer, userService).setupRoutes();

httpServer.listen(port);
