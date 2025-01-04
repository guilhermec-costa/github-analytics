import env from "@/env";
import { AuthService } from "@/features/authentication/services/authService";
import axios from "axios";

enum StatusCode {
  UNAUTHORIZED = 401,
}

export const BackendHttpClient = axios.create({
  baseURL: env.VITE_BACKEND_BASEURL,
  headers: { Accept: "application/json" },
});

BackendHttpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
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
