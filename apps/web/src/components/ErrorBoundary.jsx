/**
 * ErrorBoundary.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Global error boundary that catches React errors
 * and displays user-friendly fallback UI with recovery options.
 * 
 * Procedure:
 * 1. Catch JavaScript errors in component tree
 * 2. Log errors to Sentry for debugging
 * 3. Display ErrorBoundaryFallback component
 * 4. Prevent app crashes and maintain user trust
 * 
 * Conclusion: Provides robust error handling and recovery
 * for production-ready user experience.
 */

import React from "react";
import { ErrorBoundaryFallback } from "../shared/components/ErrorBoundaryFallback.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      componentStack: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    console.log('[ErrorBoundary] Test mode:', import.meta.env.VITE_APP_ENV === 'test');
    console.log('[ErrorBoundary] Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    // Update state with component stack
    this.setState({ componentStack: errorInfo.componentStack });
    
    // Log to Sentry if available
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          component: {
            stack: errorInfo.componentStack
          }
        },
        tags: {
          errorType: 'react_error_boundary',
          component: 'ErrorBoundary'
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null, componentStack: null })}
          componentStack={this.state.componentStack}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary }; 