import { UserService } from "../../application/service/UserService";
import { HttpStatus } from "../../utils/HttpStatus";
import { AuthorizationHeaderSchema } from "../schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";
import { ZodParserInterceptor } from "../../utils/ZodParserInterceptor";

export class UserController extends BaseController {
  constructor(
    readonly httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public mapRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.get(`${this.prefix}/info`, async ({ headers }) => {
      const { authorization } = ZodParserInterceptor.parseWithSchema(
        AuthorizationHeaderSchema,
        headers,
      );
      const userData = await this.userService.loadUserInfo(authorization);

      return {
        status: HttpStatus.OK,
        data: userData,
      };
    });
  }
}
