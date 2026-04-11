import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global Styles
import "./styles/tailwind.css";

// Context
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>   {/* 🔥 ADD THIS */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);