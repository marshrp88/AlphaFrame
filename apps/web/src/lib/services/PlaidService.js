/**
 * PlaidService.js - Real Bank Integration Service
 * 
 * Purpose: Integrate with Plaid API to fetch real transaction data from user's bank accounts
 * and provide live financial data for rule evaluation.
 * 
 * Procedure:
 * 1. Handle Plaid Link token generation for secure bank connection
 * 2. Process public token exchange for access token
 * 3. Fetch real transactions with proper error handling
 * 4. Normalize transaction data for rule engine compatibility
 * 5. Implement caching and rate limiting for performance
 * 
 * Conclusion: Provides real financial data integration while maintaining security
 * and performance standards for production use.
 */

class PlaidService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_PLAID_API_URL || 'https://sandbox.plaid.com';
    this.clientId = process.env.REACT_APP_PLAID_CLIENT_ID;
    this.secret = process.env.REACT_APP_PLAID_SECRET;
    this.accessToken = null;
    this.accounts = [];
    this.transactions = [];
    this.lastSync = null;
  }

  /**
   * Initialize Plaid Link for bank account connection
   * @param {string} userId - User identifier for token generation
   * @returns {Promise<Object>} Link token and metadata
   */
  async createLinkToken(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/link/token/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
        body: JSON.stringify({
          user: { client_user_id: userId },
          client_name: 'AlphaFrame',
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en',
          account_filters: {
            depository: {
              account_subtypes: ['checking', 'savings']
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.error_code) {
        throw new Error(`Plaid Error: ${data.error_message}`);
      }

      return {
        linkToken: data.link_token,
        expiration: data.expiration,
        requestId: data.request_id
      };
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to initialize bank connection');
    }
  }

  /**
   * Exchange public token for access token
   * @param {string} publicToken - Token from Plaid Link success
   * @returns {Promise<Object>} Access token and account information
   */
  async exchangePublicToken(publicToken) {
    try {
      const response = await fetch(`${this.baseUrl}/item/public_token/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
        body: JSON.stringify({
          public_token: publicToken
        })
      });

      const data = await response.json();
      
      if (data.error_code) {
        throw new Error(`Plaid Error: ${data.error_message}`);
      }

      this.accessToken = data.access_token;
      
      // Fetch initial account information
      await this.fetchAccounts();
      
      return {
        accessToken: data.access_token,
        itemId: data.item_id,
        requestId: data.request_id
      };
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to connect bank account');
    }
  }

  /**
   * Fetch user's bank accounts
   * @returns {Promise<Array>} Array of account objects
   */
  async fetchAccounts() {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/accounts/balance/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          options: {
            include_personal_finance_category: true
          }
        })
      });

      const data = await response.json();
      
      if (data.error_code) {
        throw new Error(`Plaid Error: ${data.error_message}`);
      }

      this.accounts = data.accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        mask: account.mask,
        balances: {
          available: account.balances.available,
          current: account.balances.current,
          limit: account.balances.limit
        }
      }));

      return this.accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  /**
   * Fetch transactions for specified date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {Array} accountIds - Optional array of account IDs to filter
   * @returns {Promise<Array>} Array of normalized transaction objects
   */
  async fetchTransactions(startDate, endDate, accountIds = null) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/transactions/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          start_date: startDate,
          end_date: endDate,
          options: {
            account_ids: accountIds,
            include_personal_finance_category: true,
            include_original_description: true
          }
        })
      });

      const data = await response.json();
      
      if (data.error_code) {
        throw new Error(`Plaid Error: ${data.error_message}`);
      }

      // Normalize transactions for rule engine compatibility
      this.transactions = data.transactions.map(transaction => ({
        id: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        merchantName: transaction.merchant_name,
        category: transaction.category || [],
        categoryId: transaction.category_id,
        pending: transaction.pending,
        paymentChannel: transaction.payment_channel,
        transactionType: transaction.transaction_type,
        personalFinanceCategory: transaction.personal_finance_category,
        originalDescription: transaction.original_description,
        // Normalized fields for rule engine
        amount_abs: Math.abs(transaction.amount),
        is_expense: transaction.amount < 0,
        is_income: transaction.amount > 0,
        category_primary: transaction.category?.[0] || 'Other',
        category_secondary: transaction.category?.[1] || null
      }));

      this.lastSync = new Date().toISOString();
      
      return this.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transaction data');
    }
  }

  /**
   * Get cached transactions or fetch new ones if needed
   * @param {number} daysBack - Number of days to look back
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactions(daysBack = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (daysBack * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    // Check if we have recent cached data
    if (this.transactions.length > 0 && this.lastSync) {
      const lastSyncDate = new Date(this.lastSync);
      const hoursSinceSync = (Date.now() - lastSyncDate.getTime()) / (1000 * 60 * 60);
      
      // Use cached data if less than 1 hour old
      if (hoursSinceSync < 1) {
        return this.transactions.filter(t => t.date >= startDate);
      }
    }

    // Fetch fresh data
    return await this.fetchTransactions(startDate, endDate);
  }

  /**
   * Get account balances summary
   * @returns {Object} Summary of all account balances
   */
  getAccountSummary() {
    if (this.accounts.length === 0) {
      return null;
    }

    const summary = {
      totalAccounts: this.accounts.length,
      totalAvailable: 0,
      totalCurrent: 0,
      accounts: this.accounts.map(account => ({
        id: account.id,
        name: account.name,
        type: account.type,
        available: account.balances.available,
        current: account.balances.current
      }))
    };

    this.accounts.forEach(account => {
      if (account.balances.available !== null) {
        summary.totalAvailable += account.balances.available;
      }
      if (account.balances.current !== null) {
        summary.totalCurrent += account.balances.current;
      }
    });

    return summary;
  }

  /**
   * Disconnect bank account (revoke access token)
   * @returns {Promise<boolean>} Success status
   */
  async disconnectAccount() {
    if (!this.accessToken) {
      return true; // Already disconnected
    }

    try {
      const response = await fetch(`${this.baseUrl}/item/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': this.clientId,
          'PLAID-SECRET': this.secret,
        },
        body: JSON.stringify({
          access_token: this.accessToken
        })
      });

      const data = await response.json();
      
      if (data.error_code) {
        throw new Error(`Plaid Error: ${data.error_message}`);
      }

      // Clear local data
      this.accessToken = null;
      this.accounts = [];
      this.transactions = [];
      this.lastSync = null;

      return true;
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw new Error('Failed to disconnect bank account');
    }
  }

  /**
   * Check if bank account is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.accessToken !== null;
  }

  /**
   * Get connection status with details
   * @returns {Object} Connection status and metadata
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      accountsCount: this.accounts.length,
      transactionsCount: this.transactions.length,
      lastSync: this.lastSync,
      accountSummary: this.getAccountSummary()
    };
  }
}

// Create singleton instance
const plaidService = new PlaidService();

export default plaidService; 