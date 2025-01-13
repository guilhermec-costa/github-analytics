import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import "@/App.css";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeProvider";

export function App() {
  return (
    <>
      <ThemeProvider storageKey="theme" defaultTheme="dark" key="themeProvider">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
}
