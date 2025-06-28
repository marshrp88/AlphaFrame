import '@testing-library/jest-dom';

// Jest setup file for AlphaFrame tests
// This file runs before each test and provides essential mocks

// Mock import.meta.env for files that use it directly
global.import = {
  meta: {
    env: {
      VITE_APP_ENV: 'test',
      VITE_API_URL: 'http://localhost:3000/api',
      VITE_PLAID_CLIENT_ID: 'test-plaid-client-id',
      VITE_PLAID_SECRET: 'test-plaid-secret',
      VITE_PLAID_ENV: 'sandbox',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test-auth0-client-id',
      VITE_AUTH0_AUDIENCE: 'test-audience',
      VITE_AUTH0_REDIRECT_URI: 'http://localhost:5173',
      VITE_AUTH_DOMAIN: 'test.auth0.com',
      VITE_AUTH_CLIENT_ID: 'test-auth0-client-id',
      VITE_AUTH_AUDIENCE: 'test-audience',
      VITE_WEBHOOK_URL: 'http://localhost:3000/webhook',
      VITE_WEBHOOK_SECRET: 'test-webhook-secret',
      VITE_SENDGRID_API_KEY: 'test-sendgrid-key',
      VITE_NOTIFICATION_FROM_EMAIL: 'noreply@alphaframe.com',
      VITE_ENABLE_BETA_MODE: 'false',
      VITE_ENABLE_PLAID_INTEGRATION: 'true',
      VITE_ENABLE_WEBHOOKS: 'true',
      VITE_ENABLE_NOTIFICATIONS: 'true',
      VITE_LOG_LEVEL: 'info',
      VITE_ENABLE_DEBUG_MODE: 'false',
      VITE_ENCRYPTION_KEY: 'test-encryption-key',
      VITE_JWT_SECRET: 'test-jwt-secret',
      DEV: false,
      PROD: false,
      MODE: 'test'
    }
  }
};

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for components that use it
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress specific console methods during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Polyfill for TextEncoder/TextDecoder in Node
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
} 