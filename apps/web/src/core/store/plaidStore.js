/**
 * plaidStore.js
 * 
 * Purpose: Centralized state management for Plaid integration
 * 
 * This store manages:
 * - Plaid connection status and account information
 * - Transaction data and synchronization state
 * - Error handling and loading states
 * - Secure token management
 * 
 * Integration:
 * - Connects to PlaidService for API operations
 * - Integrates with financialStateStore for transaction processing
 * - Provides reactive state updates for UI components
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import plaidService from '../../lib/services/PlaidService.js';
import { useFinancialStateStore } from './financialStateStore.js';

const usePlaidStore = create(
  subscribeWithSelector((set, get) => ({
    // Connection State
    isConnected: false,
    isConnecting: false,
    connectionError: null,
    
    // Account Information
    accounts: [],
    selectedAccountId: null,
    
    // Transaction Data
    transactions: [],
    lastSyncDate: null,
    isSyncing: false,
    syncError: null,
    
    // Token Management
    accessToken: null,
    itemId: null,
    
    // UI State
    isLoading: false,
    error: null,

    /**
     * Initialize Plaid connection from stored token
     */
    initializeConnection: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const hasToken = await plaidService.loadStoredAccessToken();
        
        if (hasToken) {
          // Verify token is still valid by fetching account balances
          const balanceResult = await plaidService.getAccountBalances();
          
          if (balanceResult.success) {
            set({
              isConnected: true,
              accounts: balanceResult.accounts,
              accessToken: plaidService.accessToken,
              isLoading: false
            });
            
            // Load recent transactions
            get().syncTransactions();
          } else {
            // Token is invalid, clear it
            get().disconnect();
          }
        }
      } catch (error) {
        set({
          error: error.message,
          isLoading: false
        });
      }
    },

    /**
     * Connect to Plaid with success callback data
     */
    connect: async (connectionData) => {
      set({ isConnecting: true, connectionError: null });
      
      try {
        const { accessToken, itemId, accounts } = connectionData;
        
        set({
          isConnected: true,
          isConnecting: false,
          accessToken,
          itemId,
          accounts: accounts || [],
          selectedAccountId: accounts?.[0]?.account_id || null,
          connectionError: null
        });
        
        // Sync transactions after successful connection
        get().syncTransactions();
      } catch (error) {
        set({
          isConnecting: false,
          connectionError: error.message
        });
      }
    },

    /**
     * Disconnect from Plaid and clear all data
     */
    disconnect: () => {
      plaidService.clearAccessToken();
      
      set({
        isConnected: false,
        isConnecting: false,
        connectionError: null,
        accounts: [],
        selectedAccountId: null,
        transactions: [],
        lastSyncDate: null,
        isSyncing: false,
        syncError: null,
        accessToken: null,
        itemId: null,
        error: null
      });
    },

    /**
     * Sync transactions from Plaid
     */
    syncTransactions: async (startDate = null, endDate = null) => {
      if (!get().isConnected) {
        return;
      }
      
      set({ isSyncing: true, syncError: null });
      
      try {
        // Default to last 30 days if no dates provided
        const end = endDate || new Date().toISOString().split('T')[0];
        const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const result = await plaidService.getTransactions(
          start,
          end,
          get().selectedAccountId
        );
        
        if (result.success) {
          const processedTransactions = result.transactions.map(tx => ({
            id: tx.transaction_id,
            amount: tx.amount,
            date: tx.date,
            name: tx.name,
            category: tx.category?.[0] || 'Uncategorized',
            accountId: tx.account_id,
            pending: tx.pending,
            merchantName: tx.merchant_name,
            paymentChannel: tx.payment_channel,
            transactionType: tx.transaction_type
          }));
          
          set({
            transactions: processedTransactions,
            lastSyncDate: new Date().toISOString(),
            isSyncing: false
          });
          
          // Update financial state store with new transactions
          const financialStore = useFinancialStateStore.getState();
          financialStore.addTransactions(processedTransactions);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        set({
          syncError: error.message,
          isSyncing: false
        });
      }
    },

    /**
     * Select a specific account for transaction filtering
     */
    selectAccount: (accountId) => {
      set({ selectedAccountId: accountId });
      
      // Re-sync transactions for the selected account
      if (get().isConnected) {
        get().syncTransactions();
      }
    },

    /**
     * Get account balance for a specific account
     */
    getAccountBalance: (accountId) => {
      const account = get().accounts.find(acc => acc.account_id === accountId);
      return account ? {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code
      } : null;
    },

    /**
     * Get total balance across all accounts
     */
    getTotalBalance: () => {
      return get().accounts.reduce((total, account) => {
        const balance = account.balances.available || account.balances.current || 0;
        return total + balance;
      }, 0);
    },

    /**
     * Clear error state
     */
    clearError: () => {
      set({ error: null, connectionError: null, syncError: null });
    },

    /**
     * Get connection status summary
     */
    getConnectionStatus: () => {
      const state = get();
      return {
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        isSyncing: state.isSyncing,
        hasError: !!(state.error || state.connectionError || state.syncError),
        accountCount: state.accounts.length,
        transactionCount: state.transactions.length,
        lastSync: state.lastSyncDate
      };
    }
  }))
);

export default usePlaidStore; 