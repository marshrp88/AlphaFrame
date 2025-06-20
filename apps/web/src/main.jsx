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

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Initialize Sentry for error tracking (only in production)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV || 'production',
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'alphaframe.com'],
        }),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance monitoring
      tracesSampleRate: 0.1,
      // Session replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      // Context
      beforeSend(event) {
        // Add user context if available
        const user = JSON.parse(localStorage.getItem('alphaframe_user_profile') || '{}');
        if (user.sub) {
          event.user = {
            id: user.sub,
            email: user.email,
            username: user.name
          };
        }
        
        // Add feature flags context
        const featureFlags = JSON.parse(localStorage.getItem('feature_flags_user_overrides') || '{}');
        event.tags = {
          ...event.tags,
          beta_mode: featureFlags.beta_mode ? 'enabled' : 'disabled',
          plaid_integration: featureFlags.plaid_integration ? 'enabled' : 'disabled'
        };
        
        return event;
      }
    });
    
    // Make Sentry available globally
    window.Sentry = Sentry;
  }).catch(() => {
    console.warn('Sentry failed to load - error tracking disabled');
  });
}

console.log('Debug: Starting to mount app');
const rootElement = document.getElementById('root');
console.log('Debug: Root element found:', rootElement);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
console.log('Debug: Render called');
