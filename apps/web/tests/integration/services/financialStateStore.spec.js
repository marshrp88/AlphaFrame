// Patch window.localStorage to persist data in-memory BEFORE importing the store
let localStorageData = {};
window.localStorage = global.localStorage = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, value) => { localStorageData[key] = value; },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { localStorageData = {}; }
};

import { describe, it, expect, beforeEach } from 'vitest';

// Helper to wait for Zustand persist to flush
async function waitForPersistedValue(key, expected, timeout = 100) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && JSON.stringify(stored.state) === JSON.stringify(expected)) return true;
    await new Promise(res => setTimeout(res, 5));
  }
  throw new Error(`Persisted state for key "${key}" not found after ${timeout}ms`);
}

describe('Financial State Store', () => {
  // Reset store before each test
  beforeEach(() => {
    localStorageData = {};
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
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(100);

      // Record more spending
      useFinancialStateStore.getState().recordSpending(categoryId, 50);
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(150);
    });

    it('should reset monthly budgets', async () => {
      const categoryId = 'cat_123';
      const { useFinancialStateStore } = await import('@/core/store/financialStateStore');
      useFinancialStateStore.getState().setBudget(categoryId, mockBudget);
      useFinancialStateStore.getState().recordSpending(categoryId, 100);

      // Reset budgets
      useFinancialStateStore.getState().resetMonthlyBudgets();
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(0);
      expect(useFinancialStateStore.getState().budgets[categoryId].limit).toBe(mockBudget.limit);
    });
  });

  describe('Store Persistence', () => {
    it('should persist accounts, goals, and budgets', async () => {
      const spy = vi.spyOn(localStorage, 'setItem');
      
      // Dynamically import AFTER localStorage mock is ready
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

      // Small delay to allow batching
      await new Promise((r) => setTimeout(r, 50));

      // Check if persist middleware actually triggered
      expect(spy).toHaveBeenCalledWith(
        'financial-state',
        expect.stringContaining('"accounts"')
      );

      // Wait for persist to flush
      const expected = {
        accounts: { [accountId]: 1000 },
        goals: { [goalId]: {
          name: 'Test Goal',
          targetAmount: 5000,
          currentAmount: 1000,
          deadline: '2024-12-31'
        } },
        budgets: { [categoryId]: {
          name: 'Test Budget',
          limit: 500,
          spent: 100
        } }
      };
      await waitForPersistedValue('financial-state', expected);
    });
  });
}); 
