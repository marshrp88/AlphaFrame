module.exports = {
  rootDir: '.',
  // Setup files for environment and global mocks
  setupFiles: ['<rootDir>/jest.setup.js'], // Add global setup for import.meta.env
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/tests/**/*.test.jsx',
    '<rootDir>/tests/**/*.spec.jsx',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/src/**/*.test.jsx',
    '<rootDir>/src/**/*.spec.jsx'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/index.js',
    '!src/**/index.jsx',
    '!src/**/mocks/**',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
    '!src/setupTests.js',
    '!src/test-setup.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/public/**',
    '!**/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  // Add module mocks for problematic dependencies
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],
  // Ensure proper module resolution
  resolver: undefined,
  // --- ALIAS MAPPING SECTION ---
  moduleNameMapper: {
    // Vite-style alias for src
    '^@/(.*)$': '<rootDir>/src/$1',
    // Explicit env.js mapping for tests
    '^@/lib/env$': '<rootDir>/src/lib/env.js',
    // Explicit mappings for shared/ui and components/ui
    '^@/shared/ui/(.*)$': '<rootDir>/src/shared/ui/$1',
    '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
    // CSS and asset mocks
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    // Crypto mocks
    '^tweetnacl$': '<rootDir>/tests/__mocks__/nacl.js',
    '^tweetnacl-util$': '<rootDir>/tests/__mocks__/tweetnacl-util.js',
  }
}; 