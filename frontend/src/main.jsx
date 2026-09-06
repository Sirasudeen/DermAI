import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/base.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2f201a",
              color: "#f2e9df",
              border: "1px solid rgba(242,233,223,0.14)",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
              maxWidth: "34rem",
            },
            success: { iconTheme: { primary: "#c98b4b", secondary: "#17100c" } },
            error: { iconTheme: { primary: "#d08a72", secondary: "#17100c" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
