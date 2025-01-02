import useLocalStorage from "@/hooks/useLocalStorage";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";

export default function CallbackComponent() {
  const { storedValue: accessToken, setValue: guardAccessToken } =
    useLocalStorage<string>("accessToken");
  const { setValue: guardRefreshToken } =
    useLocalStorage<string>("refreshToken");
  const { setValue: guardUsername } = useLocalStorage<string>("username");
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await AuthService.authUsingRouteLocation(location);
        if (response) {
          guardAccessToken(response.accessToken);
          guardRefreshToken(response.refreshToken);
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchAuth();
  }, [guardAccessToken, guardRefreshToken, location, navigate]);

  React.useEffect(() => {
    async function fetchInfo() {
      const userInformationResponse =
        await AuthService.getLoggedUserInformation(accessToken);
      guardUsername(userInformationResponse.login);
      navigate("/");
    }

    fetchInfo();
  }, [accessToken, guardUsername]);

  return <></>;
}
