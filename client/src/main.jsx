import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { MotionConfig } from 'motion/react';


createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig viewport={{ once: true }}>
        <App />
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
