import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().min(1000),
    ENV: z.union([z.literal('development'), z.literal('production')]).default('development'),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_ACCESS_TOKEN_URL: z.string(),
    LOG_LEVEL: z.string()
})

const env = envSchema.parse(process.env)

export default env

