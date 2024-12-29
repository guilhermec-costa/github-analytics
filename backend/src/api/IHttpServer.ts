import { ILogger } from "../infra/config/ILogger";

export interface IHttpServer {
    listen(port: number): void;
    register(method: string, url: string,callback: (input: ControllerCallbackInput) => Promise<ControllerResponse>): void;
    addRoutePrefix(prefix: string): void;

}

export type ControllerResponse = {
    data?: unknown
    status: number
}

export type ControllerCallbackInput = {
    params: unknown,
    body: unknown,
    token?: string,
    headers: unknown
}