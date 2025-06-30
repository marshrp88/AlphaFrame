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