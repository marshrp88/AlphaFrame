/**
 * Application Configuration - Centralized configuration management
 * 
 * Purpose: Provides centralized access to application settings and environment variables
 * Procedure: Exports configuration objects with environment-specific values
 * Conclusion: Ensures consistent configuration access throughout the application
 */

import { isDevelopment, isProduction, getFeatureFlag, getApiConfig, getUiConfig } from './env.js';

// Base configuration
export const config = {
  // App settings
  appName: 'AlphaFrame',
  version: '1.0.0',
  
  // Environment flags
  isDevelopment,
  isProduction,
  
  // API configuration
  api: getApiConfig(),
  
  // Auth0 configuration
  auth0: {
    domain: process.env.AUTH0_DOMAIN || 'alpha.auth0.com',
    clientId: process.env.AUTH0_CLIENT_ID || 'alpha-default-client',
    audience: process.env.AUTH0_AUDIENCE || 'https://api.alphaframe.com',
    redirectUri: process.env.AUTH0_REDIRECT_URI || 'http://localhost:3000/callback',
  },
  
  // Feature flags
  features: {
    pro: getFeatureFlag('ENABLE_PRO', false),
    beta: getFeatureFlag('ENABLE_BETA', false),
    experimental: getFeatureFlag('ENABLE_EXPERIMENTAL', false),
  },
  
  // UI configuration
  ui: getUiConfig(),
};

export default config;
