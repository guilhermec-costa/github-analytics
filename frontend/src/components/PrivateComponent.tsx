import { Navigate } from "react-router-dom";

export function PrivateComponent({ children }: { children: React.ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken || !accessToken) return <Navigate to={"/login"} />;
  return children;
}
