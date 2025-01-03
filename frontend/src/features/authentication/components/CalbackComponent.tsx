import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { GithubUserService } from "@/services/githubUserService";
import { useGithubUser } from "@/context/githubUserContext";

export default function CallbackComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUserDetails } = useGithubUser();

  React.useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await AuthService.authUsingRouteLocation(location);
        if (response) {
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          const userInformationResponse =
            await GithubUserService.getLoggedUserInfo(response.accessToken);

          updateUserDetails(userInformationResponse);
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchAuth();
  }, [location, navigate]);

  return <>Callback Component</>;
}
