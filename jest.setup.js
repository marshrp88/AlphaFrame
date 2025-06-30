// Jest global setup for Vite env compatibility
// This mocks import.meta.env for all tests

import '@testing-library/jest-dom';

Object.defineProperty(globalThis, 'import', {
  value: {},
  writable: true,
});

Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_APP_ENV: 'test',
      VITE_PLAID_CLIENT_ID: 'test-client-id',
      VITE_PLAID_SECRET: 'test-secret',
      VITE_SOME_OTHER_KEY: 'test-value',
      DEV: false,
      PROD: true,
      // Add more keys as needed for your tests
    },
  },
  writable: true,
});

process.env.VITE_API_HOST = 'https://mock-host.test';
process.env.NODE_ENV = 'test';
// Add any other needed env vars for your test suite 