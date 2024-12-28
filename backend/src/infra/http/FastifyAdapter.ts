import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { ControllerCallbackInput, ControllerResponse, IHttpServer } from "../../api/IHttpServer";

export class FastifyAdapter implements IHttpServer {
    private app: FastifyInstance
    private readonly API_VERSION = 1

    constructor() {
        this.app = fastify();
    }

    listen(port: number): void {
        this.app.listen({
            port: port
        }).then(() => {
            console.log(`Server running at ${port}`)
        });
    }

    register(method: string, url: string, callback: (input: ControllerCallbackInput) => Promise<ControllerResponse>, allowAnonymous?: boolean): void {
        const fullUrl = `/api/v${this.API_VERSION}/${url}`;
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
}