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

// Minimal Web Vitals logging (privacy-first): logs to console; if Sentry is enabled, send as messages
function startWebVitalsLogging() {
  try {
    const consent = localStorage.getItem('alphaframe_consent') === 'true';
    if (!consent) return;
    if ('PerformanceObserver' in window) {
      const report = (name, value) => {
        const msg = `[Vitals] ${name}: ${Math.round(value * 100) / 100}`;
        // eslint-disable-next-line no-console
        console.log(msg);
        try { Sentry.captureMessage && Sentry.captureMessage(msg, { level: 'info' }); } catch (_) {}
      };
      try {
        const lcpObs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) report('LCP', last.renderTime || last.loadTime || last.startTime);
        });
        lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (_) {}
      try {
        const fidObs = new PerformanceObserver((list) => {
          const first = list.getEntries()[0];
          if (first) report('FID', first.processingStart - first.startTime);
        });
        fidObs.observe({ type: 'first-input', buffered: true });
      } catch (_) {}
      try {
        const inpObs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const worst = entries.sort((a,b) => b.duration - a.duration)[0];
          if (worst) report('INP', worst.duration);
        });
        inpObs.observe({ type: 'event', durationThreshold: 40 });
      } catch (_) {}
    }
  } catch (_) {}
}

startWebVitalsLogging();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
