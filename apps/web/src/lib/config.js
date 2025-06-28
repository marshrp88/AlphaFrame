/**
 * AlphaFrame VX.1 Configuration Module
 * 
 * Purpose: Centralized environment-specific configuration management
 * with secure secret handling and feature flag support.
 * 
 * Procedure:
 * 1. Load environment-specific variables
 * 2. Validate required configuration
 * 3. Provide secure access to API keys and secrets
 * 4. Support feature flags for beta testing
 * 
 * Conclusion: Provides secure, environment-aware configuration
 * while maintaining zero-knowledge compliance.
 */

import env from './env.js';

/**
 * Environment configuration object
 */
export const config = {
  // Environment
  env: env.VITE_APP_ENV || 'development',
  
  // API Configuration
  apiUrl: env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Plaid Configuration
  plaid: {
    clientId: env.VITE_PLAID_CLIENT_ID || null,
    secret: env.VITE_PLAID_SECRET || null,
    env: env.VITE_PLAID_ENV || 'sandbox'
  },
  
  // Auth0 Configuration (Primary Authentication)
  auth0: {
    domain: env.VITE_AUTH0_DOMAIN || null,
    clientId: env.VITE_AUTH0_CLIENT_ID || null,
    audience: env.VITE_AUTH0_AUDIENCE || null,
    redirectUri: env.VITE_AUTH0_REDIRECT_URI || 'http://localhost:5173'
  },
  
  // Legacy Authentication Configuration (Fallback)
  auth: {
    domain: env.VITE_AUTH_DOMAIN || null,
    clientId: env.VITE_AUTH_CLIENT_ID || null,
    audience: env.VITE_AUTH_AUDIENCE || null
  },
  
  // Webhook Configuration
  webhook: {
    url: env.VITE_WEBHOOK_URL || null,
    secret: env.VITE_WEBHOOK_SECRET || null
  },
  
  // Notification Configuration
  notifications: {
    sendgridApiKey: env.VITE_SENDGRID_API_KEY || null,
    fromEmail: env.VITE_NOTIFICATION_FROM_EMAIL || 'noreply@alphaframe.com'
  },
  
  // Feature Flags
  features: {
    betaMode: env.VITE_ENABLE_BETA_MODE === 'true',
    plaidIntegration: env.VITE_ENABLE_PLAID_INTEGRATION === 'true',
    webhooks: env.VITE_ENABLE_WEBHOOKS === 'true',
    notifications: env.VITE_ENABLE_NOTIFICATIONS === 'true'
  },
  
  // Logging Configuration
  logging: {
    level: env.VITE_LOG_LEVEL || 'info',
    debugMode: env.VITE_ENABLE_DEBUG_MODE === 'true'
  },
  
  // Security Configuration
  security: {
    encryptionKey: env.VITE_ENCRYPTION_KEY || null,
    jwtSecret: env.VITE_JWT_SECRET || null
  }
};

/**
 * Validate required configuration for current environment
 * @returns {Object} Validation result
 */
export const validateConfig = () => {
  const errors = [];
  const warnings = [];
  
  // Required for all environments
  if (!config.plaid.clientId) {
    errors.push('VITE_PLAID_CLIENT_ID is required');
  }
  
  if (!config.plaid.secret) {
    errors.push('VITE_PLAID_SECRET is required');
  }
  
  // Auth0 validation (primary authentication)
  if (!config.auth0.domain) {
    errors.push('VITE_AUTH0_DOMAIN is required');
  }
  
  if (!config.auth0.clientId) {
    errors.push('VITE_AUTH0_CLIENT_ID is required');
  }
  
  if (!config.auth0.audience) {
    errors.push('VITE_AUTH0_AUDIENCE is required');
  }
  
  // Required for production
  if (config.env === 'production') {
    if (!config.webhook.secret) {
      errors.push('VITE_WEBHOOK_SECRET is required for production');
    }
    
    if (!config.notifications.sendgridApiKey) {
      errors.push('VITE_SENDGRID_API_KEY is required for production');
    }
  }
  
  // Warnings for development
  if (config.env === 'development') {
    if (!config.webhook.secret) {
      warnings.push('VITE_WEBHOOK_SECRET not set - webhooks will be mocked');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    environment: config.env
  };
};

/**
 * Initialize configuration safely - call this instead of validating at module load
 * @returns {Object} Initialization result
 */
export const initializeConfig = () => {
  const validation = validateConfig();
  
  if (!validation.isValid) {
    // In production, we should fail fast
    if (isProduction()) {
      throw new Error('Invalid configuration for production environment');
    }
    
    // In development, log warnings but continue
    // console.warn('Continuing with missing configuration - features may be disabled'); // Commented for production cleanliness
  }
  
  if (validation.warnings.length > 0) {
    // console.warn('Configuration warnings:', validation.warnings); // Commented for production cleanliness
  }
  
  return validation;
};

/**
 * Get feature flag value
 * @param {string} featureName - Name of the feature flag
 * @returns {boolean} Feature flag value
 */
export const getFeatureFlag = (featureName) => {
  return config.features[featureName] || false;
};

/**
 * Check if running in development mode
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
  return config.env === 'development';
};

/**
 * Check if running in production mode
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  return config.env === 'production';
};

/**
 * Check if running in staging mode
 * @returns {boolean} True if in staging
 */
export const isStaging = () => {
  return config.env === 'staging';
};

/**
 * Get secure configuration (without sensitive data)
 * @returns {Object} Safe configuration object
 */
export const getSecureConfig = () => {
  return {
    env: config.env,
    apiUrl: config.apiUrl,
    plaid: {
      env: config.plaid.env,
      clientId: config.plaid.clientId ? '***' + config.plaid.clientId.slice(-4) : 'missing'
    },
    auth: {
      domain: config.auth.domain ? '***' + config.auth.domain.slice(-10) : 'missing'
    },
    features: config.features,
    logging: config.logging
  };
};

// Comment out all console statements
// console.log('Loading configuration...');
// console.log('🔧 Configuration module loaded');
// console.log('🔧 Environment:', config.env);
// console.log('🔧 Plaid integration:', config.plaid.clientId ? 'enabled' : 'disabled');
// console.log('🔧 Auth integration:', config.auth.domain ? 'enabled' : 'disabled'); 
