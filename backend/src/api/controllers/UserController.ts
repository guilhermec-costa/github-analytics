import { UserService } from "../../application/service/UserService";
import { HttpStatus } from "../../utils/HttpStatus";
import { authHeaderSchema, ZodParserInterceptor } from "../schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";

export class UserController extends BaseController {
  constructor(
    readonly httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public setupRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.get(`${this.prefix}/info`, async ({ headers }) => {
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
    });
  }
}
