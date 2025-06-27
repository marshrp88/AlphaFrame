
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5175',
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
});
