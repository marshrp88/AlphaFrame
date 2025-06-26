/**
 * SyncEngine.js - AlphaFrame VX.1
 * 
 * Purpose: Real Plaid integration for secure bank data synchronization
 * with comprehensive error handling, logging, and sandbox support.
 * 
 * Procedure:
 * 1. Initialize Plaid client with environment-specific credentials
 * 2. Handle OAuth flow for secure bank connection
 * 3. Sync transactions and balances with proper error handling
 * 4. Process webhook events for real-time updates
 * 5. Log all operations via ExecutionLogService
 * 
 * Conclusion: Provides secure, reliable bank data integration
 * while maintaining zero-knowledge compliance and comprehensive logging.
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import executionLogService from '../../core/services/ExecutionLogService.js';

/**
 * Plaid client configuration
 */
let plaidClient = null;

/**
 * Initialize Plaid client with environment-specific configuration
 * @param {string} clientId - Plaid client ID
 * @param {string} secret - Plaid secret key
 * @param {string} env - Environment (sandbox, development, production)
 * @returns {PlaidApi} Configured Plaid client
 */
export const initializePlaid = async (clientId, secret, env = 'sandbox') => {
  try {
    if (!clientId || !secret) {
      throw new Error('Plaid credentials are required');
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments[env],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });

    plaidClient = new PlaidApi(configuration);

    await executionLogService.log('plaid.client.initialized', {
      environment: env,
      clientId: clientId ? '***' + clientId.slice(-4) : 'missing',
      timestamp: new Date().toISOString()
    });

    return plaidClient;
  } catch (error) {
    await executionLogService.logError('plaid.client.initialization.failed', error, {
      environment: env,
      clientId: clientId ? '***' + clientId.slice(-4) : 'missing'
    });
    throw new Error(`Failed to initialize Plaid client: ${error.message}`);
  }
};

/**
 * Create a link token for OAuth flow
 * @param {string} userId - User identifier
 * @param {string} clientName - Application name
 * @returns {Object} Link token response
 */
export const createLinkToken = async (userId, clientName = 'AlphaFrame') => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    const request = {
      user: { client_user_id: userId },
      client_name: clientName,
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      account_filters: {
        depository: {
          account_subtypes: ['checking', 'savings']
        }
      }
    };

    const response = await plaidClient.linkTokenCreate(request);

    await executionLogService.log('plaid.link_token.created', {
      userId,
      clientName,
      linkTokenId: response.data.link_token ? '***' + response.data.link_token.slice(-8) : 'missing'
    });

    return response.data;
  } catch (error) {
    await executionLogService.logError('plaid.link_token.creation.failed', error, {
      userId,
      clientName
    });
    throw new Error(`Failed to create link token: ${error.message}`);
  }
};

/**
 * Exchange public token for access token
 * @param {string} publicToken - Public token from OAuth flow
 * @returns {Object} Access token response
 */
export const exchangePublicToken = async (publicToken) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    const request = {
      public_token: publicToken
    };

    const response = await plaidClient.itemPublicTokenExchange(request);

    await executionLogService.log('plaid.access_token.exchanged', {
      accessTokenId: response.data.access_token ? '***' + response.data.access_token.slice(-8) : 'missing',
      itemId: response.data.item_id
    });

    return response.data;
  } catch (error) {
    await executionLogService.logError('plaid.access_token.exchange.failed', error, {
      publicToken: publicToken ? '***' + publicToken.slice(-8) : 'missing'
    });
    throw new Error(`Failed to exchange public token: ${error.message}`);
  }
};

/**
 * Get all transactions for an access token
 * @param {string} accessToken - Plaid access token
 * @returns {Array} Array of transactions
 */
export const getTransactions = async (accessToken) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    let allTransactions = [];
    let hasMore = true;
    let cursor = null;

    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor: cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;
      
      allTransactions = allTransactions.concat(data.added);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }
    
    const transactions = allTransactions.map(txn => ({
      id: txn.transaction_id,
      amount: txn.amount,
      date: txn.date,
      description: txn.name,
      category: txn.personal_finance_category?.[0] || 'Uncategorized',
      accountId: txn.account_id,
      pending: txn.pending,
      merchantName: txn.merchant_name,
      paymentChannel: txn.payment_channel,
      transactionType: txn.transaction_type
    }));

    await executionLogService.log('plaid.transactions.fetched', {
      transactionCount: transactions.length,
    });

    return transactions;
  } catch (error) {
    await executionLogService.logError('plaid.transactions.fetch.failed', error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
};

/**
 * Sync transactions for an account
 * @param {string} accessToken - Plaid access token
 * @param {string} accountId - Account identifier
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Array of transactions
 */
export const syncTransactions = async (accessToken, accountId, startDate, endDate) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    if (!accessToken || !accountId) {
      throw new Error('Access token and account ID are required');
    }

    const request = {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        account_ids: [accountId],
        include_personal_finance_category: true
      }
    };

    const response = await plaidClient.transactionsGet(request);

    const transactions = response.data.transactions.map(txn => ({
      id: txn.transaction_id,
      amount: txn.amount,
      date: txn.date,
      description: txn.name,
      category: txn.personal_finance_category?.[0] || 'Uncategorized',
      accountId: txn.account_id,
      pending: txn.pending,
      merchantName: txn.merchant_name,
      paymentChannel: txn.payment_channel,
      transactionType: txn.transaction_type
    }));

    await executionLogService.log('plaid.transactions.synced', {
      accountId,
      transactionCount: transactions.length,
      dateRange: `${startDate} to ${endDate}`
    });

    return transactions;
  } catch (error) {
    await executionLogService.logError('plaid.transactions.sync.failed', error, {
      accountId,
      startDate,
      endDate
    });
    throw new Error(`Failed to sync transactions: ${error.message}`);
  }
};

/**
 * Sync account balances
 * @param {string} accessToken - Plaid access token
 * @param {string} accountId - Account identifier
 * @returns {Object} Account balance information
 */
export const syncBalances = async (accessToken, accountId) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    if (!accessToken || !accountId) {
      throw new Error('Access token and account ID are required');
    }

    const request = {
      access_token: accessToken,
      options: {
        account_ids: [accountId]
      }
    };

    const response = await plaidClient.accountsBalanceGet(request);

    const account = response.data.accounts.find(acc => acc.account_id === accountId);
    
    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    const balance = {
      available: account.balances.available,
      current: account.balances.current,
      currency: account.balances.iso_currency_code,
      accountName: account.name,
      accountType: account.type,
      accountSubtype: account.subtype
    };

    await executionLogService.log('plaid.balances.synced', {
      accountId,
      accountName: account.name,
      available: balance.available,
      current: balance.current,
      currency: balance.currency
    });

    return balance;
  } catch (error) {
    await executionLogService.logError('plaid.balances.sync.failed', error, {
      accountId
    });
    throw new Error(`Failed to sync balances: ${error.message}`);
  }
};

/**
 * Get all accounts for a user
 * @param {string} accessToken - Plaid access token
 * @returns {Array} Array of accounts
 */
export const getAccounts = async (accessToken) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const request = {
      access_token: accessToken
    };

    const response = await plaidClient.accountsGet(request);

    const accounts = response.data.accounts.map(account => ({
      id: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      mask: account.mask,
      balances: {
        available: account.balances.available,
        current: account.balances.current,
        currency: account.balances.iso_currency_code
      }
    }));

    await executionLogService.log('plaid.accounts.retrieved', {
      accountCount: accounts.length
    });

    return accounts;
  } catch (error) {
    await executionLogService.logError('plaid.accounts.retrieval.failed', error);
    throw new Error(`Failed to get accounts: ${error.message}`);
  }
};

/**
 * Handle Plaid webhook events
 * @param {Object} event - Webhook event data
 * @returns {Object} Processing result
 */
export const handleWebhook = async (event) => {
  try {
    if (!event || !event.webhook_type) {
      throw new Error('Invalid webhook event');
    }

    await executionLogService.log('plaid.webhook.received', {
      webhookType: event.webhook_type,
      webhookCode: event.webhook_code,
      itemId: event.item_id,
      timestamp: new Date().toISOString()
    });

    // Handle different webhook types
    switch (event.webhook_type) {
      case 'TRANSACTIONS':
        if (event.webhook_code === 'INITIAL_UPDATE' || event.webhook_code === 'HISTORICAL_UPDATE') {
          // Trigger transaction sync
          await executionLogService.log('plaid.webhook.transactions.update', {
            itemId: event.item_id,
            webhookCode: event.webhook_code
          });
        }
        break;
      
      case 'ITEM':
        if (event.webhook_code === 'ERROR') {
          await executionLogService.logError('plaid.webhook.item.error', new Error('Plaid item error'), {
            itemId: event.item_id,
            error: event.error
          });
        }
        break;
      
      default:
        await executionLogService.log('plaid.webhook.unhandled', {
          webhookType: event.webhook_type,
          webhookCode: event.webhook_code
        });
    }

    return { status: 'webhook_processed', webhookType: event.webhook_type };
  } catch (error) {
    await executionLogService.logError('plaid.webhook.processing.failed', error, {
      webhookType: event.webhook_type,
      webhookCode: event.webhook_code
    });
    throw new Error(`Failed to process webhook: ${error.message}`);
  }
};

/**
 * Revoke access token
 * @param {string} accessToken - Plaid access token to revoke
 * @returns {Object} Revocation result
 */
export const revokeAccessToken = async (accessToken) => {
  try {
    if (!plaidClient) {
      throw new Error('Plaid client not initialized');
    }

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const request = {
      access_token: accessToken
    };

    await plaidClient.itemAccessTokenInvalidate(request);

    await executionLogService.log('plaid.access_token.revoked', {
      accessTokenId: accessToken ? '***' + accessToken.slice(-8) : 'missing'
    });

    return { status: 'access_token_revoked' };
  } catch (error) {
    await executionLogService.logError('plaid.access_token.revocation.failed', error);
    throw new Error(`Failed to revoke access token: ${error.message}`);
  }
}; 
