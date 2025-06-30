// CLUSTER 1 FIX: Enhanced storage mock BEFORE imports to prevent hanging on Zustand persistence
const mockStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, val) => { 
      store[key] = val; 
    }),
    removeItem: jest.fn((key) => { delete store[key] }),
    clear: jest.fn(() => { 
      store = {}; 
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });
Object.defineProperty(global, 'localStorage', { value: mockStorage });

import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';

describe('Financial State Store', () => {
  beforeEach(async () => {
    mockStorage.clear();
    jest.clearAllMocks();
    const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
    useFinancialStateStore.setState({
      accounts: [],
      rules: [],
      transactions: [],
      budget: {},
      goals: {},
      schemaVersion: "v1"
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Account Management', () => {
    it('should set and get account balance', async () => {
      const accountId = 'acc_123';
      const balance = 1000;

      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setAccountBalance(accountId, balance);
      expect(useFinancialStateStore.getState().getAccountBalance(accountId)).toBe(balance);
    });

    it('should return 0 for non-existent account', async () => {
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      expect(useFinancialStateStore.getState().getAccountBalance('non_existent')).toBe(0);
    });
  });

  describe('Goal Management', () => {
    const mockGoal = {
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 1000,
      deadline: '2024-12-31'
    };

    it('should set and get goal', async () => {
      const goalId = 'goal_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setGoal(goalId, mockGoal);
      expect(useFinancialStateStore.getState().getGoal(goalId)).toEqual(mockGoal);
    });

    it('should return null for non-existent goal', async () => {
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      expect(useFinancialStateStore.getState().getGoal('non_existent')).toBeNull();
    });

    it('should update goal progress', async () => {
      const goalId = 'goal_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setGoal(goalId, mockGoal);
      
      // Add to goal
      useFinancialStateStore.getState().updateGoalProgress(goalId, 500);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(1500);

      // Subtract from goal
      useFinancialStateStore.getState().updateGoalProgress(goalId, -300);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(1200);
    });

    it('should not allow negative goal progress', async () => {
      const goalId = 'goal_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setGoal(goalId, mockGoal);
      
      // Try to subtract more than current amount
      useFinancialStateStore.getState().updateGoalProgress(goalId, -2000);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(0);
    });
  });

  describe('Budget Management', () => {
    const mockBudget = {
      name: 'Groceries',
      limit: 500,
      spent: 0
    };

    it('should set and track budget spending', async () => {
      const categoryId = 'cat_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setBudget(categoryId, mockBudget);
      
      // Record spending
      useFinancialStateStore.getState().recordSpending(categoryId, 100);
      expect(useFinancialStateStore.getState().budget[categoryId].spent).toBe(100);

      // Record more spending
      useFinancialStateStore.getState().recordSpending(categoryId, 50);
      expect(useFinancialStateStore.getState().budget[categoryId].spent).toBe(150);
    });

    it('should reset monthly budgets', async () => {
      const categoryId = 'cat_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setBudget(categoryId, mockBudget);
      useFinancialStateStore.getState().recordSpending(categoryId, 100);

      // Reset budgets
      useFinancialStateStore.getState().resetMonthlyBudgets();
      expect(useFinancialStateStore.getState().budget[categoryId].spent).toBe(0);
      expect(useFinancialStateStore.getState().budget[categoryId].limit).toBe(mockBudget.limit);
    });
  });

  describe('Store Persistence', () => {
    it('should persist accounts, goals, and budgets', async () => {
      const spy = jest.spyOn(mockStorage, 'setItem');
      
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      
      const accountId = 'acc_123';
      const goalId = 'goal_123';
      const categoryId = 'cat_123';

      // Set some data
      useFinancialStateStore.getState().setAccountBalance(accountId, 1000);
      useFinancialStateStore.getState().setGoal(goalId, {
        name: 'Test Goal',
        targetAmount: 5000,
        currentAmount: 1000,
        deadline: '2024-12-31'
      });
      useFinancialStateStore.getState().setBudget(categoryId, {
        name: 'Test Budget',
        limit: 500,
        spent: 100
      });

      // Verify the data is in the store
      const storeState = useFinancialStateStore.getState();
      expect(storeState.getAccountBalance(accountId)).toBe(1000);
      expect(storeState.getGoal(goalId)).toEqual({
        name: 'Test Goal',
        targetAmount: 5000,
        currentAmount: 1000,
        deadline: '2024-12-31'
      });
      expect(storeState.budget[categoryId]).toEqual({
        name: 'Test Budget',
        limit: 500,
        spent: 100
      });

      // Check if persistence was attempted
      expect(spy).toHaveBeenCalled();
    });
  });
}); 
