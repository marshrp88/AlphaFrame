import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'zustand',
            'framer-motion'
          ],
          ui: [
            '@radix-ui/react-icons',
            '@radix-ui/react-slot',
            'react-hot-toast'
          ],
          utils: [
            'date-fns',
            'zod',
            'react-router-dom'
          ]
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
