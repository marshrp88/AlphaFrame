/**
 * AlphaFrame VX.1 Deployment Configuration
 * 
 * This file contains deployment settings for different environments.
 * The CI/CD pipeline uses these configurations for automated deployments.
 */

module.exports = {
  // Development Environment
  development: {
    name: 'development',
    url: 'http://localhost:5173',
    buildCommand: 'pnpm build',
    previewCommand: 'pnpm preview',
    environment: {
      NODE_ENV: 'development',
      VITE_APP_ENV: 'development',
    },
  },

  // Staging Environment
  staging: {
    name: 'staging',
    url: 'https://staging.alphaframe.app',
    buildCommand: 'pnpm build',
    environment: {
      NODE_ENV: 'production',
      VITE_APP_ENV: 'staging',
    },
    // Add your staging deployment configuration here
    // Example for AWS S3:
    // deploy: {
    //   type: 's3',
    //   bucket: 'alphaframe-staging',
    //   region: 'us-east-1',
    //   distributionId: 'E1234567890ABC',
    // },
  },

  // Production Environment
  production: {
    name: 'production',
    url: 'https://alphaframe.app',
    buildCommand: 'pnpm build',
    environment: {
      NODE_ENV: 'production',
      VITE_APP_ENV: 'production',
    },
    // Add your production deployment configuration here
    // Example for AWS S3:
    // deploy: {
    //   type: 's3',
    //   bucket: 'alphaframe-production',
    //   region: 'us-east-1',
    //   distributionId: 'E0987654321XYZ',
    // },
  },

  // Test Environment
  test: {
    name: 'test',
    url: 'http://localhost:4173',
    buildCommand: 'pnpm build',
    previewCommand: 'pnpm preview',
    environment: {
      NODE_ENV: 'test',
      VITE_APP_ENV: 'test',
    },
  },
}; 