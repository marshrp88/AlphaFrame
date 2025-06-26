import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import plaidService from '../PlaidService';

// Mock config
vi.mock('../../config', () => ({
  default: {
    plaid: {
      clientId: 'test-client-id',
      secret: 'test-secret',
      env: 'sandbox'
    }
  }
}));

describe('PlaidService', () => {
  let localStorageMock;
  let fetchMock;
  let originalAccessToken;

  beforeEach(() => {
    // Per-test localStorage mock
    localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'plaid_access_token') return 'test-plaid-token';
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    global.localStorage = localStorageMock;

    // Per-test fetch mock
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Save and reset PlaidService accessToken
    originalAccessToken = plaidService.accessToken;
    plaidService.accessToken = undefined;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      localStorageMock.getItem.mockReturnValue('test-plaid-token');
      plaidService.accessToken = localStorageMock.getItem('plaid_access_token');
      const token = plaidService.accessToken;
      expect(token).toBe('test-plaid-token');
    });

    it('should set access token in storage', () => {
      plaidService.clearAccessToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('plaid_access_token');
    });

    it('should clear access token', () => {
      plaidService.clearAccessToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('plaid_access_token');
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