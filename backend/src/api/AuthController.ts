import { z } from "zod";
import { UserService } from "../application/service/UserService";
import { IHttpServer } from "./IHttpServer";

export class AuthController {
    constructor(private readonly httpServer: IHttpServer, private readonly userService: UserService) {
        this.httpServer.register('post', 'auth', async ({ body }) => {
            const schema = z.object({
                code: z.string().nonempty()
            }) 
            const payload = schema.parse(body)
            const {accessToken, refreshToken} = await userService.auth(payload.code)
            return {
                status: 200, 
                data: {
                  accessToken, 
                  refreshToken
                }
            }
        })
    }   
}