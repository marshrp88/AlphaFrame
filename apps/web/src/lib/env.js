/**
 * Environment Configuration - Jest-compatible environment abstraction
 * 
 * Purpose: Provides centralized environment variable access that works in both
 * browser (Vite) and test (Jest) environments without import.meta conflicts
 * 
 * Procedure: 
 * 1. Use only Node.js process.env for environment variables
 * 2. Provide fallback values for missing variables
 * 3. Detect environment using NODE_ENV
 * 4. Support Plaid configuration for Phase 5 integration
 * 
 * Conclusion: Eliminates import.meta.env conflicts in Jest while maintaining
 * compatibility with browser environments through process.env
 */

// Environment detection using NODE_ENV
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Get environment variables with fallbacks
function getEnvVar(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Feature flags
export const getFeatureFlag = (flagName, defaultValue = false) => {
  const value = getEnvVar(`VITE_${flagName.toUpperCase()}`, defaultValue.toString());
  return value === 'true' || value === true;
};

// API configuration
export const getApiConfig = () => ({
  baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),
});

// Plaid configuration for Phase 5 integration
export const getPlaidConfig = () => ({
  clientId: getEnvVar('VITE_PLAID_CLIENT_ID', ''),
  secret: getEnvVar('VITE_PLAID_SECRET', ''),
  env: getEnvVar('VITE_PLAID_ENV', 'sandbox'), // sandbox, development, production
  webhookUrl: getEnvVar('VITE_WEBHOOK_URL', ''),
  webhookSecret: getEnvVar('VITE_WEBHOOK_SECRET', ''),
});

// UI configuration
export const getUiConfig = () => ({
  theme: getEnvVar('VITE_DEFAULT_THEME', 'light'),
  animations: getEnvVar('VITE_ENABLE_ANIMATIONS', 'true') !== 'false',
});

// Export environment flags
export { isDevelopment, isProduction, isTest };

// Export all environment variables for backward compatibility
export const env = {
  DEV: isDevelopment,
  PROD: isProduction,
  VITE_API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  VITE_ENABLE_PRO: getEnvVar('VITE_ENABLE_PRO', 'false'),
  VITE_ENABLE_BETA: getEnvVar('VITE_ENABLE_BETA', 'false'),
  VITE_ENABLE_EXPERIMENTAL: getEnvVar('VITE_ENABLE_EXPERIMENTAL', 'false'),
  VITE_DEFAULT_THEME: getEnvVar('VITE_DEFAULT_THEME', 'light'),
  VITE_ENABLE_ANIMATIONS: getEnvVar('VITE_ENABLE_ANIMATIONS', 'true'),
  // Plaid configuration
  VITE_PLAID_CLIENT_ID: getEnvVar('VITE_PLAID_CLIENT_ID', ''),
  VITE_PLAID_SECRET: getEnvVar('VITE_PLAID_SECRET', ''),
  VITE_PLAID_ENV: getEnvVar('VITE_PLAID_ENV', 'sandbox'),
  VITE_WEBHOOK_URL: getEnvVar('VITE_WEBHOOK_URL', ''),
  VITE_WEBHOOK_SECRET: getEnvVar('VITE_WEBHOOK_SECRET', ''),
};

export default env; 