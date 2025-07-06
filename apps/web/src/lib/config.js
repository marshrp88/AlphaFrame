/**
 * Application Configuration - Phase 5 Plaid Integration Ready
 * 
 * Purpose: Provides centralized access to application settings and environment variables
 * including Plaid configuration for Phase 5 production integration.
 * 
 * Current Status: Plaid configuration added for Phase 5 integration
 */

import { isDevelopment, isProduction, getFeatureFlag, getApiConfig, getUiConfig, getPlaidConfig } from './env.js';

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
  
  // Plaid configuration for Phase 5 integration
  plaid: getPlaidConfig(),
  
  // TODO [MVEP_PHASE_1]: Replace with Firebase Auth configuration
  auth: {
    // Firebase Auth configuration will be added here
    provider: 'firebase',
    status: 'not_implemented'
  },
  
  // Feature flags
  features: {
    pro: getFeatureFlag('ENABLE_PRO', false),
    beta: getFeatureFlag('ENABLE_BETA', false),
    experimental: getFeatureFlag('ENABLE_EXPERIMENTAL', false),
    softLaunch: getFeatureFlag('ENABLE_SOFT_LAUNCH', true), // Galileo Initiative
    plaidIntegration: getFeatureFlag('ENABLE_PLAID_INTEGRATION', true), // Phase 5
  },
  
  // UI configuration
  ui: getUiConfig(),
};

// Export default for backward compatibility
export default config;
export { getFeatureFlag };
