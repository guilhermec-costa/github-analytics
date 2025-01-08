import { HttpStatus } from "../../utils/HttpStatus";
import {
  AuthorizationHeaderSchema,
  CommitReferenceSchema,
  RepositoryOwnerSchema,
} from "../schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";
import { ZodParserInterceptor } from "../../utils/ZodParserInterceptor";
import { RepoManager } from "../../application/service/RepoManager";

export class RepositoryController extends BaseController {
  constructor(
    protected readonly httpServer: IHttpServer,
    private readonly repositoryService: RepoManager,
  ) {
    super(httpServer);
  }

  public mapRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.get(
      `${this.prefix}/metrics/:repoOwner`,
      async ({ params, headers }) => {
        const { authorization, repoOwner } =
          ZodParserInterceptor.parseWithSchema(
            RepositoryOwnerSchema.merge(AuthorizationHeaderSchema),
            { ...(params as object), ...(headers as object) },
          );

        const userRepos =
          await this.repositoryService.loadUserRepositoriesMetrics(
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
            AuthorizationHeaderSchema.merge(CommitReferenceSchema),
            { ...(headers as object), ...(params as object) },
          );

        const commitInfo = await this.repositoryService.loadCommitDetails(
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
