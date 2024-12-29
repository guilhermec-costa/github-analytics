import 'dotenv/config';
import env from '../env';
import { AuthController } from './api/AuthController';
import { FastifyAdapter } from './infra/http/FastifyAdapter';
import WinstonLogger from './infra/config/WinstonLogger';
import { UserService } from './application/service/UserService';
import { GithubGatewayHttp } from './infra/gateway/GithubGatewayHttp';
import DIContainer from './infra/DI/DIContainer';

const port = env.PORT;
const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");

const container = DIContainer.getInstance(); 

const logger = new WinstonLogger();
const userService = new UserService();
const githubGateway = new GithubGatewayHttp(env.GITHUB_CLIENT_SECRET, env.GITHUB_CLIENT_ID);

container.provide("Logger", logger);
container.provide("UserService", userService);
container.provide("GithubGateway", githubGateway);

new AuthController(httpServer).setupRoutes();

httpServer.listen(port);
