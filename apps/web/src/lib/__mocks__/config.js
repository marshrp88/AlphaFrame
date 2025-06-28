/**
 * Mock configuration for Jest tests
 * Provides the same interface as the real config module
 */

export const config = {
  env: 'test',
  apiUrl: 'http://localhost:3000/api',
  plaid: {
    clientId: 'test_plaid_client_id',
    secret: 'test_plaid_secret',
    env: 'sandbox'
  },
  auth0: {
    domain: 'test.auth0.com',
    clientId: 'test_client_id',
    audience: 'https://test.api.alphaframe.dev',
    redirectUri: 'http://localhost:5173'
  },
  auth: {
    domain: 'test.auth0.com',
    clientId: 'test_client_id',
    audience: 'https://test.api.alphaframe.dev'
  },
  webhook: {
    url: 'http://localhost:3000/webhook',
    secret: 'test_webhook_secret'
  },
  notifications: {
    sendgridApiKey: 'test_sendgrid_key',
    fromEmail: 'noreply@alphaframe.com'
  },
  features: {
    betaMode: false,
    plaidIntegration: true,
    webhooks: true,
    notifications: false
  },
  logging: {
    level: 'info',
    debugMode: false
  },
  security: {
    encryptionKey: 'test_encryption_key',
    jwtSecret: 'test_jwt_secret'
  }
};

export const validateConfig = () => ({
  isValid: true,
  errors: [],
  warnings: [],
  environment: 'test'
});

export const initializeConfig = () => ({
  isValid: true,
  errors: [],
  warnings: [],
  environment: 'test'
});

export const getFeatureFlag = (featureName) => {
  return config.features[featureName] || false;
};

export const isDevelopment = () => false;
export const isProduction = () => false;
export const isStaging = () => false;

export const getSecureConfig = () => ({
  env: config.env,
  apiUrl: config.apiUrl,
  plaid: { env: config.plaid.env },
  auth0: { domain: config.auth0.domain },
  features: config.features,
  logging: config.logging
}); 