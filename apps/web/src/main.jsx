/**
 * main.jsx - STUBBED FOR MVEP PHASE 0
 * 
 * TODO [MVEP_PHASE_1]:
 * This module is currently stubbed and non-functional.
 * Real authentication will be implemented in Phase 1 of the MVEP rebuild plan.
 * 
 * Purpose: Will provide application entry point with error tracking
 * and global error boundary setup for production monitoring.
 * 
 * Current Status: Auth0 removed, using stubbed authentication
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import * as Sentry from '@sentry/react';
import "./index.css";
import { config } from '@/lib/config.js';

// Sentry init (staging only if DSN provided)
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT || 'staging',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    integrations: [],
    release: import.meta.env.VITE_RELEASE || undefined,
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
