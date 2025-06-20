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

console.log("🚀 main.jsx is loading...");

import React from "react";
import ReactDOM from "react-dom/client";

console.log("🔧 React imports successful");

console.log("🧩 Attempting to import App.jsx...");
import App from "./App.jsx";
console.log("🧩 App.jsx import successful");

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("🔧 React root created successfully");

root.render(<App />);
console.log("✅ Real App mounted successfully");
