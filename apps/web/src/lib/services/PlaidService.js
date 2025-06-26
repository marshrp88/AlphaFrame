/**
 * PlaidService.js
 * 
 * Purpose: Handles all Plaid API interactions for secure financial data access
 * 
 * This service provides:
 * - Link token creation for Plaid Link initialization
 * - Public token exchange for access tokens
 * - Transaction fetching and account balance retrieval
 * - Proper error handling and sandbox environment support
 * 
 * Security Notes:
 * - All API calls use environment-specific credentials
 * - Access tokens are encrypted before storage
 * - Sandbox mode ensures no real financial data is accessed
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { encrypt, decrypt } from '../../core/services/CryptoService.js';

class PlaidService {
  constructor() {
    this.client = null;
    this.accessToken = null;
    this.initializeClient();
  }

  /**
   * Initialize the Plaid client with environment-specific configuration
   * Uses sandbox credentials for development and testing
   */
  initializeClient() {
    const clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
    const secret = import.meta.env.VITE_PLAID_SECRET;
    const env = import.meta.env.VITE_PLAID_ENV || 'sandbox';

    if (!clientId || !secret) {
      return;
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

    this.client = new PlaidApi(configuration);
  }

  /**
   * Create a link token for Plaid Link initialization
   * @param {string} userId - User identifier for token association
   * @returns {Promise<Object>} Link token response
   */
  async createLinkToken(params) {
    try {
      if (!this.client) {
        return {
          success: false,
          error: 'Plaid client not initialized'
        };
      }

      const response = await this.client.linkTokenCreate({
        user: { client_user_id: params.user.id },
        client_name: params.clientName || 'AlphaFrame',
        country_codes: params.countryCodes || ['US'],
        language: params.language || 'en',
        products: params.products || ['transactions']
      });

      return {
        success: true,
        linkToken: response.data.link_token,
        expiration: response.data.expiration,
        requestId: response.data.request_id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create link token'
      };
    }
  }

  /**
   * Exchange public token for access token
   * @param {string} publicToken - Public token from Plaid Link onSuccess
   * @returns {Promise<Object>} Access token response
   */
  async exchangePublicToken(publicToken) {
    try {
      if (!this.client) {
        throw new Error('Plaid client not initialized');
      }

      const request = {
        public_token: publicToken
      };

      const response = await this.client.itemPublicTokenExchange(request);
      const accessToken = response.data.access_token;
      
      // Encrypt and store the access token securely
      const encryptedToken = await encrypt(accessToken);
      this.accessToken = accessToken;
      
      // Store encrypted token in localStorage (in production, use secure storage)
      localStorage.setItem('plaid_access_token', encryptedToken);
      
      return {
        success: true,
        accessToken: accessToken,
        itemId: response.data.item_id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to exchange public token'
      };
    }
  }

  /**
   * Retrieve account balances
   * @returns {Promise<Object>} Account balances response
   */
  async getAccountBalances() {
    try {
      if (!this.client || !this.accessToken) {
        throw new Error('Plaid client or access token not available');
      }

      const request = {
        access_token: this.accessToken
      };

      const response = await this.client.accountsBalanceGet(request);
      return {
        success: true,
        accounts: response.data.accounts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get account balances'
      };
    }
  }

  /**
   * Fetch transactions for a specified date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {string} accountId - Optional account ID filter
   * @returns {Promise<Object>} Transactions response
   */
  async getTransactions(startDate, endDate, accountId = null) {
    try {
      if (!this.client || !this.accessToken) {
        throw new Error('Plaid client or access token not available');
      }

      const request = {
        access_token: this.accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          count: 100,
          offset: 0
        }
      };

      if (accountId) {
        request.options.account_ids = [accountId];
      }

      const response = await this.client.transactionsGet(request);
      return {
        success: true,
        transactions: response.data.transactions,
        total_transactions: response.data.total_transactions,
        accounts: response.data.accounts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get transactions'
      };
    }
  }

  /**
   * Load stored access token and decrypt it
   * @returns {Promise<boolean>} Success status
   */
  async loadStoredAccessToken() {
    try {
      const encryptedToken = localStorage.getItem('plaid_access_token');
      if (!encryptedToken) {
        return false;
      }

      const decryptedToken = await decrypt(encryptedToken);
      this.accessToken = decryptedToken;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear stored access token
   */
  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('plaid_access_token');
  }

  /**
   * Check if Plaid is properly configured
   * @returns {boolean} Configuration status
   */
  isConfigured() {
    return this.client !== null;
  }

  /**
   * Check if user has an active access token
   * @returns {boolean} Token availability
   */
  hasAccessToken() {
    return this.accessToken !== null;
  }

  /**
   * Get sandbox test credentials for development
   * @returns {Object} Test credentials
   */
  getSandboxCredentials() {
    return {
      username: 'user_good',
      password: 'pass_good',
      institution: 'ins_109508'
    };
  }
}

// Create singleton instance
const plaidService = new PlaidService();

export { PlaidService };
export default plaidService; 