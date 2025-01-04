import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import "@/App.css";

export function App() {
  return <RouterProvider router={router} />;
}
