/**
 * Financial State Store for managing financial data
 */

import { create } from 'zustand';

export const useFinancialStateStore = create((set, get) => ({
  // Account balances
  accounts: {},

  // Goals
  goals: {},

  // Budgets
  budgets: {},

  // Actions
  setAccountBalance: (accountId, balance) => set(state => ({
    accounts: {
      ...state.accounts,
      [accountId]: balance
    }
  })),

  getAccountBalance: (accountId) => {
    const state = get();
    return state.accounts[accountId] || 0;
  },

  setGoal: (goalId, goal) => set(state => ({
    goals: {
      ...state.goals,
      [goalId]: goal
    }
  })),

  getGoal: (goalId) => {
    const state = get();
    return state.goals[goalId] || null;
  },

  setBudget: (category, amount) => set(state => ({
    budgets: {
      ...state.budgets,
      [category]: amount
    }
  })),

  getBudget: (category) => {
    const state = get();
    return state.budgets[category] || 0;
  }
}));

export default useFinancialStateStore; 