import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      '@/lib/store': path.resolve(__dirname, './apps/web/src/core/store'),
      '@/store': path.resolve(__dirname, './apps/web/src/core/store'),
      '@/core/store': path.resolve(__dirname, './apps/web/src/core/store'),
    },
  },
  define: {
    'process.env': process.env
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './apps/web/tests/setup.js',
    css: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    include: [
      'apps/web/tests/**/*.{test,spec}.{js,jsx}',
      'apps/web/src/**/*.{test,spec}.{js,jsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/*.e2e.*',
      '**/playwright-report/**',
      '**/test-results/**',
      'apps/web/e2e/**',
      'apps/web/src/components/Button.test.jsx',
      'apps/web/src/features/pro/tests/**',
      '**/e2e/**/*',
      '**/*.e2e.js',
      '**/*.e2e.jsx',
      '**/e2e/**/*.spec.js',
      '**/e2e/**/*.spec.jsx',
      '**/e2e/**/*.test.js',
      '**/e2e/**/*.test.jsx',
      'apps/web/e2e/**/*',
      'apps/web/e2e/**/*.spec.js',
      'apps/web/e2e/**/*.test.js'
    ],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        includeNodeLocations: true,
      }
    },
    env: {
      VITE_APP_ENV: 'test',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test_client_id',
      VITE_AUTH0_AUDIENCE: 'https://test.api.alphaframe.dev',
      VITE_PLAID_CLIENT_ID: 'test_plaid_client_id',
      VITE_PLAID_SECRET: 'test_plaid_secret',
      VITE_PLAID_ENV: 'sandbox'
    },
  },
}); 
