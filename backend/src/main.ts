import "dotenv/config";
import env from "../env";
import { UserService } from "./application/service/UserService";
import { AuthController } from "./api/controllers/AuthController";
import WinstonLogger from "./infra/config/WinstonLogger";
import { GithubApiGateway } from "./infra/gateway/GithubApiGateway";
import { GithubWebGateway } from "./infra/gateway/GithubWebGateway";
import { FastifyAdapter } from "./infra/http/FastifyAdapter";
import { RepositoryController } from "./api/controllers/RepositoryController";
import { UserController } from "./api/controllers/UserController";
import { RepositoryService } from "./application/service/RepositoryService";

const port = env.PORT;
const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");

const logger = new WinstonLogger();

const githubWebGateway = new GithubWebGateway(
  env.GITHUB_CLIENT_SECRET,
  env.GITHUB_CLIENT_ID,
);

const githubApiGateway = new GithubApiGateway();

const userService = new UserService(logger, githubWebGateway, githubApiGateway);
const repositoryService = new RepositoryService(logger, githubApiGateway);

new AuthController(httpServer, userService).setPrefix("auth").setupRoutes();

new RepositoryController(httpServer, repositoryService)
  .setPrefix("repo")
  .setupRoutes();

new UserController(httpServer, userService).setPrefix("user").setupRoutes();

httpServer.listen(port);
