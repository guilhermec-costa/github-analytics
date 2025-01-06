import { UserService } from "../../application/service/UserService";
import { HttpMethod } from "../../utils/HttpMethod";
import { HttpStatus } from "../../utils/HttpStatus";
import { authHeaderSchema, ZodParserInterceptor } from "../../utils/schemas";
import { BaseController } from "./BaseController";
import { IHttpServer } from "../IHttpServer";

export class UserController extends BaseController {
  constructor(
    readonly httpServer: IHttpServer,
    private readonly userService: UserService,
  ) {
    super(httpServer);
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  public setupRoutes() {
    if (!this.prefix) {
      this.prefix = this.fallbackPrefix;
    }

    this.httpServer.register(
      HttpMethod.GET,
      `${this.prefix}/info`,
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
  }
}
