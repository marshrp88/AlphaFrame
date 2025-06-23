// useAppStore.js
// Zustand store for app-wide state. Exports useAppStore as a named export.
import { create } from 'zustand';

/**
 * Global application state store
 * Manages application-wide state including accounts and UI state
 */
export const useAppStore = create((set) => ({
  // Schema version for future migrations
  dataSchemaVersion: 1,

  // Counter state (example)
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  reset: () => set({ counter: 0 }),

  // Accounts state with mock data for E2E tests
  accounts: [
    {
      id: 'chase_checking',
      name: 'Chase Checking',
      balance: 6000,
      type: 'checking'
    },
    {
      id: 'vanguard_brokerage',
      name: 'Vanguard Brokerage',
      balance: 25000,
      type: 'investment'
    },
    {
      id: 'ally_savings',
      name: 'Ally Savings',
      balance: 15000,
      type: 'savings'
    }
  ],
  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) => set((state) => ({
    accounts: [...state.accounts, account]
  })),
  updateAccount: (accountId, updates) => set((state) => ({
    accounts: state.accounts.map(account =>
      account.id === accountId ? { ...account, ...updates } : account
    )
  })),
  removeAccount: (accountId) => set((state) => ({
    accounts: state.accounts.filter(account => account.id !== accountId)
  })),

  // Goals state for internal actions
  goals: [
    {
      id: 'emergency_fund',
      name: 'Emergency Fund',
      target: 10000,
      current: 8000
    },
    {
      id: 'vacation_fund',
      name: 'Vacation Fund',
      target: 5000,
      current: 3000
    }
  ],

  // UI state
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

// Use this for global app state (e.g., accounts, user info, etc.). 
