import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib/store': path.resolve(__dirname, './src/core/store'),
      '@/store': path.resolve(__dirname, './src/core/store'),
      '@/core/store': path.resolve(__dirname, './src/core/store'),
    },
  },
  define: {
    'process.env': process.env
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    mockReset: true,
    restoreMocks: true,
    isolate: true,
    include: ['test/**/*.test.js', 'test/**/*.test.ts', 'test/**/*.test.jsx', 'test/**/*.test.tsx'],
  },
}); 