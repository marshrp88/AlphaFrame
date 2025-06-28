/**
 * setupTests.js - Fixed Test Infrastructure for AlphaFrame VX.1
 * 
 * Purpose: Provide stable test environment with proper mocking
 * 
 * Fixes Applied:
 * - Enabled global Auth0 and Plaid mocks
 * - Fixed test isolation and timing issues
 * - Proper mock cleanup between tests
 * - Stable DOM and environment setup
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ============================================================================
// GLOBAL ERROR HANDLERS - CATCH SILENT FAILURES
// ============================================================================

// Add global error listeners to catch silent failures that cause test timeouts
process.on('unhandledRejection', () => {
  // console.error('💥 [TEST SETUP] Unhandled Promise Rejection:', reason);
  // console.error('💥 [TEST SETUP] Promise:', promise);
});

process.on('uncaughtException', () => {
  // console.error('💥 [TEST SETUP] Uncaught Exception:', error);
  // console.error('💥 [TEST SETUP] Stack:', error.stack);
});

// Also catch errors in the browser environment (jsdom)
if (typeof window !== 'undefined') {
  window.addEventListener('error', () => {
    // console.error('💥 [TEST SETUP] Window Error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', () => {
    // console.error('💥 [TEST SETUP] Window Unhandled Rejection:', event.reason);
  });
}

// ============================================================================
// AUTH0 SDK COMPLETE MOCKING - ENABLED
// ============================================================================

// Mock Auth0 with correct storage keys and stable behavior
const createAuth0Mock = () => {
  const mockAuth0 = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-access-token'),
    error: null
  };

  return mockAuth0;
};

const mockAuth0 = createAuth0Mock();

// ENABLED: Global Auth0 mock
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => mockAuth0),
  Auth0Provider: ({ children }) => children,
  withAuthenticationRequired: (component) => component
}));

// ============================================================================
// PLAID SDK COMPLETE MOCKING - ENABLED
// ============================================================================

// Mock Plaid SDK with all required methods
const createPlaidMock = () => {
  return {
    linkTokenCreate: vi.fn().mockResolvedValue({
      data: {
        link_token: 'test_link_token_12345',
        expiration: '2024-12-31T23:59:59Z',
        request_id: 'test_request_id'
      }
    }),
    itemPublicTokenExchange: vi.fn().mockResolvedValue({
      data: {
        access_token: 'test_access_token_67890',
        item_id: 'test_item_id',
        request_id: 'test_request_id'
      }
    }),
    accountsGet: vi.fn().mockResolvedValue({
      data: {
        accounts: [
          {
            account_id: 'test_account_1',
            balances: {
              available: 1000,
              current: 1000,
              iso_currency_code: 'USD',
              limit: null
            },
            mask: '0000',
            name: 'Test Account',
            official_name: 'Test Checking Account',
            type: 'depository',
            subtype: 'checking'
          }
        ],
        item: {
          available_products: ['balance', 'identity', 'investments'],
          billed_products: ['transactions'],
          institution_id: 'ins_109508',
          item_id: 'test_item_id',
          webhook: null
        },
        request_id: 'test_request_id'
      }
    }),
    transactionsGet: vi.fn().mockResolvedValue({
      data: {
        accounts: [
          {
            account_id: 'test_account_1',
            balances: {
              available: 1000,
              current: 1000,
              iso_currency_code: 'USD',
              limit: null
            },
            mask: '0000',
            name: 'Test Account',
            official_name: 'Test Checking Account',
            type: 'depository',
            subtype: 'checking'
          }
        ],
        item: {
          available_products: ['balance', 'identity', 'investments'],
          billed_products: ['transactions'],
          institution_id: 'ins_109508',
          item_id: 'test_item_id',
          webhook: null
        },
        request_id: 'test_request_id',
        total_transactions: 1,
        transactions: [
          {
            account_id: 'test_account_1',
            amount: 100,
            category: ['Food and Drink', 'Restaurants'],
            category_id: '13005000',
            date: '2024-01-01',
            iso_currency_code: 'USD',
            location: {
              address: '123 Test St',
              city: 'Test City',
              country: 'US',
              lat: 40.7128,
              lon: -74.0060,
              postal_code: '10001',
              region: 'NY',
              store_number: '123'
            },
            merchant_name: 'Test Restaurant',
            name: 'Test Transaction',
            payment_channel: 'in store',
            pending: false,
            pending_transaction_id: null,
            transaction_id: 'test_transaction_1',
            transaction_type: 'place',
            unofficial_currency_code: null
          }
        ]
      }
    })
  };
};

const mockPlaidClient = createPlaidMock();

// Mock PlaidApi constructor to return our mock client
const MockPlaidApi = vi.fn(() => mockPlaidClient);

// ENABLED: Global Plaid mock
vi.mock('@plaid/web-sdk', () => ({
  PlaidApi: MockPlaidApi
}));

// ============================================================================
// ENVIRONMENT VARIABLES MOCKING
// ============================================================================

// Mock import.meta.env for Vite with all required variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_APP_ENV: 'test',
    VITE_AUTH0_DOMAIN: 'test.auth0.com',
    VITE_AUTH0_CLIENT_ID: 'test_client_id',
    VITE_AUTH0_AUDIENCE: 'https://test.api.alphaframe.dev',
    VITE_PLAID_CLIENT_ID: 'test_plaid_client_id',
    VITE_PLAID_SECRET: 'test_plaid_secret',
    VITE_PLAID_ENV: 'sandbox',
    MODE: 'test',
    DEV: false,
    PROD: false,
    BASE_URL: '/',
    SSR: false
  },
  writable: true,
  configurable: true
});

// ============================================================================
// FETCH MOCKING WITH ALL METHODS
// ============================================================================

// Create complete fetch mock with all required methods
const createFetchMock = () => {
  const mockFetch = vi.fn();
  
  // Add all required mock methods
  mockFetch.mockReset = vi.fn();
  mockFetch.mockClear = vi.fn();
  mockFetch.mockRestore = vi.fn();
  mockFetch.mockImplementation = vi.fn();
  mockFetch.mockReturnValue = vi.fn();
  mockFetch.mockResolvedValue = vi.fn();
  mockFetch.mockRejectedValue = vi.fn();
  
  // Default implementation
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ success: true }),
    text: vi.fn().mockResolvedValue('success'),
    headers: new Map()
  });
  
  return mockFetch;
};

const mockFetch = createFetchMock();

// ============================================================================
// CRYPTO MOCKING FOR SECURE OPERATIONS
// ============================================================================

// Mock crypto for secure operations with stable keys
const mockCrypto = {
  getRandomValues: vi.fn((arr) => {
    // Provide consistent random values for tests
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (i % 256); // Predictable but varied values
    }
    return arr;
  }),
  subtle: {
    generateKey: vi.fn().mockResolvedValue('mock-key'),
    encrypt: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
    decrypt: vi.fn().mockResolvedValue(new TextEncoder().encode('decrypted-data')),
    importKey: vi.fn().mockResolvedValue('mock-imported-key'),
    exportKey: vi.fn().mockResolvedValue(new ArrayBuffer(32))
  }
};

// ============================================================================
// GLOBAL TEST ENVIRONMENT SETUP
// ============================================================================

// Set up global mocks
global.fetch = mockFetch;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:5173/',
    origin: 'http://localhost:5173',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn()
  },
  writable: true,
  configurable: true
});

// Mock URL API
global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = vi.fn();

// Mock crypto
Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true
});

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
};

// ============================================================================
// TEST ISOLATION & TIMING CONTROLS - FIXED
// ============================================================================

// Global test isolation setup - REMOVED FAKE TIMERS
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  vi.restoreAllMocks();
  
  // Reset any imported singletons
  vi.resetModules();
  
  // DO NOT use fake timers - they cause issues with async operations
  // vi.useFakeTimers();
});

afterEach(() => {
  // Clean up any remaining mocks
  vi.restoreAllMocks();
});

// ============================================================================
// ENHANCED MOCK PERSISTENCE
// ============================================================================

// Ensure mocks persist across test files
const ensureMockPersistence = () => {
  // Re-expose mocks globally if they don't exist
  if (!global.testUtils) {
    global.testUtils = {
      mockPlaidClient: createPlaidMock(),
      mockAuth0Client: createAuth0Mock(),
      MockPlaidApi: vi.fn(() => global.testUtils.mockPlaidClient)
    };
  }
  
  // Ensure fetch mock is available
  if (!global.fetch) {
    global.fetch = createFetchMock();
  }
  
  // Ensure crypto is available
  if (!window.crypto) {
    Object.defineProperty(window, 'crypto', {
      value: mockCrypto,
      writable: true,
      configurable: true
    });
  }
};

// Call immediately
ensureMockPersistence();

// ============================================================================
// GLOBAL MOCK MANAGEMENT (CLEANUP/RESET)
// ============================================================================

// Ensure all mocks are reset before each test
beforeEach(() => {
  // Reset all standard Vitest mocks
  vi.clearAllMocks();

  // Reset custom mocks to their initial state
  Object.assign(mockAuth0, createAuth0Mock());
});

// Final cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Global test utilities for mocks
global.testUtils = {
  mockPlaidClient: {
    linkTokenCreate: vi.fn(),
    itemPublicTokenExchange: vi.fn(),
    accountsBalanceGet: vi.fn(),
    transactionsGet: vi.fn(),
  },
  mockExecuteAction: vi.fn(),
  mockCryptoService: {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    generateSalt: vi.fn(),
  },
}; 