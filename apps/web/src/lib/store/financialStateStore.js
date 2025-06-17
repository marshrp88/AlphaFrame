// financialStateStore.js
// Zustand store for managing financial state
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Financial State Store
 * Manages the financial state including account balances, goals, and budgets
 * Uses persist middleware to maintain state across page reloads
 */
export const useFinancialStateStore = create(
  persist(
    (set, get) => ({
      // Account balances
      accounts: {},
      
      /**
       * Sets the balance for a specific account
       * @param {string} accountId - The account identifier
       * @param {number} balance - The new balance
       */
      setAccountBalance: (accountId, balance) => 
        set(state => ({
          accounts: {
            ...state.accounts,
            [accountId]: balance
          }
        })),

      /**
       * Gets the balance for a specific account
       * @param {string} accountId - The account identifier
       * @returns {number} The account balance or 0 if not found
       */
      getAccountBalance: (accountId) => 
        get().accounts[accountId] || 0,

      // Financial goals
      goals: {},

      /**
       * Sets a financial goal
       * @param {string} goalId - The goal identifier
       * @param {Object} goal - The goal configuration
       * @param {string} goal.name - Goal name
       * @param {number} goal.targetAmount - Target amount to reach
       * @param {number} goal.currentAmount - Current amount saved
       * @param {string} goal.deadline - Goal deadline (ISO date string)
       */
      setGoal: (goalId, goal) =>
        set(state => ({
          goals: {
            ...state.goals,
            [goalId]: goal
          }
        })),

      /**
       * Gets a specific goal
       * @param {string} goalId - The goal identifier
       * @returns {Object|null} The goal object or null if not found
       */
      getGoal: (goalId) =>
        get().goals[goalId] || null,

      /**
       * Updates the current amount for a goal
       * @param {string} goalId - The goal identifier
       * @param {number} amount - The amount to add (or subtract if negative)
       */
      updateGoalProgress: (goalId, amount) =>
        set(state => {
          const goal = state.goals[goalId];
          if (!goal) return state;

          return {
            goals: {
              ...state.goals,
              [goalId]: {
                ...goal,
                currentAmount: Math.max(0, goal.currentAmount + amount)
              }
            }
          };
        }),

      // Budget tracking
      budgets: {},

      /**
       * Sets a budget category
       * @param {string} categoryId - The category identifier
       * @param {Object} budget - The budget configuration
       * @param {string} budget.name - Category name
       * @param {number} budget.limit - Monthly spending limit
       * @param {number} budget.spent - Amount spent this month
       */
      setBudget: (categoryId, budget) =>
        set(state => ({
          budgets: {
            ...state.budgets,
            [categoryId]: budget
          }
        })),

      /**
       * Records spending in a budget category
       * @param {string} categoryId - The category identifier
       * @param {number} amount - The amount spent
       */
      recordSpending: (categoryId, amount) =>
        set(state => {
          const budget = state.budgets[categoryId];
          if (!budget) return state;

          return {
            budgets: {
              ...state.budgets,
              [categoryId]: {
                ...budget,
                spent: budget.spent + amount
              }
            }
          };
        }),

      /**
       * Resets all monthly budget spending
       * Called at the start of each month
       */
      resetMonthlyBudgets: () =>
        set(state => ({
          budgets: Object.fromEntries(
            Object.entries(state.budgets).map(([id, budget]) => [
              id,
              { ...budget, spent: 0 }
            ])
          )
        }))
    }),
    {
      name: 'financial-state',
      // Only persist accounts, goals, and budgets
      partialize: (state) => ({
        accounts: state.accounts,
        goals: state.goals,
        budgets: state.budgets
      })
    }
  )
); 