import { IHttpServer } from "../IHttpServer";

export abstract class BaseController {
  protected prefix: string = "";
  protected fallbackPrefix: string;

  constructor(protected readonly httpServer: IHttpServer) {
    this.fallbackPrefix = this.constructor.name
      .toLowerCase()
      .split("controller")[0];
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  public abstract mapRoutes(): void;
}
