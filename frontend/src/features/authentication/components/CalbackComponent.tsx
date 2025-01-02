import useLocalStorage from "@/hooks/useLocalStorage";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { GithubUserService } from "@/services/githubUserService";

export default function CallbackComponent() {
  const { setValue: guardAccessToken } = useLocalStorage<string>("accessToken");
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
          const userInformationResponse =
            await GithubUserService.getLoggedUserInfo(response.accessToken);
          guardUsername(userInformationResponse.data.login);
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchAuth();
  }, [guardAccessToken, guardRefreshToken, location, navigate, guardUsername]);

  return <>Callback Component</>;
}
