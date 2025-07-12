/**
 * Error Handling Service - Centralized Error Management for AlphaFrame
 * 
 * Purpose: Provide comprehensive error handling, monitoring, and recovery
 * across the entire application with Sentry integration for production debugging.
 * 
 * Features:
 * - Sentry error tracking and monitoring
 * - User-friendly error messages
 * - Error categorization and severity levels
 * - Automatic error recovery strategies
 * - Performance monitoring integration
 * 
 * Conclusion: Centralized error handling ensures consistent user experience
 * and provides valuable debugging information for production issues.
 */

import * as Sentry from '@sentry/react';

// Error categories for better organization and handling
export const ERROR_CATEGORIES = {
  AUTH: 'authentication',
  ONBOARDING: 'onboarding',
  PL AID: 'plaid',
  NETWORK: 'network',
  VALIDATION: 'validation',
  STORAGE: 'storage',
  PERFORMANCE: 'performance',
  UNKNOWN: 'unknown',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// User-friendly error messages
const USER_ERROR_MESSAGES = {
  [ERROR_CATEGORIES.AUTH]: {
    login_failed: 'Unable to sign in. Please check your credentials and try again.',
    registration_failed: 'Unable to create account. Please try again or contact support.',
    session_expired: 'Your session has expired. Please sign in again.',
    permission_denied: 'You don\'t have permission to access this feature.',
  },
  [ERROR_CATEGORIES.ONBOARDING]: {
    step_failed: 'Unable to complete this step. Please try again.',
    data_validation: 'Please check your information and try again.',
    timeout: 'This step is taking longer than expected. Please try again.',
    incomplete: 'Please complete all required fields before continuing.',
  },
  [ERROR_CATEGORIES.PLAID]: {
    connection_failed: 'Unable to connect to your bank. Please try again.',
    institution_error: 'Your bank is temporarily unavailable. Please try again later.',
    account_error: 'Unable to access your accounts. Please verify your credentials.',
    sync_failed: 'Unable to sync your transactions. Please try again.',
  },
  [ERROR_CATEGORIES.NETWORK]: {
    connection_lost: 'Connection lost. Please check your internet and try again.',
    timeout: 'Request timed out. Please try again.',
    server_error: 'Server is temporarily unavailable. Please try again later.',
    offline: 'You appear to be offline. Please check your connection.',
  },
  [ERROR_CATEGORIES.VALIDATION]: {
    invalid_input: 'Please check your input and try again.',
    required_field: 'This field is required.',
    format_error: 'Please use the correct format.',
    length_error: 'Input is too long or too short.',
  },
  [ERROR_CATEGORIES.STORAGE]: {
    save_failed: 'Unable to save your data. Please try again.',
    load_failed: 'Unable to load your data. Please refresh the page.',
    quota_exceeded: 'Storage limit reached. Please clear some data.',
    corrupted: 'Data appears to be corrupted. Please refresh the page.',
  },
  [ERROR_CATEGORIES.PERFORMANCE]: {
    slow_loading: 'Loading is taking longer than expected.',
    memory_error: 'Application is running slowly. Please refresh the page.',
    render_error: 'Unable to display this content. Please try again.',
  },
  [ERROR_CATEGORIES.UNKNOWN]: {
    default: 'Something went wrong. Please try again or contact support.',
  },
};

class ErrorHandlingService {
  constructor() {
    this.isInitialized = false;
    this.errorCount = 0;
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  /**
   * Initialize the error handling service
   * @param {Object} config - Configuration options
   */
  initialize(config = {}) {
    if (this.isInitialized) {
      console.warn('ErrorHandlingService already initialized');
      return;
    }

    try {
      // Initialize Sentry if DSN is provided
      if (config.sentryDsn) {
        Sentry.init({
          dsn: config.sentryDsn,
          environment: config.environment || 'development',
          release: config.release || '1.0.0',
          tracesSampleRate: config.tracesSampleRate || 0.1,
          integrations: [
            new Sentry.BrowserTracing(),
          ],
          beforeSend: (event) => {
            // Filter out certain errors or add context
            return this.beforeSend(event);
          },
        });
        console.log('🔧 ErrorHandlingService: Sentry initialized');
      }

      // Set up global error handlers
      this.setupGlobalHandlers();
      
      this.isInitialized = true;
      console.log('🔧 ErrorHandlingService: Initialized successfully');
    } catch (error) {
      console.error('❌ ErrorHandlingService: Initialization failed:', error);
    }
  }

  /**
   * Handle an error with categorization and user-friendly messaging
   * @param {Error} error - The error object
   * @param {Object} context - Additional context
   */
  handleError(error, context = {}) {
    this.errorCount++;
    
    const errorInfo = this.categorizeError(error, context);
    const userMessage = this.getUserMessage(errorInfo);
    
    // Log error for debugging
    console.error('❌ ErrorHandlingService:', {
      error: error.message,
      category: errorInfo.category,
      severity: errorInfo.severity,
      context: errorInfo.context,
      userMessage,
    });

    // Send to Sentry if initialized
    if (this.isInitialized && Sentry) {
      Sentry.captureException(error, {
        tags: {
          category: errorInfo.category,
          severity: errorInfo.severity,
          component: context.component || 'unknown',
        },
        extra: {
          context: errorInfo.context,
          userMessage,
          errorCount: this.errorCount,
        },
      });
    }

    // Execute recovery strategy if available
    this.executeRecoveryStrategy(errorInfo);

    return {
      error: errorInfo,
      userMessage,
      shouldRetry: this.shouldRetry(errorInfo),
      recoveryAction: this.getRecoveryAction(errorInfo),
    };
  }

  /**
   * Categorize an error based on its type and context
   * @param {Error} error - The error object
   * @param {Object} context - Additional context
   */
  categorizeError(error, context = {}) {
    const message = error.message.toLowerCase();
    const stack = error.stack || '';
    
    // Determine category based on error message and context
    let category = ERROR_CATEGORIES.UNKNOWN;
    let severity = ERROR_SEVERITY.MEDIUM;
    let errorCode = 'default';

    // Auth errors
    if (message.includes('auth') || message.includes('login') || message.includes('password')) {
      category = ERROR_CATEGORIES.AUTH;
      if (message.includes('expired') || message.includes('invalid')) {
        errorCode = 'session_expired';
        severity = ERROR_SEVERITY.MEDIUM;
      } else {
        errorCode = 'login_failed';
        severity = ERROR_SEVERITY.HIGH;
      }
    }
    
    // Onboarding errors
    else if (message.includes('onboarding') || message.includes('step') || context.component === 'onboarding') {
      category = ERROR_CATEGORIES.ONBOARDING;
      if (message.includes('timeout')) {
        errorCode = 'timeout';
        severity = ERROR_SEVERITY.MEDIUM;
      } else if (message.includes('validation')) {
        errorCode = 'data_validation';
        severity = ERROR_SEVERITY.LOW;
      } else {
        errorCode = 'step_failed';
        severity = ERROR_SEVERITY.HIGH;
      }
    }
    
    // Plaid errors
    else if (message.includes('plaid') || message.includes('bank') || message.includes('institution')) {
      category = ERROR_CATEGORIES.PLAID;
      if (message.includes('connection')) {
        errorCode = 'connection_failed';
        severity = ERROR_SEVERITY.HIGH;
      } else if (message.includes('institution')) {
        errorCode = 'institution_error';
        severity = ERROR_SEVERITY.MEDIUM;
      } else {
        errorCode = 'account_error';
        severity = ERROR_SEVERITY.HIGH;
      }
    }
    
    // Network errors
    else if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      category = ERROR_CATEGORIES.NETWORK;
      if (message.includes('timeout')) {
        errorCode = 'timeout';
        severity = ERROR_SEVERITY.MEDIUM;
      } else if (message.includes('offline')) {
        errorCode = 'offline';
        severity = ERROR_SEVERITY.HIGH;
      } else {
        errorCode = 'connection_lost';
        severity = ERROR_SEVERITY.HIGH;
      }
    }
    
    // Validation errors
    else if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      category = ERROR_CATEGORIES.VALIDATION;
      if (message.includes('required')) {
        errorCode = 'required_field';
        severity = ERROR_SEVERITY.LOW;
      } else if (message.includes('format')) {
        errorCode = 'format_error';
        severity = ERROR_SEVERITY.LOW;
      } else {
        errorCode = 'invalid_input';
        severity = ERROR_SEVERITY.LOW;
      }
    }
    
    // Storage errors
    else if (message.includes('storage') || message.includes('localstorage') || message.includes('save')) {
      category = ERROR_CATEGORIES.STORAGE;
      if (message.includes('quota')) {
        errorCode = 'quota_exceeded';
        severity = ERROR_SEVERITY.HIGH;
      } else if (message.includes('corrupt')) {
        errorCode = 'corrupted';
        severity = ERROR_SEVERITY.HIGH;
      } else {
        errorCode = 'save_failed';
        severity = ERROR_SEVERITY.MEDIUM;
      }
    }
    
    // Performance errors
    else if (message.includes('performance') || message.includes('memory') || message.includes('slow')) {
      category = ERROR_CATEGORIES.PERFORMANCE;
      if (message.includes('memory')) {
        errorCode = 'memory_error';
        severity = ERROR_SEVERITY.HIGH;
      } else if (message.includes('render')) {
        errorCode = 'render_error';
        severity = ERROR_SEVERITY.MEDIUM;
      } else {
        errorCode = 'slow_loading';
        severity = ERROR_SEVERITY.MEDIUM;
      }
    }

    // Critical errors (always high severity)
    if (message.includes('critical') || message.includes('fatal')) {
      severity = ERROR_SEVERITY.CRITICAL;
    }

    return {
      category,
      severity,
      errorCode,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    };
  }

  /**
   * Get user-friendly error message
   * @param {Object} errorInfo - Categorized error information
   */
  getUserMessage(errorInfo) {
    const { category, errorCode } = errorInfo;
    const categoryMessages = USER_ERROR_MESSAGES[category];
    
    if (categoryMessages && categoryMessages[errorCode]) {
      return categoryMessages[errorCode];
    }
    
    return categoryMessages?.default || USER_ERROR_MESSAGES[ERROR_CATEGORIES.UNKNOWN].default;
  }

  /**
   * Set up global error handlers
   */
  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        component: 'global',
      });
      event.preventDefault();
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: 'global_error',
        component: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
  }

  /**
   * Set up recovery strategies for different error types
   */
  setupRecoveryStrategies() {
    // Auth recovery strategies
    this.recoveryStrategies.set(ERROR_CATEGORIES.AUTH, {
      session_expired: () => {
        // Redirect to login
        window.location.href = '/login';
      },
      login_failed: () => {
        // Clear form and show retry message
        return { action: 'retry', delay: 2000 };
      },
    });

    // Network recovery strategies
    this.recoveryStrategies.set(ERROR_CATEGORIES.NETWORK, {
      connection_lost: () => {
        // Retry with exponential backoff
        return { action: 'retry', delay: 1000, maxRetries: 3 };
      },
      timeout: () => {
        // Retry with longer timeout
        return { action: 'retry', delay: 3000 };
      },
    });

    // Storage recovery strategies
    this.recoveryStrategies.set(ERROR_CATEGORIES.STORAGE, {
      quota_exceeded: () => {
        // Clear old data and retry
        return { action: 'clear_storage', then: 'retry' };
      },
      corrupted: () => {
        // Clear all data and restart
        return { action: 'clear_all', then: 'restart' };
      },
    });
  }

  /**
   * Execute recovery strategy for an error
   * @param {Object} errorInfo - Categorized error information
   */
  executeRecoveryStrategy(errorInfo) {
    const { category, errorCode } = errorInfo;
    const strategies = this.recoveryStrategies.get(category);
    
    if (strategies && strategies[errorCode]) {
      try {
        const result = strategies[errorCode]();
        console.log('🔧 ErrorHandlingService: Executed recovery strategy:', result);
        return result;
      } catch (error) {
        console.error('❌ ErrorHandlingService: Recovery strategy failed:', error);
      }
    }
    
    return null;
  }

  /**
   * Determine if an error should be retried
   * @param {Object} errorInfo - Categorized error information
   */
  shouldRetry(errorInfo) {
    const { category, severity } = errorInfo;
    
    // Don't retry critical errors
    if (severity === ERROR_SEVERITY.CRITICAL) {
      return false;
    }
    
    // Don't retry validation errors
    if (category === ERROR_CATEGORIES.VALIDATION) {
      return false;
    }
    
    // Retry network and storage errors
    return [ERROR_CATEGORIES.NETWORK, ERROR_CATEGORIES.STORAGE].includes(category);
  }

  /**
   * Get recovery action for an error
   * @param {Object} errorInfo - Categorized error information
   */
  getRecoveryAction(errorInfo) {
    const { category, severity } = errorInfo;
    
    if (severity === ERROR_SEVERITY.CRITICAL) {
      return 'contact_support';
    }
    
    if (category === ERROR_CATEGORIES.AUTH) {
      return 'redirect_to_login';
    }
    
    if (category === ERROR_CATEGORIES.VALIDATION) {
      return 'show_validation_errors';
    }
    
    return 'show_error_message';
  }

  /**
   * Before send callback for Sentry
   * @param {Object} event - Sentry event
   */
  beforeSend(event) {
    // Filter out certain errors
    if (event.exception) {
      const exception = event.exception.values[0];
      const message = exception.value.toLowerCase();
      
      // Don't send validation errors to Sentry
      if (message.includes('validation') || message.includes('required')) {
        return null;
      }
    }
    
    return event;
  }

  /**
   * Set user context for Sentry
   * @param {Object} user - User information
   */
  setUserContext(user) {
    if (this.isInitialized && Sentry) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    }
  }

  /**
   * Add breadcrumb for debugging
   * @param {string} message - Breadcrumb message
   * @param {Object} data - Additional data
   */
  addBreadcrumb(message, data = {}) {
    if (this.isInitialized && Sentry) {
      Sentry.addBreadcrumb({
        message,
        data,
        level: 'info',
      });
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.errorCount,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Clear error count (useful for testing)
   */
  clearErrorCount() {
    this.errorCount = 0;
  }
}

// Create singleton instance
const errorHandlingService = new ErrorHandlingService();

export default errorHandlingService; 