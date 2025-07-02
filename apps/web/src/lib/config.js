/**
 * Application Configuration - STUBBED FOR MVEP PHASE 0
 * 
 * TODO [MVEP_PHASE_1]:
 * This module is currently stubbed and non-functional.
 * Real configuration will be implemented in Phase 1 of the MVEP rebuild plan.
 * 
 * Purpose: Will provide centralized access to application settings and environment variables
 * 
 * Current Status: Auth0 removed, preparing for Firebase Auth
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
  },
  
  // UI configuration
  ui: getUiConfig(),
};

// Export default for backward compatibility
export default config;
