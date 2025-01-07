import { UserService } from "../../application/service/UserService";
import { HttpStatus } from "../../utils/HttpStatus";
import {
  GithubUserAuthorizationSchema,
  RefreshTokenRequestSchema,
} from "../schemas";
import { IHttpServer } from "../IHttpServer";
import { BaseController } from "./BaseController";
import { ZodParserInterceptor } from "../../utils/ZodParserInterceptor";

export class AuthController extends BaseController {
  constructor(
    httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public mapRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.post(this.prefix, async ({ body }) => {
      const { code } = ZodParserInterceptor.parseWithSchema(
        GithubUserAuthorizationSchema,
        body,
      );

      const { accessToken, refreshToken } = await this.userService.oauth(code);
      return {
        status: HttpStatus.CREATED,
        data: {
          accessToken,
          refreshToken,
        },
      };
    });

    this.httpServer.post(`${this.prefix}/refresh`, async ({ body }) => {
      const { refreshToken: reqToken } = ZodParserInterceptor.parseWithSchema(
        RefreshTokenRequestSchema,
        body,
      );
      const { accessToken, refreshToken } =
        await this.userService.refresh(reqToken);

      return {
        status: HttpStatus.CREATED,
        data: {
          accessToken,
          refreshToken,
        },
      };
    });
  }
}
