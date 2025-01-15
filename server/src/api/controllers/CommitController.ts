import { HttpStatus } from "../../utils/HttpStatus";
import {
  AuthorizationHeaderSchema,
  CommitPeriodSchema,
  CommitReferenceSchema,
  RepositoryOwnerPairSchema,
  RepositoryOwnerSchema,
} from "../schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";
import { ZodParserInterceptor } from "../../utils/ZodParserInterceptor";
import { RepoManager } from "../../application/service/RepoManager";

export class CommitController extends BaseController {
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
      `${this.prefix}/owner/:repoOwner/repo/:repoName`,
      async ({ headers, params, queries }) => {
        const { repoOwner, repoName, authorization, since, until } =
          ZodParserInterceptor.parseWithSchema(
            AuthorizationHeaderSchema.merge(RepositoryOwnerPairSchema).merge(
              CommitPeriodSchema,
            ),
            {
              ...(headers as object),
              ...(params as object),
              ...(queries as object),
            },
          );

        const commitInfo = await this.repositoryService.loadCommitPeriod(
          repoOwner,
          repoName,
          authorization,
          since,
          until,
        );

        return {
          status: HttpStatus.OK,
          data: commitInfo,
        };
      },
    );
  }
}
