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
    environment: 'jsdom',
    globals: true,
    setupFiles: './apps/web/src/setupTests.js',
    css: false,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously'
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
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      '**/*.e2e.*',
      '**/playwright-report/**',
      '**/test-results/**',
      'src/components/Button.test.jsx',
      'src/features/pro/tests/**',
      'apps/web/tests/**',
    ],
  },
}); 
