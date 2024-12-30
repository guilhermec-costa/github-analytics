import { CallbackComponent } from "@/components/CalbackComponent";
import { Login } from "@/components/Login";
import { PrivateComponent } from "@/components/PrivateComponent";
import Home from "@/pages/home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/callback",
    element: <CallbackComponent />,
  },
  {
    path: "/",
    element: (
      <PrivateComponent>
        <Home />
      </PrivateComponent>
    ),
  },
]);
