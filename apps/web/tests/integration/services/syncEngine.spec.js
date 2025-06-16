import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('should initialize Plaid client with correct config', async () => {
    const client = await initializePlaid(
      mockPlaidConfig.clientId,
      mockPlaidConfig.secret,
      mockPlaidConfig.env
    );
    expect(client).toBeDefined();
  });

  it('should sync transactions for an account', async () => {
    const transactions = await syncTransactions(mockAccountId);
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toHaveProperty('id');
    expect(transactions[0]).toHaveProperty('amount');
  });

  it('should sync account balances', async () => {
    const balance = await syncBalances(mockAccountId);
    expect(balance).toHaveProperty('current');
    expect(balance).toHaveProperty('available');
    expect(typeof balance.current).toBe('number');
  });

  it('should handle webhook events', async () => {
    const mockEvent = {
      type: 'TRANSACTIONS_REMOVED',
      account_id: mockAccountId
    };
    await expect(handleWebhook(mockEvent)).resolves.not.toThrow();
  });

  it('should handle sync errors gracefully', async () => {
    const invalidAccountId = 'invalid_id';
    await expect(syncTransactions(invalidAccountId)).rejects.toThrow();
  });
}); 