import env from "@/env";
import axios from "axios";

export const BackendHttpClient = axios.create({
  baseURL: env.VITE_BACKEND_BASEURL,
  headers: { Accept: "application/json" },
});
