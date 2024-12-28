
export interface IHttpServer {
    listen(port: number): void
    register(method: string, url: string,callback: (input: ControllerCallbackInput) => Promise<ControllerResponse>): void
}

export type ControllerResponse = {
    data?: unknown
    status: number
}

export type ControllerCallbackInput = {
    params: unknown,
    body: unknown,
    token?: string
}