import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm dev',
    port: 5178,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5178',
  },
}); 