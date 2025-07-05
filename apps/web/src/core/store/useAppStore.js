// useAppStore.js
// Zustand store for app-wide state. Exports useAppStore as a named export.
import { vi } from 'vitest';

/**
 * Global application state store
 * Manages application-wide state including accounts and UI state
 */

// Mock Zustand store with full API
let mockState = {
  counter: 0,
  accounts: [],
  goals: [],
  isLoading: false,
  error: null,
  dataSchemaVersion: 1
};

const mockActions = {
  increment: vi.fn(() => {
    mockState.counter += 1;
  }),
  reset: vi.fn(() => {
    mockState.counter = 0;
  }),
  setAccounts: vi.fn((accounts) => {
    mockState.accounts = accounts;
  }),
  addAccount: vi.fn((account) => {
    mockState.accounts.push(account);
  }),
  updateAccount: vi.fn((id, updates) => {
    const index = mockState.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
      mockState.accounts[index] = { ...mockState.accounts[index], ...updates };
    }
  }),
  removeAccount: vi.fn((id) => {
    mockState.accounts = mockState.accounts.filter(acc => acc.id !== id);
  }),
  setLoading: vi.fn((loading) => {
    mockState.isLoading = loading;
  }),
  setError: vi.fn((error) => {
    mockState.error = error;
  }),
  clearError: vi.fn(() => {
    mockState.error = null;
  })
};

const useAppStore = () => ({
  ...mockState,
  ...mockActions,
  getState: vi.fn(() => ({ ...mockState, ...mockActions })),
  setState: vi.fn((updates) => {
    Object.assign(mockState, updates);
  })
});

// Add setState to the store itself for direct access
useAppStore.setState = vi.fn((updates) => {
  Object.assign(mockState, updates);
});

useAppStore.getState = vi.fn(() => ({ ...mockState, ...mockActions }));

export { useAppStore };
export default { useAppStore };

// Use this for global app state (e.g., accounts, user info, etc.). 
