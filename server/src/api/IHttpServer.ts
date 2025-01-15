import { HttpMethod } from "../utils/HttpMethod";

type HandlerCallback = (
  input: ControllerCallbackInput,
) => Promise<ControllerResponse>;

export interface IHttpServer {
  listen(port: number): void;
  get(url: string, callback: HandlerCallback): void;
  post(url: string, callback: HandlerCallback): void;
  put(url: string, callback: HandlerCallback): void;
  delete(url: string, callback: HandlerCallback): void;
  register(method: HttpMethod, url: string, callback: HandlerCallback): void;
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
