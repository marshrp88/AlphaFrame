/**
 * ErrorBoundary.jsx - AlphaFrame VX.1 Enhanced Error Boundary
 * 
 * Purpose: Catches JavaScript errors anywhere in the component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Procedure:
 * 1. Catch errors in component tree
 * 2. Log errors for debugging
 * 3. Display user-friendly error message
 * 4. Provide recovery options
 * 5. Maintain application stability
 * 
 * Conclusion: Ensures application stability and provides
 * helpful error recovery options for users.
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield, HelpCircle } from 'lucide-react';
import StyledButton from './ui/StyledButton';
import CompositeCard from './ui/CompositeCard';
import './ErrorBoundary.css';
import env from '../lib/env.js';
import { useNavigate } from 'react-router-dom';
import ResetDemoButton from './ui/ResetDemoButton';
import errorHandlingService from '../lib/services/ErrorHandlingService.js';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('AlphaFrame Error Boundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Use the error handling service to process the error
    errorHandlingService.handleError(error, {
      type: 'react_error_boundary',
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    const navigate = useNavigate();
    navigate('/');
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // Create error report
    const errorReport = {
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack
      }
    };

    // In production, send to error reporting service
    console.log('Error Report:', errorReport);
    
    // For now, just show a message
    alert('Error report generated. Check console for details.');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      
      return (
        <div className="error-boundary-container">
          <CompositeCard variant="elevated" className="error-boundary-card">
            <div className="error-boundary-header">
              <div className="error-icon">
                <AlertTriangle size={32} />
              </div>
              <h1 className="error-title">Something went wrong</h1>
              <p className="error-subtitle">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            <div className="error-details">
              {env.DEV && error && (
                <details className="error-stack">
                  <summary>Error Details (Development)</summary>
                  <div className="error-message">
                    <strong>Error:</strong> {error.message}
                  </div>
                  <div className="error-stack-trace">
                    <strong>Stack Trace:</strong>
                    <pre>{error.stack}</pre>
                  </div>
                  <div className="error-id">
                    <strong>Error ID:</strong> {errorId}
                  </div>
                </details>
              )}
            </div>

            <div className="error-actions">
              <StyledButton 
                onClick={this.handleRetry}
                variant="primary"
                className="retry-button"
              >
                <RefreshCw size={16} />
                Try Again
              </StyledButton>
              
              <StyledButton 
                onClick={this.handleGoHome}
                variant="secondary"
                className="home-button"
              >
                <Home size={16} />
                Go Home
              </StyledButton>
              
              {env.DEV && (
                <StyledButton 
                  onClick={this.handleReportError}
                  variant="outline"
                  className="report-button"
                >
                  <Bug size={16} />
                  Report Error
                </StyledButton>
              )}
            </div>

            <div className="error-help">
              <p>
                If this problem persists, please contact support with the error ID: 
                <code className="error-id-display">{errorId}</code>
              </p>
            </div>
          </CompositeCard>
          <ResetDemoButton />
        </div>
      );
    }

    return this.props.children;
  }
} 