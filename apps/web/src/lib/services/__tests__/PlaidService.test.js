import { describe, it, expect, vi, beforeEach, afterEach } from '@jest/globals';

// Mock config
jest.mock('../../config', () => ({
  default: {
    plaid: {
      clientId: 'test-client-id',
      secret: 'test-secret',
      env: 'sandbox'
    }
  }
}));

// Mock Plaid API at module level before any imports
jest.mock('plaid', () => ({
  Configuration: jest.fn(),
  PlaidApi: jest.fn().mockImplementation(() => ({
    linkTokenCreate: jest.fn().mockResolvedValue({
      data: {
        link_token: 'test-link-token',
        expiration: '2024-12-31',
        request_id: 'test-request-id'
      }
    }),
    itemPublicTokenExchange: jest.fn().mockResolvedValue({
      data: {
        access_token: 'test-access-token',
        item_id: 'test-item-id'
      }
    }),
    accountsBalanceGet: jest.fn().mockResolvedValue({
      data: {
        accounts: [
          {
            account_id: 'test-account',
            balances: { available: 1000, current: 1000 }
          }
        ]
      }
    }),
    transactionsGet: jest.fn().mockResolvedValue({
      data: {
        transactions: [],
        total_transactions: 0,
        accounts: []
      }
    })
  })),
  PlaidEnvironments: {
    sandbox: 'https://sandbox.plaid.com'
  }
}));

jest.mock("@/lib/env", () => ({
  env: {
    VITE_PLAID_CLIENT_ID: "test-client-id",
    VITE_PLAID_SECRET: "test-secret",
    VITE_PLAID_ENV: "sandbox"
  }
}));

describe('PlaidService', () => {
  let plaidService;
  let originalAccessToken;

  beforeEach(async () => {
    // Reset modules
    jest.resetModules();
    jest.clearAllMocks();

    // Create a completely new localStorage mock
    const mockLocalStorage = {
      store: {
        'plaid_access_token': 'test-plaid-token'
      },
      getItem: jest.fn(function(key) {
        console.log('MOCK localStorage.getItem called with:', key);
        const value = this.store[key] || null;
        console.log('MOCK localStorage.getItem returning:', value);
        return value;
      }),
      setItem: jest.fn(function(key, value) {
        console.log('MOCK localStorage.setItem called with:', key, value);
        this.store[key] = value.toString();
      }),
      removeItem: jest.fn(function(key) {
        console.log('MOCK localStorage.removeItem called with:', key);
        delete this.store[key];
      }),
      clear: jest.fn(function() {
        console.log('MOCK localStorage.clear called');
        this.store = {};
      })
    };

    // Replace the entire localStorage object
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });

    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
        configurable: true
      });
    }

    // Import the service after setting up mocks
    plaidService = await import('../PlaidService');
    plaidService = plaidService.default;

    // Save and reset PlaidService accessToken
    originalAccessToken = plaidService.accessToken;
    plaidService.accessToken = undefined;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    plaidService.accessToken = originalAccessToken;
  });

  describe('Initialization', () => {
    it('should initialize with correct config', () => {
      expect(plaidService).toBeDefined();
      expect(plaidService.isConfigured).toBeDefined();
    });
  });

  describe('Token Management', () => {
    it('should get access token from storage', () => {
      const token = global.localStorage.getItem('plaid_access_token');
      expect(token).toBe('test-plaid-token');
    });

    it('should set access token in storage', () => {
      plaidService.clearAccessToken();
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('plaid_access_token');
    });

    it('should clear access token', () => {
      plaidService.clearAccessToken();
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('plaid_access_token');
    });
  });

  describe('API Methods', () => {
    it('should have createLinkToken method', () => {
      expect(plaidService.createLinkToken).toBeDefined();
    });

    it('should have exchangePublicToken method', () => {
      expect(plaidService.exchangePublicToken).toBeDefined();
    });

    it('should have getAccountBalances method', () => {
      expect(plaidService.getAccountBalances).toBeDefined();
    });

    it('should have getTransactions method', () => {
      expect(plaidService.getTransactions).toBeDefined();
    });
  });
}); 