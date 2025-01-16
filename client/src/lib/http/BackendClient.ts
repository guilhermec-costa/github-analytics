import env from "@/env";
import axios from "axios";
import { AuthService } from "@/services/AuthService";

enum StatusCode {
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

export const BackendHttpClient = axios.create({
  baseURL: env.VITE_BACKEND_BASEURL,
  headers: { Accept: "application/json" },
});

export const rateLimitStorageKey = "rate-limite-exceed";

BackendHttpClient.interceptors.response.use(
  (response) => {
    if (localStorage.getItem(rateLimitStorageKey)) {
      localStorage.removeItem(rateLimitStorageKey);
    }

    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === StatusCode.INTERNAL_SERVER_ERROR) {
        const message = error.response?.data.message as string;
        if (message.toLowerCase().includes("api rate limit")) {
          localStorage.setItem(rateLimitStorageKey, "true");
        }
      }

      if (status === StatusCode.UNAUTHORIZED) {
        try {
          const headers = error.config?.headers;
          const { accessToken, newRefreshToken } = await AuthService.refresh();

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          headers!["Authorization"] = `Bearer ${accessToken}`;

          return BackendHttpClient.request(error.config!);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          throw refreshError;
        }
      }
    }
  },
);
