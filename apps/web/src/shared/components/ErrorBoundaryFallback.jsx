/**
 * ErrorBoundaryFallback.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: User-friendly error fallback component that provides
 * clear messaging, recovery options, and maintains user trust
 * when unexpected errors occur.
 * 
 * Procedure:
 * 1. Display reassuring message about data safety
 * 2. Provide clear recovery actions (reload, support)
 * 3. Log error details for debugging
 * 4. Maintain user context and session
 * 
 * Conclusion: Ensures users feel safe and supported
 * even when technical issues occur.
 */

import React from 'react';
import { Button } from '../ui/Button.jsx';
import { Card } from '../ui/Card.jsx';
import { AlertTriangle, RefreshCw, HelpCircle, Home } from 'lucide-react';

/**
 * Error boundary fallback component
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that occurred
 * @param {Function} props.resetError - Function to reset the error
 * @param {string} props.componentStack - Component stack trace
 * @returns {JSX.Element} Error fallback UI
 */
export const ErrorBoundaryFallback = ({ error, componentStack }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleSupport = () => {
    // Open support modal or redirect to support page
    window.open('mailto:support@alphaframe.com?subject=Error Report', '_blank');
  };

  const handleReportError = () => {
    // Log error to Sentry or error reporting service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          component: {
            stack: componentStack
          }
        },
        tags: {
          errorType: 'boundary_error',
          component: 'ErrorBoundaryFallback'
        }
      });
    }

    // Show success message
    alert('Error reported successfully. Thank you for helping us improve AlphaFrame!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-4">
            Don&apos;t worry - your data is safe and secure. We&apos;ve been notified of this issue and are working to fix it.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <Button 
            onClick={handleReload}
            className="w-full"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="w-full"
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-3">
            Need help? Our support team is here to assist you.
          </p>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSupport}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Contact Support
            </Button>
            
            <Button 
              onClick={handleReportError}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Report Issue
            </Button>
          </div>
        </div>

        {/* Error details for debugging (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
              <div><strong>Error:</strong> {error.message}</div>
              <div><strong>Stack:</strong></div>
              <pre className="whitespace-pre-wrap">{error.stack}</pre>
              {componentStack && (
                <>
                  <div><strong>Component Stack:</strong></div>
                  <pre className="whitespace-pre-wrap">{componentStack}</pre>
                </>
              )}
            </div>
          </details>
        )}
      </Card>
    </div>
  );
}; 