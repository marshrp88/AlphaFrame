/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the whole app.
 */

import React from 'react';
import { Button } from "../shared/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/Card.jsx";
import { AlertCircle } from 'lucide-react';

/**
 * ErrorBoundary Component State
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError - Whether an error has been caught
 * @property {Error|null} error - The caught error object
 */

/**
 * ErrorBoundary Component Props
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children - Child components to render
 */

/**
 * ErrorBoundary Component
 * @extends {React.Component<ErrorBoundaryProps, ErrorBoundaryState>}
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    console.log('Debug: ErrorBoundary constructed');
  }

  /**
   * Static lifecycle method called when an error is thrown in a descendant component
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state object
   */
  static getDerivedStateFromError(error) {
    console.log('Debug: ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * Handles the refresh button click
   */
  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    console.log('Debug: ErrorBoundary rendering, hasError:', this.state.hasError);
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We apologize for the inconvenience. An error has occurred in the application.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-mono text-muted-foreground">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>
              <Button 
                onClick={this.handleRefresh}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 
