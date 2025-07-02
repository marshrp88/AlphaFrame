/**
 * PlaidService.js - Phase 5 Production Integration
 * 
 * Purpose: Real Plaid API integration for secure bank data synchronization
 * with comprehensive error handling, logging, and production support.
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

import { 
  initializePlaid, 
  createLinkToken, 
  exchangePublicToken, 
  getAccounts, 
  getTransactions, 
  syncBalances,
  revokeAccessToken 
} from './syncEngine.js';
import { config } from '../config.js';
import executionLogService from '../../core/services/ExecutionLogService.js';

class PlaidService {
  constructor() {
    this.baseUrl = null;
    this.clientId = config.plaid.clientId;
    this.secret = config.plaid.secret;
    this.env = config.plaid.env;
    this.accessToken = null;
    this.itemId = null;
    this.accounts = [];
    this.transactions = [];
    this.lastSync = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Plaid client
   * @returns {Promise<boolean>} Initialization success
   */
  async initialize() {
    try {
      if (!this.clientId || !this.secret) {
        throw new Error('Plaid credentials are required. Please check your environment configuration.');
      }

      await initializePlaid(this.clientId, this.secret, this.env);
      this.isInitialized = true;

      await executionLogService.log('plaid.service.initialized', {
        environment: this.env,
        clientId: this.clientId ? '***' + this.clientId.slice(-4) : 'missing',
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      await executionLogService.logError('plaid.service.initialization.failed', error, {
        environment: this.env,
        clientId: this.clientId ? '***' + this.clientId.slice(-4) : 'missing'
      });
      throw new Error(`Failed to initialize Plaid service: ${error.message}`);
    }
  }

  /**
   * Initialize Plaid Link for bank account connection
   * @param {string} userId - User identifier for token generation
   * @returns {Promise<Object>} Link token and metadata
   */
  async createLinkToken(userId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const linkTokenResponse = await createLinkToken(userId, 'AlphaFrame');
      
      await executionLogService.log('plaid.link_token.created', {
        userId,
        linkTokenId: linkTokenResponse.link_token ? '***' + linkTokenResponse.link_token.slice(-8) : 'missing'
      });

      return linkTokenResponse;
    } catch (error) {
      await executionLogService.logError('plaid.link_token.creation.failed', error, { userId });
      throw new Error(`Failed to create link token: ${error.message}`);
    }
  }

  /**
   * Exchange public token for access token
   * @param {string} publicToken - Token from Plaid Link success
   * @returns {Promise<Object>} Access token and account information
   */
  async exchangePublicToken(publicToken) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const tokenResponse = await exchangePublicToken(publicToken);
      
      // Store access token and item ID
      this.accessToken = tokenResponse.access_token;
      this.itemId = tokenResponse.item_id;
      
      // Store in localStorage for persistence
      localStorage.setItem('plaid_access_token', this.accessToken);
      localStorage.setItem('plaid_item_id', this.itemId);
      
      await executionLogService.log('plaid.access_token.exchanged', {
        accessTokenId: this.accessToken ? '***' + this.accessToken.slice(-8) : 'missing',
        itemId: this.itemId
      });

      return tokenResponse;
    } catch (error) {
      await executionLogService.logError('plaid.access_token.exchange.failed', error, {
        publicToken: publicToken ? '***' + publicToken.slice(-8) : 'missing'
      });
      throw new Error(`Failed to exchange public token: ${error.message}`);
    }
  }

  /**
   * Fetch user's bank accounts
   * @returns {Promise<Array>} Array of account objects
   */
  async fetchAccounts() {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available. Please connect your bank account first.');
      }

      const accountsData = await getAccounts(this.accessToken);
      this.accounts = accountsData;
      
      await executionLogService.log('plaid.accounts.fetched', {
        accountCount: accountsData.length,
        accounts: accountsData.map(acc => ({
          id: acc.account_id,
          name: acc.name,
          type: acc.type,
          subtype: acc.subtype
        }))
      });

      return accountsData;
    } catch (error) {
      await executionLogService.logError('plaid.accounts.fetch.failed', error);
      throw new Error(`Failed to fetch accounts: ${error.message}`);
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
    try {
      if (!this.accessToken) {
        throw new Error('No access token available. Please connect your bank account first.');
      }

      const transactionsData = await getTransactions(this.accessToken);
      
      // Filter by date range if provided
      let filteredTransactions = transactionsData;
      if (startDate && endDate) {
        filteredTransactions = transactionsData.filter(txn => 
          txn.date >= startDate && txn.date <= endDate
        );
      }
      
      // Filter by account IDs if provided
      if (accountIds && accountIds.length > 0) {
        filteredTransactions = filteredTransactions.filter(txn =>
          accountIds.includes(txn.accountId)
        );
      }
      
      this.transactions = filteredTransactions;
      this.lastSync = new Date().toISOString();
      
      await executionLogService.log('plaid.transactions.fetched', {
        totalTransactions: transactionsData.length,
        filteredTransactions: filteredTransactions.length,
        dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'all',
        accountFilter: accountIds ? accountIds.length : 'all'
      });

      return filteredTransactions;
    } catch (error) {
      await executionLogService.logError('plaid.transactions.fetch.failed', error, {
        startDate,
        endDate,
        accountIds
      });
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  /**
   * Get cached transactions or fetch new ones if needed
   * @param {number} daysBack - Number of days to look back
   * @returns {Promise<Array>} Array of transactions
   */
  async getTransactions(daysBack = 30) {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available. Please connect your bank account first.');
      }

      // Calculate date range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - (daysBack * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      
      return await this.fetchTransactions(startDate, endDate);
    } catch (error) {
      await executionLogService.logError('plaid.transactions.get.failed', error, { daysBack });
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }

  /**
   * Get account summary information
   * @returns {Object} Account summary with balances and metadata
   */
  async getAccountSummary() {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available. Please connect your bank account first.');
      }

      const accounts = await this.fetchAccounts();
      const summary = {
        totalAccounts: accounts.length,
        totalBalance: 0,
        accounts: [],
        lastSync: this.lastSync
      };

      for (const account of accounts) {
        const balance = await syncBalances(this.accessToken, account.account_id);
        summary.accounts.push({
          id: account.account_id,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          balance: balance.current,
          available: balance.available
        });
        summary.totalBalance += balance.current || 0;
      }

      await executionLogService.log('plaid.account_summary.fetched', {
        totalAccounts: summary.totalAccounts,
        totalBalance: summary.totalBalance,
        lastSync: summary.lastSync
      });

      return summary;
    } catch (error) {
      await executionLogService.logError('plaid.account_summary.fetch.failed', error);
      throw new Error(`Failed to get account summary: ${error.message}`);
    }
  }

  /**
   * Disconnect bank account and clear stored data
   * @returns {Promise<boolean>} Success status
   */
  async disconnectAccount() {
    try {
      if (this.accessToken) {
        await revokeAccessToken(this.accessToken);
      }
      
      // Clear stored data
      this.accessToken = null;
      this.itemId = null;
      this.accounts = [];
      this.transactions = [];
      this.lastSync = null;
      
      // Clear localStorage
      localStorage.removeItem('plaid_access_token');
      localStorage.removeItem('plaid_item_id');
      
      await executionLogService.log('plaid.account.disconnected', {
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      await executionLogService.logError('plaid.account.disconnect.failed', error);
      throw new Error(`Failed to disconnect account: ${error.message}`);
    }
  }

  /**
   * Check if bank account is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return !!(this.accessToken || localStorage.getItem('plaid_access_token'));
  }

  /**
   * Get connection status with details
   * @returns {Object} Connection status and metadata
   */
  getConnectionStatus() {
    const hasStoredToken = !!localStorage.getItem('plaid_access_token');
    const hasStoredItemId = !!localStorage.getItem('plaid_item_id');
    
    return {
      connected: this.isConnected(),
      accountsCount: this.accounts.length,
      transactionsCount: this.transactions.length,
      lastSync: this.lastSync,
      accountSummary: this.accounts.length > 0 ? {
        totalAccounts: this.accounts.length,
        totalBalance: this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
      } : null,
      status: this.isConnected() ? 'connected' : 'disconnected',
      hasStoredToken,
      hasStoredItemId
    };
  }

  /**
   * Load stored access token
   * @returns {Promise<boolean>} Success status
   */
  async loadStoredAccessToken() {
    try {
      const storedToken = localStorage.getItem('plaid_access_token');
      const storedItemId = localStorage.getItem('plaid_item_id');
      
      if (storedToken && storedItemId) {
        this.accessToken = storedToken;
        this.itemId = storedItemId;
        
        // Verify token is still valid by fetching accounts
        await this.fetchAccounts();
        
        await executionLogService.log('plaid.stored_token.loaded', {
          itemId: this.itemId,
          accountCount: this.accounts.length
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      await executionLogService.logError('plaid.stored_token.load.failed', error);
      
      // Clear invalid stored data
      this.clearAccessToken();
      
      return false;
    }
  }

  /**
   * Clear access token
   */
  clearAccessToken() {
    this.accessToken = null;
    this.itemId = null;
    localStorage.removeItem('plaid_access_token');
    localStorage.removeItem('plaid_item_id');
  }

  /**
   * Get sandbox credentials for testing
   * @returns {Object} Sandbox credentials
   */
  getSandboxCredentials() {
    if (this.env !== 'sandbox') {
      throw new Error('Sandbox credentials are only available in sandbox environment');
    }
    
    return {
      username: 'user_good',
      password: 'pass_good',
      institution: 'ins_109508'
    };
  }
}

export default PlaidService; 