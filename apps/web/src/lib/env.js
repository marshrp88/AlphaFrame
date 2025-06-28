/**
 * Environment Configuration Abstraction
 * 
 * Purpose: Centralize environment variable access and provide fallbacks
 * for different environments (development, test, production)
 * 
 * Procedure: 
 * - Abstracts import.meta.env usage
 * - Provides consistent API across environments
 * - Includes fallback values for testing
 * 
 * Conclusion: Enables consistent environment handling and easier mocking
 */

// Jest-safe environment abstraction
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  VITE_APP_ENV: process.env.VITE_APP_ENV,
  VITE_PLAID_CLIENT_ID: process.env.VITE_PLAID_CLIENT_ID,
  VITE_PLAID_SECRET: process.env.VITE_PLAID_SECRET,
  VITE_PLAID_ENV: process.env.VITE_PLAID_ENV,
  VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID: process.env.VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_AUDIENCE: process.env.VITE_AUTH0_AUDIENCE,
  VITE_AUTH0_REDIRECT_URI: process.env.VITE_AUTH0_REDIRECT_URI,
  VITE_API_URL: process.env.VITE_API_URL,
  VITE_APP_URL: process.env.VITE_APP_URL,
  VITE_WEBHOOK_URL: process.env.VITE_WEBHOOK_URL,
  VITE_WEBHOOK_SECRET: process.env.VITE_WEBHOOK_SECRET,
  VITE_SENDGRID_API_KEY: process.env.VITE_SENDGRID_API_KEY,
  VITE_FROM_EMAIL: process.env.VITE_FROM_EMAIL,
  VITE_BETA_MODE: process.env.VITE_BETA_MODE,
  VITE_PLAID_INTEGRATION: process.env.VITE_PLAID_INTEGRATION,
  VITE_WEBHOOKS_ENABLED: process.env.VITE_WEBHOOKS_ENABLED,
  VITE_NOTIFICATIONS_ENABLED: process.env.VITE_NOTIFICATIONS_ENABLED,
  VITE_LOG_LEVEL: process.env.VITE_LOG_LEVEL,
  VITE_DEBUG_MODE: process.env.VITE_DEBUG_MODE,
  VITE_ENCRYPTION_KEY: process.env.VITE_ENCRYPTION_KEY,
  VITE_JWT_SECRET: process.env.VITE_JWT_SECRET,
  VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN,
  VITE_ANALYTICS_ID: process.env.VITE_ANALYTICS_ID,
  VITE_CUSTOM_ENV_VAR: process.env.VITE_CUSTOM_ENV_VAR,
};

// Convenience functions
export const isDevelopmentMode = () => env.NODE_ENV === 'development';
export const isProductionMode = () => env.NODE_ENV === 'production';
export const isTestMode = () => env.NODE_ENV === 'test';

// Feature flag helpers
export const isFeatureEnabled = (featureName) => {
  const featureMap = {
    'beta-mode': env.VITE_BETA_MODE,
    'plaid-integration': env.VITE_PLAID_INTEGRATION,
    'webhooks': env.VITE_WEBHOOKS_ENABLED,
    'notifications': env.VITE_NOTIFICATIONS_ENABLED
  };
  return featureMap[featureName] || false;
};

// Configuration validation
export const validateConfig = () => {
  const errors = [];
  const warnings = [];
  
  if (!env.VITE_PLAID_CLIENT_ID) {
    errors.push('VITE_PLAID_CLIENT_ID is required');
  }
  
  if (!env.VITE_AUTH0_DOMAIN) {
    errors.push('VITE_AUTH0_DOMAIN is required');
  }
  
  if (isDevelopmentMode() && !env.VITE_API_URL?.includes('localhost')) {
    warnings.push('VITE_API_URL should point to localhost in development');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Export default for backward compatibility
export default env; 