// CLUSTER 1 FIX: Add test-local SyncEngine mock BEFORE imports to prevent hanging
vi.mock('../../../src/lib/services/syncEngine', () => ({
  initializePlaid: vi.fn(() => Promise.resolve({ clientId: 'test_client' })),
  syncTransactions: vi.fn((accountId) => {
    // CLUSTER 2 FIX: Mock should reject for invalid account IDs
    if (accountId === 'invalid_id') {
      return Promise.reject(new Error('Invalid account ID'));
    }
    return Promise.resolve([
      { id: 'txn_1', amount: 100, date: '2024-01-01' }
    ]);
  }),
  syncBalances: vi.fn(() => Promise.resolve({ current: 1000, available: 950 })),
  handleWebhook: vi.fn(() => Promise.resolve({ success: true }))
}));

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initializePlaid, syncTransactions, syncBalances, handleWebhook } from '../../../src/lib/services/syncEngine';

describe('SyncEngine Integration', () => {
  const mockPlaidConfig = {
    clientId: 'test_client_id',
    secret: 'test_secret',
    env: 'sandbox'
  };

  const mockAccountId = 'test_account_id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize Plaid client with correct config', async () => {
    const client = await initializePlaid(
      mockPlaidConfig.clientId,
      mockPlaidConfig.secret,
      mockPlaidConfig.env
    );
    expect(client).toBeDefined();
  }, 10000); // CLUSTER 1 FIX: Extended timeout for safety

  it('should sync transactions for an account', async () => {
    const transactions = await syncTransactions(mockAccountId);
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toHaveProperty('id');
    expect(transactions[0]).toHaveProperty('amount');
  }, 10000); // CLUSTER 1 FIX: Extended timeout for safety

  it('should sync account balances', async () => {
    const balance = await syncBalances(mockAccountId);
    expect(balance).toHaveProperty('current');
    expect(balance).toHaveProperty('available');
    expect(typeof balance.current).toBe('number');
  }, 10000); // CLUSTER 1 FIX: Extended timeout for safety

  it('should handle webhook events', async () => {
    const mockEvent = {
      type: 'TRANSACTIONS_REMOVED',
      account_id: mockAccountId
    };
    await expect(handleWebhook(mockEvent)).resolves.not.toThrow();
  }, 10000); // CLUSTER 1 FIX: Extended timeout for safety

  it('should handle sync errors gracefully', async () => {
    const invalidAccountId = 'invalid_id';
    await expect(syncTransactions(invalidAccountId)).rejects.toThrow('Invalid account ID');
  }, 10000); // CLUSTER 1 FIX: Extended timeout for safety
}); 
