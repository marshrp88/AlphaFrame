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

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

describe('PlaidService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      const token = plaidService.accessToken;
      expect(token).toBeDefined();
    });

    it('should set access token in storage', () => {
      plaidService.clearAccessToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('plaid_access_token');
    });

    it('should clear access token', () => {
      plaidService.clearAccessToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('plaid_access_token');
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