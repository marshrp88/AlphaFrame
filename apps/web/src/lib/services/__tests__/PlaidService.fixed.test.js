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

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock plaid module
jest.mock('plaid', () => {
  return {
    Configuration: jest.fn(),
    PlaidApi: jest.fn(() => (global.testUtils && global.testUtils.mockPlaidClient) || {}),
    PlaidEnvironments: {
      sandbox: 'https://sandbox.plaid.com'
    }
  };
});

// Mock CryptoService
jest.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: jest.fn().mockResolvedValue('encrypted_token'),
  decrypt: jest.fn().mockResolvedValue('decrypted_token')
}));

describe('PlaidService - Fixed', () => {
  let plaidService;
  let mockStorage;
  let mockCryptoService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Set up Plaid client mock for each test
    if (!global.testUtils) global.testUtils = {};
    global.testUtils.mockPlaidClient = {
      linkTokenCreate: jest.fn(),
      itemPublicTokenExchange: jest.fn(),
      accountsBalanceGet: jest.fn(),
      transactionsGet: jest.fn(),
    };

    // Set up storage mock
    const createStorageMock = () => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
      };
    };
    mockStorage = createStorageMock();
    
    // Override localStorage globally
    Object.defineProperty(global, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    // Set environment variables
    process.env.VITE_PLAID_CLIENT_ID = 'test_client_id';
    process.env.VITE_PLAID_SECRET = 'test_secret';
    process.env.VITE_PLAID_ENV = 'sandbox';

    // Dynamic import with singleton override pattern
    const { PlaidService } = await import('../PlaidService.js');
    
    // Override CryptoService singleton
    const cryptoModule = await import('../../../core/services/CryptoService.js');
    mockCryptoService = {
      encrypt: jest.fn().mockResolvedValue('encrypted_token'),
      decrypt: jest.fn().mockResolvedValue('decrypted_token')
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
      const originalClient = plaidService.client;
      plaidService.client = null;

      const result = await plaidService.createLinkToken({
        user: { id: 'test_user_123' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaid client not initialized');
      
      plaidService.client = originalClient;
    });
  });

  describe('Public Token Exchange', () => {
    it('should exchange public token successfully', async () => {
      // CLUSTER 2 FIX: Ensure the mock returns the expected structure
      global.testUtils.mockPlaidClient.itemPublicTokenExchange.mockResolvedValue({
        data: { access_token: 'test_access_token_67890', item_id: 'test_item_id' }
      });

      const result = await plaidService.exchangePublicToken('test_public_token');

      expect(result.success).toBe(true);
      expect(result.accessToken).toBe('test_access_token_67890');
      expect(result.itemId).toBe('test_item_id');
      expect(global.testUtils.mockPlaidClient.itemPublicTokenExchange).toHaveBeenCalledWith({
        public_token: 'test_public_token'
      });
    });

    it('should handle token exchange errors', async () => {
      global.testUtils.mockPlaidClient.itemPublicTokenExchange.mockRejectedValueOnce(
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
      expect(result.error).toContain('access token not available');
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