// Test that all imports work correctly
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock config.js to avoid import.meta.env issues
vi.mock('@/lib/config.js', () => ({
  config: {
    env: 'test',
    apiUrl: 'http://localhost:3000/api',
    plaid: {
      clientId: 'test-plaid-client-id',
      secret: 'test-plaid-secret',
      env: 'sandbox'
    },
    auth0: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience',
      redirectUri: 'http://localhost:5173'
    },
    auth: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience'
    },
    webhook: {
      url: 'http://localhost:3000/webhook',
      secret: 'test-webhook-secret'
    },
    notifications: {
      sendgridApiKey: 'test-sendgrid-key',
      fromEmail: 'noreply@alphaframe.com'
    },
    features: {
      betaMode: false,
      plaidIntegration: true,
      webhooks: true,
      notifications: true
    },
    logging: {
      level: 'info',
      debugMode: false
    },
    security: {
      encryptionKey: 'test-encryption-key',
      jwtSecret: 'test-jwt-secret'
    }
  },
  validateConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  initializeConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  getFeatureFlag: vi.fn(() => false),
  isDevelopment: vi.fn(() => true),
  isProduction: vi.fn(() => false),
  isStaging: vi.fn(() => false),
  getSecureConfig: vi.fn(() => ({ env: 'test' }))
}));

// Mock components that use import.meta.env
vi.mock('@/components/ui/PerformanceMonitor', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="private-route">{children}</div>,
}));

describe('App Import Tests', () => {
  it('should import App component without errors', async () => {
    // Test that App can be imported without throwing
    const App = await import('../src/App');
    expect(App).toBeDefined();
    expect(App.default).toBeDefined();
  }, 10000); // Increase timeout to 10 seconds

  it('should import main App component', () => {
    // Simple import test
    expect(() => {
      require('../src/App');
    }).not.toThrow();
  });
}); 
