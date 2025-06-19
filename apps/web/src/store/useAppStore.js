// useAppStore.js
// Zustand store for app-wide state. Exports useAppStore as a named export.
import { create } from 'zustand';

/**
 * Global application state store
 * Manages application-wide state including accounts and UI state
 */
export const useAppStore = create((set) => ({
  // Counter state (example)
  counter: 0,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  reset: () => set({ counter: 0 }),

  // Accounts state
  accounts: [],
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

  // UI state
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

// Use this for global app state (e.g., accounts, user info, etc.). 
