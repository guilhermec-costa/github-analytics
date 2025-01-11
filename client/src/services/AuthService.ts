import { BackendHttpClient } from "@/lib/http/BackendClient";
import { Location } from "react-router";
import { AuthCredentials } from "shared/types";

export class AuthService {
  static async authUsingRouteLocation(location: Location<any>) {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      const {
        data: { accessToken, refreshToken },
      } = await BackendHttpClient.post<AuthCredentials>("auth", {
        code,
      });

      return { accessToken, refreshToken };
    }
  }

  static isAuthorized() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return accessToken && refreshToken;
  }

  static async refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    const {
      data: { accessToken, refreshToken: newRefreshToken },
    } = await BackendHttpClient.post<AuthCredentials>("auth/refresh", {
      refreshToken,
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }
}
