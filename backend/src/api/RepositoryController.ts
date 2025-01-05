import { RepositoryService } from "../application/service/RepositoryService";
import { HttpMethod } from "../utils/HttpMethod";
import { HttpStatus } from "../utils/HttpStatus";
import {
  ZodParserInterceptor,
  authHeaderSchema,
  commitDetailsSchema,
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

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/owner/:repoOwner/repo/:repoName/commitDetail/:ref`,
      async ({ headers, params }) => {
        const { ref, repoOwner, repoName, authorization } =
          ZodParserInterceptor.parseWithSchema(
            authHeaderSchema.merge(commitDetailsSchema),
            { ...(headers as object), ...(params as object) },
          );

        const commitInfo = await this.repositoryService.getCommitDetails(
          repoOwner,
          repoName,
          authorization,
          ref,
        );

        return {
          status: HttpStatus.OK,
          data: commitInfo,
        };
      },
    );
  }
}
