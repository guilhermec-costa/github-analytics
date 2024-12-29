import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { ControllerCallbackInput, ControllerResponse, IHttpServer } from "../../api/IHttpServer";
import { BaseException } from "../../utils/Exceptions";

export class FastifyAdapter implements IHttpServer {
    private app: FastifyInstance
    private routePrefix: string;

    constructor() {
        this.app = fastify();
        this.routePrefix = "";
        this.setErrorMiddleware();
    }


    listen(port: number): void {
        this.app.listen({
            port: port
        }).then(() => {
            console.log(`Server running at ${port}`)
        });
    }

    addRoutePrefix(prefix: string): void {
      this.routePrefix = prefix;
    }

    register(method: string, url: string, callback: (input: ControllerCallbackInput) => Promise<ControllerResponse>): void {
        const fullUrl = `/${this.routePrefix}/${url}`;
        this.app.route({
            method: method as HTTPMethods,
            url: fullUrl,
            handler: async (req: FastifyRequest, reply: FastifyReply) => {
                const output = await callback({
                    params: req.params,
                    body: req.body,
                })
                reply.status(output.status).send(output.data && output.data);
            }
        });
    }

    private setErrorMiddleware() {
        this.app.setErrorHandler((error: Error & Partial<BaseException>, req: FastifyRequest, reply: FastifyReply) => {
            const statusCode = error.statusCode ?? 500;
            const defaultMessage = error.message ?? 'An error happended!';
            reply.status(statusCode).send({
                statusCode,
                date: new Date().toISOString(),
                path: req.originalUrl,
                message: defaultMessage,
            })
        })
    }
}