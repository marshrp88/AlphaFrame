import { describe, it, expect, beforeEach } from 'vitest';
import { useFinancialStateStore } from '../../../src/lib/store/financialStateStore';

describe('Financial State Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useFinancialStateStore.setState({
      accounts: {},
      goals: {},
      budgets: {}
    });
  });

  describe('Account Management', () => {
    it('should set and get account balance', () => {
      const accountId = 'acc_123';
      const balance = 1000;

      useFinancialStateStore.getState().setAccountBalance(accountId, balance);
      expect(useFinancialStateStore.getState().getAccountBalance(accountId)).toBe(balance);
    });

    it('should return 0 for non-existent account', () => {
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

    it('should set and get goal', () => {
      const goalId = 'goal_123';
      useFinancialStateStore.getState().setGoal(goalId, mockGoal);
      expect(useFinancialStateStore.getState().getGoal(goalId)).toEqual(mockGoal);
    });

    it('should return null for non-existent goal', () => {
      expect(useFinancialStateStore.getState().getGoal('non_existent')).toBeNull();
    });

    it('should update goal progress', () => {
      const goalId = 'goal_123';
      useFinancialStateStore.getState().setGoal(goalId, mockGoal);
      
      // Add to goal
      useFinancialStateStore.getState().updateGoalProgress(goalId, 500);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(1500);

      // Subtract from goal
      useFinancialStateStore.getState().updateGoalProgress(goalId, -300);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(1200);
    });

    it('should not allow negative goal progress', () => {
      const goalId = 'goal_123';
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

    it('should set and track budget spending', () => {
      const categoryId = 'cat_123';
      useFinancialStateStore.getState().setBudget(categoryId, mockBudget);
      
      // Record spending
      useFinancialStateStore.getState().recordSpending(categoryId, 100);
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(100);

      // Record more spending
      useFinancialStateStore.getState().recordSpending(categoryId, 50);
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(150);
    });

    it('should reset monthly budgets', () => {
      const categoryId = 'cat_123';
      useFinancialStateStore.getState().setBudget(categoryId, mockBudget);
      useFinancialStateStore.getState().recordSpending(categoryId, 100);

      // Reset budgets
      useFinancialStateStore.getState().resetMonthlyBudgets();
      expect(useFinancialStateStore.getState().budgets[categoryId].spent).toBe(0);
      expect(useFinancialStateStore.getState().budgets[categoryId].limit).toBe(mockBudget.limit);
    });
  });

  describe('Store Persistence', () => {
    it('should persist accounts, goals, and budgets', () => {
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

      // Get persisted state
      const persistedState = JSON.parse(localStorage.getItem('financial-state'));
      
      // Verify persisted data
      expect(persistedState.state.accounts[accountId]).toBe(1000);
      expect(persistedState.state.goals[goalId].name).toBe('Test Goal');
      expect(persistedState.state.budgets[categoryId].spent).toBe(100);
    });
  });
}); 