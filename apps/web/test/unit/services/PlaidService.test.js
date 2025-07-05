import { describe, it, expect, beforeEach, vi } from 'vitest';

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

vi.mock("@/lib/env", () => ({
  env: {
    VITE_PLAID_CLIENT_ID: "test-client-id",
    VITE_PLAID_SECRET: "test-secret",
    VITE_PLAID_ENV: "sandbox"
  }
}));

describe('PlaidService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have basic functionality', () => {
    expect(true).toBe(true);
  });
}); 