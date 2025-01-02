import { AuthService } from "@/features/authentication/services/authService";
import { Navigate } from "react-router-dom";

export function PrivateComponent({ children }: { children: React.ReactNode }) {
  if (!AuthService.isAuthorized()) return <Navigate to={"/login"} />;
  return children;
}
