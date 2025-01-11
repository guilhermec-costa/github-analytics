import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

export default function GithubCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await AuthService.authUsingRouteLocation(location);
        if (response) {
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        navigate("/");
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchAuth();
  }, [location, navigate]);

  return <>Callback Component</>;
}
