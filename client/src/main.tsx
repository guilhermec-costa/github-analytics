import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const env = import.meta.env.VITE_ENVIRONMENT;

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  env == "DEVELOPMENT" || env == "HML" ? (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  ) : (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
);
