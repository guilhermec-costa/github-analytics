import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import "@/App.css";
import { GithubUserProvider } from "./context/githubUserContext";

export function App() {
  return (
    <GithubUserProvider>
      <RouterProvider router={router} />
    </GithubUserProvider>
  );
}
