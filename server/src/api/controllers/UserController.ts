import { UserService } from "../../application/service/UserService";
import { HttpStatus } from "../../utils/HttpStatus";
import { AuthorizationHeaderSchema, SpecificUsernameQuery } from "../schemas";
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

    this.httpServer.get(`${this.prefix}/authorized`, async ({ headers }) => {
      const { authorization } = ZodParserInterceptor.parseWithSchema(
        AuthorizationHeaderSchema,
        headers,
      );
      const userData =
        await this.userService.loadAuthorizedUserInfo(authorization);

      return {
        status: HttpStatus.OK,
        data: userData,
      };
    });

    this.httpServer.get(
      `${this.prefix}/specific`,
      async ({ queries, headers }) => {
        const { authorization, username } =
          ZodParserInterceptor.parseWithSchema(
            AuthorizationHeaderSchema.merge(SpecificUsernameQuery),
            { ...(headers as object), ...(queries as object) },
          );

        const userData = await this.userService.loadSpecificUser(
          authorization,
          username,
        );

        return {
          status: HttpStatus.OK,
          data: userData,
        };
      },
    );

    this.httpServer.get(`${this.prefix}/orgs`, async ({ queries, headers }) => {
      const { authorization, username } = ZodParserInterceptor.parseWithSchema(
        AuthorizationHeaderSchema.merge(SpecificUsernameQuery),
        { ...(headers as object), ...(queries as object) },
      );

      const userData = await this.userService.loadUserOrgs(
        authorization,
        username,
      );

      return {
        status: HttpStatus.OK,
        data: userData,
      };
    });
  }
}
