import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
const enableBundleReport = process.env.BUNDLE_REPORT === '1' || process.env.BUNDLE_REPORT === 'true'

export default defineConfig({
  plugins: [
    react(),
    ...(enableBundleReport
      ? [
          visualizer({
            filename: 'docs/bundle/report.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib/store': path.resolve(__dirname, './src/core/store'),
      '@/store': path.resolve(__dirname, './src/core/store'),
      '@/core/store': path.resolve(__dirname, './src/core/store')
    },
  },
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'framer-motion',
      '@radix-ui/react-icons',
      '@radix-ui/react-slot',
      'date-fns',
      'react-router-dom',
      'react-hot-toast',
      'zod'
    ],
  },
  build: {
    sourcemap: enableBundleReport ? true : false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('date-fns') || id.includes('zod')) return 'utils';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('plaid') || id.includes('react-plaid-link')) return 'plaid';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: false,
    // Fix for React 18 createRoot issues
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously'
      }
    },
    // Mock environment variables
    env: {
      VITE_APP_ENV: 'test',
      VITE_AUTH0_DOMAIN: 'test.auth0.com',
      VITE_AUTH0_CLIENT_ID: 'test_client_id',
      VITE_AUTH0_AUDIENCE: 'https://test.api.alphaframe.dev',
      VITE_PLAID_CLIENT_ID: 'test_plaid_client_id',
      VITE_PLAID_SECRET: 'test_plaid_secret',
      VITE_PLAID_ENV: 'sandbox'
    }
  }
})
