import { BackendHttpClient } from "@/lib/http/BackendClient";
import { authResponse } from "@/utils/types";
import { Location } from "react-router";

export class AuthService {
  static async authUsingRouteLocation(location: Location<any>) {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      const {
        data: { accessToken, refreshToken },
      } = await BackendHttpClient.post<authResponse>("auth", {
        code,
      });

      return { accessToken, refreshToken };
    }
  }

  static async getLoggedUserInformation(token: string) {
    const response = await BackendHttpClient.get("userInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}
