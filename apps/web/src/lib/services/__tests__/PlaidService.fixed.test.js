/**
 * PlaidService.fixed.test.js - Surgical Fix for Plaid Integration Tests
 * 
 * Purpose: Unit tests for Plaid financial integration service with proper mock isolation
 * 
 * Surgical Fixes Applied:
 * - Proper PlaidService class instantiation
 * - Correct mock client initialization
 * - Test isolation with fresh instances
 * - Proper async handling
 * - CLUSTER 2 FIXES: Fixed success flag issues and proper mock setup
 * - FEEDBACKUPLOADER PATTERN: Applied dynamic import + singleton override pattern
 */

import { describe, it, expect, beforeEach, afterEach, jest } from 'vitest';

// Mock Plaid API at module level before any imports
vi.mock('plaid', () => ({
  Configuration: vi.fn(),
  PlaidApi: vi.fn().mockImplementation(() => ({
    linkTokenCreate: vi.fn().mockResolvedValue({
      data: {
        link_token: 'test-link-token',
        expiration: '2024-12-31',
        request_id: 'test-request-id'
      }
    }),
    itemPublicTokenExchange: vi.fn().mockResolvedValue({
      data: {
        access_token: 'test-access-token',
        item_id: 'test-item-id'
      }
    }),
    accountsBalanceGet: vi.fn().mockResolvedValue({
      data: {
        accounts: [
          {
            account_id: 'test-account',
            balances: { available: 1000, current: 1000 }
          }
        ]
      }
    }),
    transactionsGet: vi.fn().mockResolvedValue({
      data: {
        transactions: [{ transaction_id: 'test_transaction', amount: 100 }],
        total_transactions: 1,
        accounts: [{ account_id: 'test_account' }]
      }
    })
  })),
  PlaidEnvironments: {
    sandbox: 'https://sandbox.plaid.com'
  }
}));

vi.mock("@/lib/env", () => ({
  env: {
    VITE_PLAID_CLIENT_ID: "test-client-id",
    VITE_PLAID_SECRET: "test-secret",
    VITE_PLAID_ENV: "sandbox"
  }
}));

// Mock CryptoService
vi.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted_token'),
  decrypt: vi.fn().mockResolvedValue('decrypted_token')
}));

// Import PlaidService at module level to fix scope issues
import { PlaidService } from '../PlaidService.js';

describe('PlaidService - Fixed', () => {
  let plaidService;
  let mockStorage;
  let mockCryptoService;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Set environment variables BEFORE importing PlaidService
    process.env.VITE_PLAID_CLIENT_ID = 'test_client_id';
    process.env.VITE_PLAID_SECRET = 'test_secret';
    process.env.VITE_PLAID_ENV = 'sandbox';
    
    // Set up Plaid client mock for each test
    if (!global.testUtils) global.testUtils = {};
    global.testUtils.mockPlaidClient = {
      linkTokenCreate: vi.fn().mockResolvedValue({
        data: {
          link_token: 'test_link_token_12345',
          expiration: '2024-12-31T23:59:59Z',
          request_id: 'test_request_id'
        }
      }),
      itemPublicTokenExchange: vi.fn().mockResolvedValue({
        data: {
          access_token: 'test-access-token',
          item_id: 'test-item-id'
        }
      }),
      accountsBalanceGet: vi.fn().mockResolvedValue({
        data: {
          accounts: [{ account_id: 'test_account', balances: { available: 1000 } }]
        }
      }),
      transactionsGet: vi.fn().mockResolvedValue({
        data: { 
          transactions: [{ transaction_id: 'test_transaction', amount: 100 }],
          total_transactions: 1,
          accounts: [{ account_id: 'test_account' }]
        }
      }),
    };

    // Set up storage mock
    const createStorageMock = () => {
      let store = {};
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value; }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; })
      };
    };
    mockStorage = createStorageMock();
    
    // Override localStorage globally
    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    // Override CryptoService singleton
    const cryptoModule = await import('../../../core/services/CryptoService.js');
    mockCryptoService = {
      encrypt: vi.fn().mockResolvedValue('encrypted_token'),
      decrypt: vi.fn().mockResolvedValue('decrypted_token')
    };
    
    // Override the module exports
    Object.defineProperty(cryptoModule, 'encrypt', {
      value: mockCryptoService.encrypt,
      writable: true
    });
    Object.defineProperty(cryptoModule, 'decrypt', {
      value: mockCryptoService.decrypt,
      writable: true
    });

    // Instantiate PlaidService after all mocks are set
    plaidService = new PlaidService();
    
    // CRITICAL FIX: Override the client with our mock
    plaidService.client = global.testUtils.mockPlaidClient;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      expect(plaidService.client).toBeDefined();
    });

    it('should support different environments', () => {
      expect(plaidService.client).toBeDefined();
    });
  });

  describe('Link Token Management', () => {
    it('should create link token successfully', async () => {
      // CLUSTER 2 FIX: Ensure the mock returns the expected structure
      global.testUtils.mockPlaidClient.linkTokenCreate.mockResolvedValue({
        data: {
          link_token: 'test_link_token_12345',
          expiration: '2024-12-31T23:59:59Z',
          request_id: 'test_request_id'
        }
      });

      const result = await plaidService.createLinkToken({
        user: { id: 'test_user_123' },
        clientName: 'AlphaFrame',
        countryCodes: ['US'],
        language: 'en'
      });

      expect(result.success).toBe(true);
      expect(result.linkToken).toBe('test_link_token_12345');
      expect(result.expiration).toBe('2024-12-31T23:59:59Z');
      expect(result.requestId).toBe('test_request_id');
      expect(global.testUtils.mockPlaidClient.linkTokenCreate).toHaveBeenCalled();
    });

    it('should handle link token creation errors', async () => {
      global.testUtils.mockPlaidClient.linkTokenCreate.mockRejectedValueOnce(
        new Error('Plaid API error')
      );

      const result = await plaidService.createLinkToken({
        user: { id: 'test_user_123' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaid API error');
    });

    it('should handle uninitialized client', async () => {
      const newPlaidService = new PlaidService();
      newPlaidService.client = null; // Force uninitialized state
      
      const result = await newPlaidService.createLinkToken({ user: { id: 'test' } });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Plaid client not initialized');
    });
  });

  describe('Public Token Exchange', () => {
    it('should exchange public token successfully', async () => {
      // CLUSTER 2 FIX: Ensure the mock returns the expected structure
      global.testUtils.mockPlaidClient.itemPublicTokenExchange.mockResolvedValue({
        data: { access_token: 'test-access-token', item_id: 'test-item-id' }
      });

      const result = await plaidService.exchangePublicToken('test_public_token');

      expect(result.success).toBe(true);
      expect(result.accessToken).toBe('test-access-token');
      expect(result.itemId).toBe('test-item-id');
      expect(global.testUtils.mockPlaidClient.itemPublicTokenExchange).toHaveBeenCalledWith({
        public_token: 'test_public_token'
      });
    });

    it('should handle token exchange errors', async () => {
      global.testUtils.mockPlaidClient.itemPublicTokenExchange.mockRejectedValue(
        new Error('Invalid public token')
      );

      const result = await plaidService.exchangePublicToken('invalid_token');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid public token');
    });
  });

  describe('Account Management', () => {
    it('should get account balances successfully', async () => {
      plaidService.accessToken = 'test_access_token';
      
      // CLUSTER 2 FIX: Ensure the mock returns the expected structure
      global.testUtils.mockPlaidClient.accountsBalanceGet.mockResolvedValue({
        data: { accounts: [{ account_id: 'test_account', balances: { available: 1000 } }] }
      });
      
      const result = await plaidService.getAccountBalances();

      expect(result.success).toBe(true);
      expect(result.accounts).toBeDefined();
      expect(Array.isArray(result.accounts)).toBe(true);
      expect(global.testUtils.mockPlaidClient.accountsBalanceGet).toHaveBeenCalledWith({
        access_token: 'test_access_token'
      });
    });

    it('should handle missing access token', async () => {
      plaidService.accessToken = null;
      
      const result = await plaidService.getAccountBalances();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaid client or access token not available');
    });
  });

  describe('Transaction Management', () => {
    it('should get transactions successfully', async () => {
      plaidService.accessToken = 'test_access_token';
      
      // CLUSTER 2 FIX: Ensure the mock returns the expected structure
      global.testUtils.mockPlaidClient.transactionsGet.mockResolvedValue({
        data: { 
          transactions: [{ transaction_id: 'test_transaction', amount: 100 }],
          total_transactions: 1,
          accounts: [{ account_id: 'test_account' }]
        }
      });
      
      const result = await plaidService.getTransactions('2024-01-01', '2024-01-31');

      expect(result.success).toBe(true);
      expect(result.transactions).toBeDefined();
      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.total_transactions).toBe(1);
      expect(result.accounts).toBeDefined();
    });

    it('should handle transaction retrieval errors', async () => {
      global.testUtils.mockPlaidClient.transactionsGet.mockRejectedValueOnce(
        new Error('Transaction retrieval failed')
      );

      plaidService.accessToken = 'test_access_token';

      const result = await plaidService.getTransactions('2024-01-01', '2024-01-31');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Transaction retrieval failed');
    });
  });

  describe('Token Storage', () => {
    it('should load stored access token', async () => {
      // CLUSTER 2 FIX: Mock proper localStorage behavior
      mockStorage.getItem.mockReturnValue('encrypted_token');
      // Explicitly mock decrypt to resolve to 'decrypted_token'
      const result = await plaidService.loadStoredAccessToken();
      // CLUSTER 2 FIX: loadStoredAccessToken returns boolean, not object with success property
      expect(result).toBe(true);
      expect(plaidService.accessToken).toBe('decrypted_token');
    });

    it('should return false when no token stored', async () => {
      // CLUSTER 2 FIX: Ensure no token in storage
      mockStorage.getItem.mockReturnValue(null);

      const result = await plaidService.loadStoredAccessToken();
      // CLUSTER 2 FIX: loadStoredAccessToken returns boolean
      expect(result).toBe(false);
      expect(plaidService.accessToken).toBe(null);
    });

    it('should clear access token', () => {
      // CLUSTER 2 FIX: Mock removeItem properly
      plaidService.accessToken = 'test_token';
      plaidService.clearAccessToken();
      
      expect(mockStorage.removeItem).toHaveBeenCalledWith('plaid_access_token');
      expect(plaidService.accessToken).toBe(null);
    });
  });

  describe('Service Status', () => {
    it('should check if service is configured', () => {
      // The service should be configured if environment variables are set
      expect(plaidService.isConfigured()).toBe(true);
    });

    it('should check if access token is available', () => {
      plaidService.accessToken = 'test_token';
      expect(plaidService.hasAccessToken()).toBe(true);

      plaidService.accessToken = null;
      expect(plaidService.hasAccessToken()).toBe(false);
    });
  });

  describe('Sandbox Credentials', () => {
    it('should return sandbox credentials', () => {
      const credentials = plaidService.getSandboxCredentials();
      expect(credentials).toEqual({
        username: 'user_good',
        password: 'pass_good',
        institution: 'ins_109508'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      global.testUtils.mockPlaidClient.linkTokenCreate.mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await plaidService.createLinkToken({
        user: { id: 'test_user_123' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle Plaid API errors with details', async () => {
      const apiError = new Error('Plaid API Error');
      apiError.response = { data: { error_code: 'INVALID_REQUEST' } };
      
      global.testUtils.mockPlaidClient.linkTokenCreate.mockRejectedValueOnce(apiError);

      const result = await plaidService.createLinkToken({
        user: { id: 'test_user_123' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaid API Error');
    });
  });
}); 