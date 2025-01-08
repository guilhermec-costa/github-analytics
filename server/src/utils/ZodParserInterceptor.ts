import { ZodRawShape, ZodObject, z } from "zod";
import { BadRequest } from "./Exceptions";

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
