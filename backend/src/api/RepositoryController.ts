import { UserService } from "../application/service/UserService";
import { HttpMethod } from "../utils/HttpMethod";
import { HttpStatus } from "../utils/HttpStatus";
import {
  ZodParserInterceptor,
  authHeaderSchema,
  repoBytesSchema,
  repoLanguageSchema,
} from "../utils/schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "./IHttpServer";

export class RepositoryController extends BaseController {
  constructor(
    protected readonly httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public setupRoutes(): void {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/user`,
      async ({ headers }) => {
        const reqHeaders = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );
        const userRepos = await this.userService.getUserRepositories(
          reqHeaders.authorization,
        );

        return {
          status: HttpStatus.OK,
          data: userRepos,
        };
      },
    );

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/languages/owner/:repoOwner/name/:repoName`,
      async ({ params, headers }) => {
        const { repoName, repoOwner } = ZodParserInterceptor.parseWithSchema(
          repoBytesSchema,
          params,
        );

        const { authorization } = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );

        const userRepos = await this.userService.getSingleRepositoryLanguages(
          repoOwner,
          repoName,
          authorization,
        );

        return {
          status: HttpStatus.OK,
          data: userRepos,
        };
      },
    );

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/languages/owner/:repoOwner`,
      async ({ params, headers }) => {
        const { repoOwner } = ZodParserInterceptor.parseWithSchema(
          repoLanguageSchema,
          params,
        );

        const { authorization } = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );

        const repoLanguages =
          await this.userService.getUserRepositoriesLanguages(
            authorization,
            repoOwner,
          );

        return {
          status: HttpStatus.OK,
          data: repoLanguages,
        };
      },
    );

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/owner/:repoOwner/name/:repoName/commits`,
      async ({ headers, params }) => {
        const { repoName, repoOwner } = ZodParserInterceptor.parseWithSchema(
          repoBytesSchema,
          params,
        );

        const { authorization } = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );

        const userRepoCommits = await this.userService.getUserRepoCommits(
          repoOwner,
          repoName,
          authorization,
        );

        return {
          status: HttpStatus.OK,
          data: userRepoCommits,
        };
      },
    );
  }
}
