import { z, ZodObject, ZodRawShape } from "zod";
import { BadRequest } from "../utils/Exceptions";

export const authHeaderSchema = z.object({
  authorization: z.string().nonempty(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const authorizeGithubUserSchema = z.object({
  code: z.string().nonempty(),
});

export const repoOwnerPair = z.object({
  repoName: z.string().nonempty(),
  repoOwner: z.string().nonempty(),
});

export const repoOwnerSchema = z.object({
  repoOwner: z.string().nonempty(),
});

export const commitDetailsSchema = z
  .object({
    ref: z.string().nonempty(),
  })
  .merge(repoOwnerPair);

export class ZodParserInterceptor {
  static parseWithSchema<T extends ZodRawShape>(
    object: ZodObject<T>,
    data: unknown,
  ): z.infer<ZodObject<T>> {
    try {
      return object.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        throw new BadRequest(JSON.stringify(formattedErrors), true);
      }

      throw error;
    }
  }
}
