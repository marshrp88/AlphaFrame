/**
 * ErrorHandlingService.js - AlphaFrame Customer-Ready Error Handling
 * 
 * Purpose: Comprehensive error handling system that provides graceful degradation,
 * user-friendly error messages, and robust recovery mechanisms.
 * 
 * Procedure:
 * 1. Global error boundary management
 * 2. Service-level error handling with retry logic
 * 3. User-friendly error messages and recovery options
 * 4. Error logging and analytics
 * 5. Graceful degradation for all error conditions
 * 
 * Conclusion: Ensures AlphaFrame never breaks or confuses users,
 * providing a resilient and trustworthy experience.
 */

import executionLogService from '../../core/services/ExecutionLogService.js';

// Patch: Ensure executionLogService.log is always a function (no-op fallback)
if (!executionLogService || typeof executionLogService.log !== 'function') {
  executionLogService.log = () => {};
}

/**
 * Error types and their user-friendly messages
 */
const ERROR_TYPES = {
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    userMessage: 'Connection issue detected. Please check your internet connection and try again.',
    recoveryAction: 'retry',
    severity: 'medium'
  },
  AUTHENTICATION_ERROR: {
    code: 'AUTHENTICATION_ERROR',
    userMessage: 'Your session has expired. Please log in again to continue.',
    recoveryAction: 'redirect',
    redirectTo: '/login',
    severity: 'high'
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    userMessage: 'Please check your input and try again.',
    recoveryAction: 'fix_input',
    severity: 'low'
  },
  PERMISSION_ERROR: {
    code: 'PERMISSION_ERROR',
    userMessage: 'You don\'t have permission to perform this action.',
    recoveryAction: 'none',
    severity: 'medium'
  },
  RATE_LIMIT_ERROR: {
    code: 'RATE_LIMIT_ERROR',
    userMessage: 'Too many requests. Please wait a moment and try again.',
    recoveryAction: 'wait',
    waitTime: 5000,
    severity: 'low'
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    userMessage: 'This service is temporarily unavailable. Please try again later.',
    recoveryAction: 'retry',
    severity: 'medium'
  },
  DATA_ERROR: {
    code: 'DATA_ERROR',
    userMessage: 'There was an issue with your data. Please refresh the page.',
    recoveryAction: 'refresh',
    severity: 'medium'
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    userMessage: 'Something unexpected happened. Please try again or contact support.',
    recoveryAction: 'retry',
    severity: 'high'
  }
};

/**
 * Retry configuration for different error types
 */
const RETRY_CONFIG = {
  NETWORK_ERROR: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  },
  SERVICE_UNAVAILABLE: {
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 15000,
    backoffMultiplier: 2
  },
  RATE_LIMIT_ERROR: {
    maxRetries: 1,
    baseDelay: 5000,
    maxDelay: 10000,
    backoffMultiplier: 1
  }
};

/**
 * Error handling service class
 */
class ErrorHandlingService {
  constructor() {
    this.errorCount = 0;
    this.lastErrorTime = 0;
    this.errorHistory = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the error handling service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Set up global error handlers
      this.setupGlobalErrorHandlers();
      
      // Set up unhandled promise rejection handler
      this.setupPromiseRejectionHandler();
      
      // Set up network error monitoring
      this.setupNetworkErrorMonitoring();
      
      this.isInitialized = true;
      
      await executionLogService.log('error_handling.initialized', {
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Failed to initialize error handling service:', error);
    }
  }

  /**
   * Set up global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  /**
   * Set up promise rejection handler
   */
  setupPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault();
      this.handleError(event.reason, {
        type: 'promise_rejection',
        handled: true
      });
    });
  }

  /**
   * Set up network error monitoring
   */
  setupNetworkErrorMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          this.handleError(error, {
            type: 'fetch_error',
            url: args[0],
            status: response.status
          });
        }
        
        return response;
      } catch (error) {
        this.handleError(error, {
          type: 'fetch_error',
          url: args[0]
        });
        throw error;
      }
    };
  }

  /**
   * Handle an error with appropriate recovery actions
   */
  async handleError(error, context = {}) {
    try {
      // Increment error count
      this.errorCount++;
      this.lastErrorTime = Date.now();
      
      // Determine error type
      const errorType = this.categorizeError(error, context);
      const errorConfig = ERROR_TYPES[errorType] || ERROR_TYPES.UNKNOWN_ERROR;
      
      // Log error for debugging
      await this.logError(error, errorConfig, context);
      
      // Add to error history
      this.addToErrorHistory(error, errorConfig, context);
      
      // Check if we should show user-facing error
      if (this.shouldShowUserError(errorConfig)) {
        await this.showUserError(errorConfig, context);
      }
      
      // Execute recovery action
      await this.executeRecoveryAction(errorConfig, context);
      
    } catch (handlingError) {
      console.error('Error in error handler:', handlingError);
    }
  }

  /**
   * Categorize error based on type and context
   */
  categorizeError(error, context) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return 'NETWORK_ERROR';
    }
    
    // Authentication errors
    if (error.status === 401 || error.message.includes('unauthorized')) {
      return 'AUTHENTICATION_ERROR';
    }
    
    // Permission errors
    if (error.status === 403 || error.message.includes('forbidden')) {
      return 'PERMISSION_ERROR';
    }
    
    // Rate limit errors
    if (error.status === 429 || error.message.includes('rate limit')) {
      return 'RATE_LIMIT_ERROR';
    }
    
    // Service unavailable
    if (error.status === 503 || error.message.includes('service unavailable')) {
      return 'SERVICE_UNAVAILABLE';
    }
    
    // Validation errors
    if (error.status === 400 || error.message.includes('validation')) {
      return 'VALIDATION_ERROR';
    }
    
    // Data errors
    if (error.message.includes('data') || error.message.includes('parsing')) {
      return 'DATA_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Log error for debugging and analytics
   */
  async logError(error, errorConfig, context) {
    const errorLog = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      config: errorConfig,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      errorCount: this.errorCount,
      timeSinceLastError: this.lastErrorTime - (this.errorHistory[this.errorHistory.length - 1]?.timestamp || 0)
    };
    
    await executionLogService.logError('error.handled', error, errorLog);
  }

  /**
   * Add error to history for pattern detection
   */
  addToErrorHistory(error, errorConfig, context) {
    const errorEntry = {
      error: error.message,
      type: errorConfig.code,
      severity: errorConfig.severity,
      timestamp: Date.now(),
      context
    };
    
    this.errorHistory.push(errorEntry);
    
    // Keep only last 100 errors
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-100);
    }
  }

  /**
   * Determine if we should show user-facing error
   */
  shouldShowUserError(errorConfig) {
    // Don't show low severity errors to users
    if (errorConfig.severity === 'low') {
      return false;
    }
    
    // Don't show too many errors in a short time
    const recentErrors = this.errorHistory.filter(
      error => Date.now() - error.timestamp < 60000
    );
    
    if (recentErrors.length > 5) {
      return false;
    }
    
    return true;
  }

  /**
   * Show user-friendly error message
   */
  async showUserError(errorConfig, context) {
    // Create toast notification
    const toast = {
      title: 'Something went wrong',
      description: errorConfig.userMessage,
      variant: 'destructive',
      action: errorConfig.recoveryAction === 'retry' ? {
        label: 'Try Again',
        onClick: () => this.executeRecoveryAction(errorConfig, context)
      } : undefined
    };
    
    // Dispatch custom event for toast system
    window.dispatchEvent(new CustomEvent('show-toast', { detail: toast }));
  }

  /**
   * Execute recovery action based on error type
   */
  async executeRecoveryAction(errorConfig, context) {
    switch (errorConfig.recoveryAction) {
      case 'retry':
        return this.retryOperation(context);
        
      case 'redirect':
        return this.redirectToPage(errorConfig.redirectTo);
        
      case 'refresh':
        return this.refreshPage();
        
      case 'wait':
        return this.waitAndRetry(errorConfig.waitTime, context);
        
      case 'fix_input':
        return this.highlightInputErrors(context);
        
      case 'none':
      default:
        return;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  async retryOperation(context, attempt = 1) {
    const retryConfig = RETRY_CONFIG[context.errorType] || RETRY_CONFIG.NETWORK_ERROR;
    
    if (attempt > retryConfig.maxRetries) {
      throw new Error('Max retries exceeded');
    }
    
    const delay = Math.min(
      retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
      retryConfig.maxDelay
    );
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Re-execute the original operation
    if (context.retryFunction) {
      return context.retryFunction();
    }
  }

  /**
   * Redirect to specified page
   */
  redirectToPage(path) {
    window.location.href = path;
  }

  /**
   * Refresh the current page
   */
  refreshPage() {
    window.location.reload();
  }

  /**
   * Wait and retry operation
   */
  async waitAndRetry(waitTime, context) {
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.retryOperation(context);
  }

  /**
   * Highlight input errors in forms
   */
  highlightInputErrors(context) {
    if (context.fieldName) {
      const field = document.querySelector(`[name="${context.fieldName}"]`);
      if (field) {
        field.classList.add('error');
        field.focus();
      }
    }
  }

  /**
   * Wrap async operations with error handling
   */
  async withErrorHandling(operation, context = {}) {
    try {
      return await operation();
    } catch (error) {
      await this.handleError(error, {
        ...context,
        retryFunction: () => this.withErrorHandling(operation, context)
      });
      throw error;
    }
  }

  /**
   * Create a retry wrapper for operations
   */
  createRetryWrapper(operation, retryConfig = RETRY_CONFIG.NETWORK_ERROR) {
    return async (...args) => {
      let lastError;
      
      for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
        try {
          return await operation(...args);
        } catch (error) {
          lastError = error;
          
          if (attempt < retryConfig.maxRetries) {
            const delay = Math.min(
              retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
              retryConfig.maxDelay
            );
            
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError;
    };
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    const recentErrors = this.errorHistory.filter(error => error.timestamp > oneHourAgo);
    const dailyErrors = this.errorHistory.filter(error => error.timestamp > oneDayAgo);
    
    return {
      totalErrors: this.errorCount,
      recentErrors: recentErrors.length,
      dailyErrors: dailyErrors.length,
      errorHistory: this.errorHistory.slice(-10) // Last 10 errors
    };
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    this.errorHistory = [];
    this.errorCount = 0;
  }
}

// Create singleton instance
const errorHandlingService = new ErrorHandlingService();

// Initialize on module load
errorHandlingService.initialize();

export default errorHandlingService; 