import { PrivateComponent } from "@/components/PrivateComponent";
import { createBrowserRouter } from "react-router";
import { lazy } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() => import("@/pages/Home"));
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() => import("@/pages/Login"));
// eslint-disable-next-line react-refresh/only-export-components
const CallbackPage = lazy(
  () => import("@/features/authentication/components/CalbackComponent"),
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/callback",
    element: <CallbackPage />,
  },
  {
    path: "/",
    element: (
      <PrivateComponent>
        <HomePage />
      </PrivateComponent>
    ),
  },
]);
