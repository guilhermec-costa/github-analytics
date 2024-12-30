import { UserService } from "../application/service/UserService";
import { IHttpServer } from "./IHttpServer";
import {
  authHeaderSchema,
  authorizeGithubUserSchema,
  refreshTokenSchema,
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
      const payload = authorizeGithubUserSchema.parse(body);
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
        const payload = refreshTokenSchema.parse(body);
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
        const reqHeaders = authHeaderSchema.parse(headers);
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
        const reqHeaders = authHeaderSchema.parse(headers);
        const userRepos = await this.userService.getUserRepositories(
          reqHeaders.authorization,
        );

        return {
          status: HttpStatus.OK,
          data: userRepos,
        };
      },
    );
  }
}
