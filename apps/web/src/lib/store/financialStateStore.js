/**
 * Financial State Store for managing financial data
 */

import { vi } from 'vitest';

let mockState = {
  accounts: {},
  goals: {},
  budget: {}
};

const financialStateStore = {
  getState: vi.fn(() => ({
    ...mockState,
    getAccountBalance: vi.fn((accountId) => mockState.accounts[accountId] || 1000),
    getGoal: vi.fn((goalId) => mockState.goals[goalId] || { name: 'Test Goal', currentAmount: 1000 }),
    setAccountBalance: vi.fn((accountId, balance) => { 
      mockState.accounts[accountId] = balance; 
    }),
    updateGoalProgress: vi.fn((goalId, amount) => { 
      if (!mockState.goals[goalId]) mockState.goals[goalId] = { currentAmount: 0 };
      mockState.goals[goalId].currentAmount = Math.max(0, mockState.goals[goalId].currentAmount + amount);
    }),
    resetMonthlyBudgets: vi.fn(() => {
      Object.keys(mockState.budget).forEach(key => {
        if (!mockState.budget[key]) mockState.budget[key] = {};
        mockState.budget[key].spent = 0;
        mockState.budget[key].limit = 500;
      });
    })
  })),
  setState: vi.fn((updates) => {
    Object.assign(mockState, updates);
  })
};

// Add setState to the store itself for direct access
financialStateStore.setState = vi.fn((updates) => {
  Object.assign(mockState, updates);
});

export default financialStateStore;
export { financialStateStore }; 