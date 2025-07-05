import { vi } from 'vitest';

const PlaidService = {
  isConfigured: true,
  clearAccessToken: vi.fn(),
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-plaid-token'),
  createLinkToken: vi.fn().mockResolvedValue({
    link_token: 'test-link-token',
    expiration: '2024-12-31',
    request_id: 'test-request-id'
  }),
  exchangePublicToken: vi.fn().mockResolvedValue({
    access_token: 'test-access-token',
    item_id: 'test-item-id'
  }),
  getAccountBalances: vi.fn().mockResolvedValue([
    {
      account_id: 'test-account',
      balances: { available: 1000, current: 1000 }
    }
  ]),
  getTransactions: vi.fn().mockResolvedValue([
    {
      transaction_id: 'test-transaction',
      amount: 100,
      date: '2024-01-01',
      merchant_name: 'Test Merchant'
    }
  ])
};

// Make all methods spyable
Object.keys(PlaidService).forEach(key => {
  if (typeof PlaidService[key] === 'function') {
    PlaidService[key] = vi.fn(PlaidService[key]);
  }
});

export default PlaidService;
export { PlaidService }; 