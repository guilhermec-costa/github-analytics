import { RepositoryService } from "../../application/service/RepositoryService";
import { HttpStatus } from "../../utils/HttpStatus";
import {
  ZodParserInterceptor,
  authHeaderSchema,
  commitDetailsSchema,
  repoOwnerSchema,
} from "../schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";

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

    this.httpServer.get(
      `${this.prefix}/metrics/:repoOwner`,
      async ({ params, headers }) => {
        const { authorization, repoOwner } =
          ZodParserInterceptor.parseWithSchema(
            repoOwnerSchema.merge(authHeaderSchema),
            { ...(params as object), ...(headers as object) },
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

    this.httpServer.get(
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
