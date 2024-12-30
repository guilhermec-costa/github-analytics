import { z } from "zod";

export const authHeaderSchema = z.object({
  authorization: z.string().nonempty(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const authorizeGithubUserSchema = z.object({
  code: z.string().nonempty(),
});
