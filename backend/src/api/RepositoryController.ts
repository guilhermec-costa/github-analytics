import { RepositoryService } from "../application/service/RepositoryService";
import { HttpMethod } from "../utils/HttpMethod";
import { HttpStatus } from "../utils/HttpStatus";
import {
  ZodParserInterceptor,
  authHeaderSchema,
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
  }
}
