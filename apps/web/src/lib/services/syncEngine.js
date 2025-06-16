/**
 * SyncEngine handles all data synchronization operations
 * This includes Plaid integration and transaction syncing
 */

/**
 * Initializes the Plaid client (mocked)
 */
export const initializePlaid = async (clientId, secret, env) => {
  // Return a mock Plaid client object
  return { clientId, status: 'initialized', env };
};

/**
 * Syncs transactions for an account (mocked)
 */
export const syncTransactions = async (accountId) => {
  // If the accountId is invalid, throw an error
  if (accountId === 'invalid_id') {
    throw new Error('Account not found');
  }
  // Return a mock array of transactions
  return [
    { id: 'txn_1', amount: 100.25, date: '2024-06-01', description: 'Grocery Store' },
    { id: 'txn_2', amount: 50.00, date: '2024-06-02', description: 'Gas Station' }
  ];
};

/**
 * Syncs account balances (mocked)
 */
export const syncBalances = async (accountId) => {
  // Return a mock balance object
  return {
    available: 5000,
    current: 5100,
    currency: 'USD'
  };
};

/**
 * Handles Plaid webhook events (mocked)
 */
export const handleWebhook = async (event) => {
  // Always resolve successfully
  return { status: 'webhook_processed' };
}; 