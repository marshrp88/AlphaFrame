// financialStateStore.js
// Zustand store for managing financial state
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Financial State Store - Manages global financial application state
 * 
 * Purpose: Centralizes financial data and state management across the application
 * Procedure: Uses Zustand to create a lightweight state store with financial data
 * Conclusion: Provides consistent access to financial state throughout the app
 */
export const useFinancialStateStore = create((set, get) => ({
  // Financial data state - ensure arrays are initialized
  accounts: [],
  transactions: [],
  balance: 0,
  budget: {},
  goals: {},
  
  // Loading states
  isLoading: false,
  isSyncing: false,
  
  // Actions
  setAccounts: (accounts) => set({ accounts: Array.isArray(accounts) ? accounts : [] }),
  setTransactions: (transactions) => set({ transactions: Array.isArray(transactions) ? transactions : [] }),
  setBalance: (balance) => set({ balance }),
  setBudget: (budget) => set({ budget }),
  setLoading: (isLoading) => set({ isLoading }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  
  // Account management
  setAccountBalance: (accountId, balance) => {
    set(state => {
      const accounts = Array.isArray(state.accounts) ? state.accounts : [];
      return {
        accounts: accounts.map(acc =>
          acc.id === accountId ? { ...acc, balance } : acc
        )
      };
    });
  },
  
  getAccountBalance: (accountId) => {
    const accounts = get().accounts;
    if (!Array.isArray(accounts)) return 0;
    const account = accounts.find(a => a.id === accountId);
    return account?.balance ?? 0;
  },
  
  // Goal management
  setGoal: (goalId, goal) => {
    set(state => ({
      goals: { ...state.goals, [goalId]: goal }
    }));
  },
  
  getGoal: (goalId) => {
    return get().goals[goalId] || null;
  },
  
  updateGoalProgress: (goalId, amount) => {
    set(state => {
      const goal = state.goals[goalId];
      if (!goal) return state;
      
      const newAmount = (goal.currentAmount || 0) + amount;
      if (newAmount < 0) return state; // Prevent negative progress
      
      return {
        goals: {
          ...state.goals,
          [goalId]: { ...goal, currentAmount: newAmount }
        }
      };
    });
  },
  
  // Budget management
  recordSpending: (categoryId, amount) => {
    set(state => {
      const currentBudget = state.budget[categoryId] || { spent: 0, limit: 0 };
      return {
        budget: {
          ...state.budget,
          [categoryId]: {
            ...currentBudget,
            spent: (currentBudget.spent || 0) + amount
          }
        }
      };
    });
  },
  
  resetMonthlyBudgets: () => {
    set(state => {
      const resetBudget = {};
      Object.keys(state.budget).forEach(categoryId => {
        resetBudget[categoryId] = {
          ...state.budget[categoryId],
          spent: 0
        };
      });
      return { budget: resetBudget };
    });
  },
  
  // Computed values
  getTotalBalance: () => {
    const accounts = get().accounts;
    if (!Array.isArray(accounts)) return 0;
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  },
  getRecentTransactions: () => {
    const transactions = get().transactions;
    if (!Array.isArray(transactions)) return [];
    return transactions.slice(0, 10);
  },
  
  // Property aliases for backward compatibility
  get budgets() {
    return get().budget;
  },
}));

// Export alias for backward compatibility
export const useFinancialState = useFinancialStateStore; 
