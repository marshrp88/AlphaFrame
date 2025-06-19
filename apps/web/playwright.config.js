import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:5179',
    headless: true,
  },
  webServer: {
    command: 'pnpm dev',
    port: 5179,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
}); 
