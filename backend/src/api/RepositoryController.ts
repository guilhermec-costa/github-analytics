import { RepositoryService } from "../application/service/RepositoryService";
import { HttpMethod } from "../utils/HttpMethod";
import { HttpStatus } from "../utils/HttpStatus";
import {
  ZodParserInterceptor,
  authHeaderSchema,
  repoBytesSchema,
  repoLanguageSchema,
  repoOwnerSchema,
} from "../utils/schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "./IHttpServer";

export class RepositoryController extends BaseController {
  constructor(
    protected readonly httpServer: IHttpServer,
    private readonly repositoryService: RepositoryService,
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
        const userRepos = await this.repositoryService.getUserRepositories(
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

        const userRepos =
          await this.repositoryService.getSingleRepositoryLanguages(
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
          await this.repositoryService.getUserRepositoriesLanguages(
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

        const userRepoCommits = await this.repositoryService.getUserRepoCommits(
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

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/metrics/:repoOwner`,
      async ({ params, headers }) => {
        const { repoOwner } = ZodParserInterceptor.parseWithSchema(
          repoOwnerSchema,
          params,
        );

        const { authorization } = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );

        const userRepos =
          await this.repositoryService.getUserRepositoriesMetrics(
            repoOwner,
            authorization,
          );

        return {
          status: HttpStatus.OK,
          data: userRepos,
        };
      },
    );
  }
}
