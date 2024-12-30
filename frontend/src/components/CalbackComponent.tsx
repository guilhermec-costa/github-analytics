import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function CallbackComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuth = async () => {
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get("code");

      if (code) {
        try {
          const response = await axios.post(
            "http://localhost:3333/api/v1/auth",
            { code },
          );
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          navigate("/");
        } catch {
          navigate("/login");
        }
      }
    };

    fetchAuth();
  }, [location.search, navigate]);

  return <></>;
}
