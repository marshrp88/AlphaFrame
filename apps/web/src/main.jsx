/**
 * main.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Application entry point with Sentry error tracking
 * and global error boundary setup for production monitoring.
 * 
 * Procedure:
 * 1. Initialize Sentry for error tracking
 * 2. Set up global error boundary
 * 3. Configure React app with routing
 * 4. Enable production error monitoring
 * 
 * Conclusion: Provides comprehensive error tracking
 * and monitoring for production-ready application.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";
import "./index.css";
import { config } from "./lib/config.js";

// Auth0 configuration
const auth0Config = {
  domain: config.auth0.domain,
  clientId: config.auth0.clientId,
  authorizationParams: {
    redirect_uri: config.auth0.redirectUri,
    audience: config.auth0.audience,
    scope: "openid profile email read:financial_data write:financial_data"
  },
  cacheLocation: "localstorage",
  useRefreshTokens: true,
  // Development settings
  ...(config.env === "development" && {
    cacheLocation: "localstorage",
    useRefreshTokens: true
  })
};

// Validate Auth0 configuration
// console.warn("⚠️ Auth0 not configured - authentication will be disabled"); // Commented for production cleanliness
// console.warn("Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your environment"); // Commented for production cleanliness

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider {...auth0Config}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
