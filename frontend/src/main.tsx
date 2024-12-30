import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import React from "react";

const env = import.meta.env.VITE_ENVIRONMENT;

createRoot(document.getElementById("root")!).render(
  env == "DEVELOPMENT" || env == "HML" ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
);
