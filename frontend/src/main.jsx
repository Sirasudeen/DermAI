import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import axios from "axios";

const baseDomain = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const apiVersion = "/api/v1";

axios.defaults.baseURL = `${baseDomain}${apiVersion}`;
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: {
    fontFamily: "Hey Comic,Naturally,Roboto Slab,serif,Montserrat,Poppins",
    allVariants: { color: "white" },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Toaster position="bottom-left" />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
