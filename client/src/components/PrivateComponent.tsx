import { Navigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

export function PrivateComponent({ children }: { children: React.ReactNode }) {
  if (!AuthService.isAuthorized()) return <Navigate to={"/login"} />;
  return children;
}
