import { HttpMethod } from "../utils/HttpMethod";

type HandlerCallback = (
  input: ControllerCallbackInput,
) => Promise<ControllerResponse>;

export interface IHttpServer {
  listen(port: number): void;
  get(url: string, callback: HandlerCallback, schema?: object): void;
  post(url: string, callback: HandlerCallback, schema?: object): void;
  put(url: string, callback: HandlerCallback, schema?: object): void;
  delete(url: string, callback: HandlerCallback, schema?: object): void;
  register(
    method: HttpMethod,
    url: string,
    callback: HandlerCallback,
    schema?: object,
  ): void;
  addRoutePrefix(prefix: string): void;
  routes: string[];
}

export type ControllerResponse = {
  data?: unknown;
  status: number;
};

export type ControllerCallbackInput = {
  params: unknown;
  body: unknown;
  token?: string;
  headers: unknown;
  queries: unknown;
};
