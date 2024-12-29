import cors from '@fastify/cors';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { ControllerCallbackInput, ControllerResponse, IHttpServer } from "../../api/IHttpServer";
import { BaseException } from "../../utils/Exceptions";
import { ILogger } from '../config/ILogger';
import WinstonLogger from '../config/WinstonLogger';

export class FastifyAdapter implements IHttpServer {
    private app: FastifyInstance
    private routePrefix: string;
    private logger!: ILogger;

    constructor() {
        this.app = fastify();
        this.app.register(cors, {
            origin: true
        })
        this.routePrefix = "";
        this.setErrorMiddleware();
        this.logger = new WinstonLogger();
    }

    listen(port: number): void {
        this.app.listen({ port }).then(() => {
            this.logger.log(`Github Analytics server running at port ${port}`);
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
                    headers: req.headers
                })
                reply.status(output.status).send(output.data && output.data);
            }
        });
        this.logger.log(`[${method.toUpperCase()}] Route ${fullUrl} successfully registered`)
    }

    private setErrorMiddleware() {
        this.app.setErrorHandler((error: Error & Partial<BaseException>, req: FastifyRequest, reply: FastifyReply) => {
            const statusCode = error.statusCode ?? 500;
            const defaultMessage = error.message ?? 'An error happended!';
            reply.status(statusCode).send({
                date: new Date().toISOString(),
                path: req.originalUrl,
                message: defaultMessage,
            })
        })
    }
}