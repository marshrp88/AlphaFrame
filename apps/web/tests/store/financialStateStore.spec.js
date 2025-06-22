import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Helper to wait for Zustand persist to flush
async function waitForPersistedValue(key, expected, timeout = 1000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (expected && JSON.stringify(parsed.state) === JSON.stringify(expected)) {
          return parsed;
        } else if (!expected) {
          return parsed;
        }
      } catch (e) {
        // Continue polling if JSON parse fails
      }
    }
    await new Promise(res => setTimeout(res, 10));
  }
  throw new Error(`Persisted state for key "${key}" not found after ${timeout}ms`);
}

// Dynamic import after mocking
let useFinancialStateStore;
let localStorageMock;
let sessionStorageMock;

describe('Financial State Store', () => {
  beforeEach(async () => {
    // Per-test localStorage mock
    const localStore = {};
    localStorageMock = {
      getItem: vi.fn((key) => localStore[key] || null),
      setItem: vi.fn((key, val) => { localStore[key] = val; }),
      removeItem: vi.fn((key) => { delete localStore[key]; }),
      clear: vi.fn(() => { Object.keys(localStore).forEach(key => delete localStore[key]); }),
    };
    global.localStorage = localStorageMock;
    if (typeof window !== 'undefined') window.localStorage = localStorageMock;

    // Per-test sessionStorage mock
    const sessionStore = {};
    sessionStorageMock = {
      getItem: vi.fn((key) => sessionStore[key] || null),
      setItem: vi.fn((key, val) => { sessionStore[key] = val; }),
      removeItem: vi.fn((key) => { delete sessionStore[key]; }),
      clear: vi.fn(() => { Object.keys(sessionStore).forEach(key => delete sessionStore[key]); }),
    };
    global.sessionStorage = sessionStorageMock;
    if (typeof window !== 'undefined') window.sessionStorage = sessionStorageMock;

    // Re-import the store after mocking to ensure Zustand uses mocked localStorage
    const module = await import('@/core/store/financialStateStore');
    useFinancialStateStore = module.useFinancialStateStore;
    // Reset store state
    useFinancialStateStore.setState({
      accounts: {},
      goals: {},
      budgets: {}
    });
    // Clear localStorage mock data
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  describe('Account Management', () => {
    it('should set and get account balance', async () => {
      const accountId = 'acc_123';
      const balance = 1000;
      useFinancialStateStore.getState().setAccountBalance(accountId, balance);
      expect(useFinancialStateStore.getState().getAccountBalance(accountId)).toBe(balance);
    });
    it('should return 0 for non-existent account', async () => {
      expect(useFinancialStateStore.getState().getAccountBalance('non_existent')).toBe(0);
    });
  });

  describe('Goal Management', () => {
    it('should set and get goal', async () => {
      const goalId = 'goal_123';
      const goal = {
        name: 'Test Goal',
        targetAmount: 5000,
        currentAmount: 1000,
        deadline: '2024-12-31'
      };
      useFinancialStateStore.getState().setGoal(goalId, goal);
      expect(useFinancialStateStore.getState().getGoal(goalId)).toEqual(goal);
    });
    it('should update goal progress', async () => {
      const goalId = 'goal_123';
      const goal = {
        name: 'Test Goal',
        targetAmount: 5000,
        currentAmount: 1000,
        deadline: '2024-12-31'
      };
      useFinancialStateStore.getState().setGoal(goalId, goal);
      useFinancialStateStore.getState().updateGoalProgress(goalId, 500);
      expect(useFinancialStateStore.getState().getGoal(goalId).currentAmount).toBe(1500);
    });
  });

  describe('Budget Management', () => {
    it('should set and record spending', async () => {
      const categoryId = 'cat_123';
      const budget = {
        name: 'Test Budget',
        limit: 500,
        spent: 100
      };
      useFinancialStateStore.getState().setBudget(categoryId, budget);
      useFinancialStateStore.getState().recordSpending(categoryId, 50);
      const updatedBudget = useFinancialStateStore.getState().budgets[categoryId];
      expect(updatedBudget.spent).toBe(150);
    });
    it('should reset monthly budgets', async () => {
      const categoryId = 'cat_123';
      const budget = {
        name: 'Test Budget',
        limit: 500,
        spent: 300
      };
      useFinancialStateStore.getState().setBudget(categoryId, budget);
      useFinancialStateStore.getState().resetMonthlyBudgets();
      const resetBudget = useFinancialStateStore.getState().budgets[categoryId];
      expect(resetBudget.spent).toBe(0);
    });
  });

  describe('Persistence', () => {
    it.skip('should persist accounts, goals, and budgets', async () => {
      const spy = vi.spyOn(localStorageMock, 'setItem');
      const accountId = 'acc_123';
      const goalId = 'goal_123';
      const categoryId = 'cat_123';
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
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(spy).toHaveBeenCalledWith(
        'financial-state',
        expect.stringContaining('"accounts":{"acc_123":1000}')
      );
      const persisted = await waitForPersistedValue('financial-state');
      expect(persisted.state.accounts[accountId]).toBe(1000);
      expect(persisted.state.goals[goalId].name).toBe('Test Goal');
      expect(persisted.state.budgets[categoryId].name).toBe('Test Budget');
    });
  });
}); 
