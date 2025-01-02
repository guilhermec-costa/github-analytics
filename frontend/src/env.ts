import { z } from "zod";

const envSchema = z.object({
  VITE_BACKEND_BASEURL: z.string(),
});

const env = envSchema.parse(import.meta.env);

console.log(env);
export default env;
