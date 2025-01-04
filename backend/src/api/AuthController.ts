import { UserService } from "../application/service/UserService";
import { IHttpServer } from "./IHttpServer";
import {
  authorizeGithubUserSchema,
  refreshTokenSchema,
  ZodParserInterceptor,
} from "../utils/schemas";
import { HttpStatus } from "../utils/HttpStatus";
import { HttpMethod } from "../utils/HttpMethod";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  constructor(
    httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public setupRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.register(HttpMethod.POST, this.prefix, async ({ body }) => {
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
      `${this.prefix}/refresh`,
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
  }
}
