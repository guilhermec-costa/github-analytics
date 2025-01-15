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
import { RepoManager } from "./application/service/RepoManager";
import { CommitController } from "./api/controllers/CommitController";

const httpServer = new FastifyAdapter();
httpServer.addRoutePrefix("api/v1");

const logger = new WinstonLogger();

const githubWebGateway = new GithubWebGateway(
  env.GITHUB_CLIENT_SECRET,
  env.GITHUB_CLIENT_ID,
);

const githubApiGateway = new GithubApiGateway();

const userService = new UserService(logger, githubWebGateway, githubApiGateway);
const repositoryService = new RepoManager(logger, githubApiGateway);

new AuthController(httpServer, userService).setPrefix("auth").mapRoutes();

new RepositoryController(httpServer, repositoryService)
  .setPrefix("repo")
  .mapRoutes();

new UserController(httpServer, userService).setPrefix("user").mapRoutes();
new CommitController(httpServer, repositoryService)
  .setPrefix("commits")
  .mapRoutes();

httpServer.listen(env.PORT);
