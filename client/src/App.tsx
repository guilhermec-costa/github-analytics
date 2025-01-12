import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import "@/App.css";
import { Toaster } from "./components/ui/toaster";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
