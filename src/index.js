import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./output.css"
import App from "./App.js";
import axios from "axios";
// Axios global configuration
axios.defaults.baseURL = "https://filmansh.cinemapro.in/api/auth";
axios.defaults.headers.common["ngrok-skip-browser-warning"] = true;
axios.interceptors.request.use(
  (config) => {
    // Assuming ls is some utility for accessing localStorage
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Render the React App
createRoot(document.getElementById("root")).render(
  <>
    <App />
  </>
);