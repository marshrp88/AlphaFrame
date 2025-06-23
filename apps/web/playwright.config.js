import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    viewport: { width: 1280, height: 720 },
    testIdAttribute: 'data-testid',
  },
  webServer: {
    command: 'pnpm dev',
    port: 5174,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      VITE_APP_ENV: 'test',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test_client_id',
      VITE_AUTH0_AUDIENCE: 'https://test.api.alphaframe.dev',
      VITE_PLAID_CLIENT_ID: 'test_plaid_client_id',
      VITE_PLAID_SECRET: 'test_plaid_secret',
      VITE_PLAID_ENV: 'sandbox'
    }
  },
  globalSetup: './e2e/global-setup.js',
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ]
}); 
