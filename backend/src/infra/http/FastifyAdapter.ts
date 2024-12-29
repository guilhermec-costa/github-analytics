import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { ControllerCallbackInput, ControllerResponse, IHttpServer } from "../../api/IHttpServer";

export class FastifyAdapter implements IHttpServer {
    private app: FastifyInstance
    private routePrefix: string;

    constructor() {
        this.app = fastify();
        this.routePrefix = "";
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
}