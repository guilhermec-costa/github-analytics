import { PrivateComponent } from "@/components/PrivateComponent";
import { createBrowserRouter } from "react-router";
import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));

const LoginPage = lazy(() => import("@/pages/Login"));

const GithubCallback = lazy(() => import("@/pages/GithubCallback"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/callback",
    element: <GithubCallback />,
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
