import { UserService } from "../application/service/UserService";
import { IHttpServer } from "./IHttpServer";
import {
  authHeaderSchema,
  authorizeGithubUserSchema,
  refreshTokenSchema,
  repoBytesSchema,
  repoLanguageSchema,
  ZodParserInterceptor,
} from "../utils/schemas";
import { HttpStatus } from "../utils/HttpStatus";
import { HttpMethod } from "../utils/HttpMethod";

export class AuthController {
  constructor(
    private readonly httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {}

  public setupRoutes() {
    this.httpServer.register(HttpMethod.POST, "auth", async ({ body }) => {
      const payload = ZodParserInterceptor.parseWithSchema(
        authorizeGithubUserSchema,
        body,
      );

      const { accessToken, refreshToken } = await this.userService.auth(
        payload.code,
      );
      return {
        status: HttpStatus.CREATED,
        data: {
          accessToken,
          refreshToken,
        },
      };
    });

    this.httpServer.register(
      HttpMethod.POST,
      "auth/refresh",
      async ({ body }) => {
        const payload = ZodParserInterceptor.parseWithSchema(
          refreshTokenSchema,
          body,
        );
        const { accessToken, refreshToken } = await this.userService.refresh(
          payload.refreshToken,
        );

        return {
          status: HttpStatus.CREATED,
          data: {
            accessToken,
            refreshToken,
          },
        };
      },
    );

    this.httpServer.register(
      HttpMethod.GET,
      "userInfo",
      async ({ headers }) => {
        const reqHeaders = ZodParserInterceptor.parseWithSchema(
          authHeaderSchema,
          headers,
        );
        const userData = await this.userService.getUserInformation(
          reqHeaders.authorization,
        );

        return {
          status: HttpStatus.OK,
          data: userData,
        };
      },
    );

    this.httpServer.register(
      HttpMethod.GET,
      "userRepos",
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
      "repoLanguages/owner/:repoOwner/name/:repoName",
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
      "repoLanguages/owner/:repoOwner",
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
  }
}
