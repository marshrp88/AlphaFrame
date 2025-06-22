/**
 * CashFlowService.test.js
 * 
 * Purpose: Comprehensive unit tests for the CashFlowService to ensure
 * all cash flow functionality works correctly including transaction management,
 * forecasting, analysis, and insights generation.
 * 
 * Fixes Applied:
 * - Proper afterEach cleanup with vi.restoreAllMocks()
 * - Added proper mock isolation
 * - Comments added for clarity
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CashFlowService } from '../services/CashFlowService.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Mock ExecutionLogService
vi.mock('../../../core/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn(),
    logError: vi.fn()
  }
}));

describe('CashFlowService', () => {
  let cashFlowService;

  beforeEach(() => {
    cashFlowService = new CashFlowService();
    
    // Reset mocks
    executionLogService.log.mockResolvedValue();
    executionLogService.logError.mockResolvedValue();
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(cashFlowService.incomeCategories).toBeDefined();
      expect(cashFlowService.expenseCategories).toBeDefined();
      expect(cashFlowService.transactions).toEqual([]);
      expect(cashFlowService.recurringTransactions).toEqual([]);
    });

    it('should have default income categories', () => {
      const categories = cashFlowService.getIncomeCategories();
      expect(categories.salary).toBeDefined();
      expect(categories.bonus).toBeDefined();
      expect(categories.investment).toBeDefined();
      expect(categories.salary.type).toBe('recurring');
      expect(categories.bonus.type).toBe('variable');
    });

    it('should have default expense categories', () => {
      const categories = cashFlowService.getExpenseCategories();
      expect(categories.housing).toBeDefined();
      expect(categories.food).toBeDefined();
      expect(categories.entertainment).toBeDefined();
      expect(categories.housing.type).toBe('fixed');
      expect(categories.food.type).toBe('variable');
    });
  });

  describe('Transaction Management', () => {
    it('should add income transaction correctly', async () => {
      const transaction = {
        amount: 5000,
        type: 'income',
        category: 'salary',
        description: 'Monthly salary'
      };

      const result = await cashFlowService.addTransaction(transaction);

      expect(result.id).toBeDefined();
      expect(result.amount).toBe(5000);
      expect(result.type).toBe('income');
      expect(result.category).toBe('salary');
      expect(result.description).toBe('Monthly salary');
      expect(result.recurring).toBe(false);
      expect(result.frequency).toBe('monthly');
      expect(cashFlowService.transactions).toHaveLength(1);

      expect(executionLogService.log).toHaveBeenCalledWith(
        'cashflow.transaction.added',
        expect.objectContaining({
          transactionId: result.id,
          type: 'income',
          category: 'salary',
          amount: 5000,
          recurring: false
        })
      );
    });

    it('should add expense transaction correctly', async () => {
      const transaction = {
        amount: 1500,
        type: 'expense',
        category: 'housing',
        description: 'Rent payment',
        recurring: true,
        frequency: 'monthly'
      };

      const result = await cashFlowService.addTransaction(transaction);

      expect(result.amount).toBe(1500);
      expect(result.type).toBe('expense');
      expect(result.category).toBe('housing');
      expect(result.recurring).toBe(true);
      expect(result.frequency).toBe('monthly');
      expect(cashFlowService.transactions).toHaveLength(1);
      expect(cashFlowService.recurringTransactions).toHaveLength(1);
    });

    it('should generate unique transaction IDs', async () => {
      const transaction1 = { amount: 100, type: 'income', category: 'salary' };
      const transaction2 = { amount: 200, type: 'income', category: 'bonus' };

      const result1 = await cashFlowService.addTransaction(transaction1);
      const result2 = await cashFlowService.addTransaction(transaction2);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(/^txn_\d+_[a-z0-9]+$/);
      expect(result2.id).toMatch(/^txn_\d+_[a-z0-9]+$/);
    });

    it('should validate transaction amount', async () => {
      const invalidTransactions = [
        { amount: 0, type: 'income', category: 'salary' },
        { amount: -100, type: 'income', category: 'salary' },
        { amount: 'invalid', type: 'income', category: 'salary' }
      ];

      for (const transaction of invalidTransactions) {
        await expect(cashFlowService.addTransaction(transaction))
          .rejects.toThrow('Transaction amount must be a positive number');
      }
    });

    it('should validate transaction type', async () => {
      const transaction = { amount: 100, type: 'invalid', category: 'salary' };

      await expect(cashFlowService.addTransaction(transaction))
        .rejects.toThrow('Transaction type must be either "income" or "expense"');
    });

    it('should validate transaction category', async () => {
      const invalidTransactions = [
        { amount: 100, type: 'income' },
        { amount: 100, type: 'income', category: 123 },
        { amount: 100, type: 'income', category: '' }
      ];

      for (const transaction of invalidTransactions) {
        await expect(cashFlowService.addTransaction(transaction))
          .rejects.toThrow('Transaction category is required and must be a string');
      }
    });

    it('should handle transaction add errors', async () => {
      executionLogService.log.mockRejectedValue(new Error('Logging failed'));

      const transaction = { amount: 100, type: 'income', category: 'salary' };

      await expect(cashFlowService.addTransaction(transaction))
        .rejects.toThrow('Logging failed');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'cashflow.transaction.add.failed',
        expect.any(Error),
        { transaction }
      );
    });
  });

  describe('Transaction Retrieval', () => {
    beforeEach(async () => {
      // Add test transactions
      await cashFlowService.addTransaction({
        amount: 5000,
        type: 'income',
        category: 'salary',
        date: '2024-01-15'
      });

      await cashFlowService.addTransaction({
        amount: 1500,
        type: 'expense',
        category: 'housing',
        date: '2024-01-20'
      });

      await cashFlowService.addTransaction({
        amount: 300,
        type: 'expense',
        category: 'food',
        date: '2024-02-10'
      });
    });

    it('should get transactions for date range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const transactions = cashFlowService.getTransactions(startDate, endDate);

      expect(transactions).toHaveLength(2);
      expect(transactions[0].category).toBe('housing'); // Most recent first
      expect(transactions[1].category).toBe('salary');
    });

    it('should filter transactions by type', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const incomeTransactions = cashFlowService.getTransactions(startDate, endDate, 'income');
      const expenseTransactions = cashFlowService.getTransactions(startDate, endDate, 'expense');

      expect(incomeTransactions).toHaveLength(1);
      expect(expenseTransactions).toHaveLength(2);
      expect(incomeTransactions[0].type).toBe('income');
      expect(expenseTransactions.every(t => t.type === 'expense')).toBe(true);
    });

    it('should return empty array for no matching transactions', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');

      const transactions = cashFlowService.getTransactions(startDate, endDate);

      expect(transactions).toEqual([]);
    });
  });

  describe('Cash Flow Calculations', () => {
    beforeEach(async () => {
      // Add test transactions
      await cashFlowService.addTransaction({
        amount: 5000,
        type: 'income',
        category: 'salary',
        date: '2024-01-15'
      });

      await cashFlowService.addTransaction({
        amount: 1000,
        type: 'income',
        category: 'bonus',
        date: '2024-01-20'
      });

      await cashFlowService.addTransaction({
        amount: 1500,
        type: 'expense',
        category: 'housing',
        date: '2024-01-25'
      });

      await cashFlowService.addTransaction({
        amount: 300,
        type: 'expense',
        category: 'food',
        date: '2024-01-30'
      });
    });

    it('should calculate cash flow correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const cashFlow = cashFlowService.calculateCashFlow(startDate, endDate);

      expect(cashFlow.income).toBe(6000); // 5000 + 1000
      expect(cashFlow.expenses).toBe(1800); // 1500 + 300
      expect(cashFlow.netCashFlow).toBe(4200); // 6000 - 1800
      expect(cashFlow.transactionCount).toBe(4);
      expect(cashFlow.incomeTransactions).toBe(2);
      expect(cashFlow.expenseTransactions).toBe(2);
      expect(cashFlow.period.startDate).toBe(startDate);
      expect(cashFlow.period.endDate).toBe(endDate);
    });

    it('should handle empty period', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const cashFlow = cashFlowService.calculateCashFlow(startDate, endDate);

      expect(cashFlow.income).toBe(0);
      expect(cashFlow.expenses).toBe(0);
      expect(cashFlow.netCashFlow).toBe(0);
      expect(cashFlow.transactionCount).toBe(0);
    });

    it('should handle only income transactions', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      // Remove expense transactions
      cashFlowService.transactions = cashFlowService.transactions.filter(t => t.type === 'income');

      const cashFlow = cashFlowService.calculateCashFlow(startDate, endDate);

      expect(cashFlow.income).toBe(6000);
      expect(cashFlow.expenses).toBe(0);
      expect(cashFlow.netCashFlow).toBe(6000);
      expect(cashFlow.expenseTransactions).toBe(0);
    });

    it('should handle only expense transactions', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      // Remove income transactions
      cashFlowService.transactions = cashFlowService.transactions.filter(t => t.type === 'expense');

      const cashFlow = cashFlowService.calculateCashFlow(startDate, endDate);

      expect(cashFlow.income).toBe(0);
      expect(cashFlow.expenses).toBe(1800);
      expect(cashFlow.netCashFlow).toBe(-1800);
      expect(cashFlow.incomeTransactions).toBe(0);
    });
  });

  describe('Cash Flow Forecasting', () => {
    beforeEach(async () => {
      // Add historical data for forecasting
      for (let i = 1; i <= 6; i++) {
        await cashFlowService.addTransaction({
          amount: 5000,
          type: 'income',
          category: 'salary',
          date: `2024-${i.toString().padStart(2, '0')}-15`
        });

        await cashFlowService.addTransaction({
          amount: 2000,
          type: 'expense',
          category: 'housing',
          date: `2024-${i.toString().padStart(2, '0')}-20`
        });
      }
    });

    it('should generate forecast correctly', async () => {
      const forecast = await cashFlowService.generateForecast(6);

      expect(forecast.months).toBe(6);
      expect(forecast.monthlyProjections).toHaveLength(6);
      expect(forecast.totalProjectedIncome).toBeGreaterThan(0);
      expect(forecast.totalProjectedExpenses).toBeGreaterThan(0);
      expect(forecast.totalProjectedCashFlow).toBeDefined();
      expect(forecast.cumulativeCashFlow).toBeDefined();
      expect(forecast.warnings).toBeDefined();
      expect(forecast.opportunities).toBeDefined();
    });

    it('should calculate historical averages correctly', () => {
      const historicalData = cashFlowService.calculateHistoricalAverages();

      expect(historicalData.avgMonthlyIncome).toBe(5000);
      expect(historicalData.avgMonthlyExpenses).toBe(2000);
      expect(historicalData.months).toBe(6);
      expect(historicalData.seasonalFactors).toBeNull(); // Less than 12 months
    });

    it('should handle empty transaction history', () => {
      cashFlowService.transactions = [];
      
      const historicalData = cashFlowService.calculateHistoricalAverages();

      expect(historicalData.avgMonthlyIncome).toBe(0);
      expect(historicalData.avgMonthlyExpenses).toBe(0);
      expect(historicalData.seasonalFactors).toBeNull();
    });

    it('should calculate seasonal factors with sufficient data', async () => {
      // Add more data to reach 12+ months
      for (let i = 7; i <= 12; i++) {
        await cashFlowService.addTransaction({
          amount: 5000,
          type: 'income',
          category: 'salary',
          date: `2024-${i.toString().padStart(2, '0')}-15`
        });
      }

      const historicalData = cashFlowService.calculateHistoricalAverages();

      expect(historicalData.seasonalFactors).toBeDefined();
      expect(historicalData.seasonalFactors).toHaveLength(12);
      expect(historicalData.seasonalFactors.every(factor => typeof factor === 'number')).toBe(true);
    });

    it('should log forecast generation', async () => {
      await cashFlowService.generateForecast(6);

      expect(executionLogService.log).toHaveBeenCalledWith(
        'cashflow.forecast.generated',
        expect.objectContaining({
          months: 6,
          totalProjectedIncome: expect.any(Number),
          totalProjectedExpenses: expect.any(Number),
          totalProjectedCashFlow: expect.any(Number),
          warnings: expect.any(Number),
          opportunities: expect.any(Number)
        })
      );
    });

    it('should handle forecast errors', async () => {
      executionLogService.log.mockRejectedValue(new Error('Forecast failed'));

      await expect(cashFlowService.generateForecast(6))
        .rejects.toThrow('Forecast failed');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'cashflow.forecast.failed',
        expect.any(Error),
        { months: 6 }
      );
    });
  });

  describe('Recurring Transactions', () => {
    beforeEach(() => {
      // Reset service state before each test
      cashFlowService.transactions = [];
      cashFlowService.recurringTransactions = [];
    });

    it('should calculate recurring income correctly', () => {
      // Set up recurring transactions
      cashFlowService.recurringTransactions = [
        {
          amount: 5000,
          type: 'income',
          category: 'salary',
          recurring: true,
          frequency: 'monthly',
          date: '2024-01-01'
        }
      ];

      const monthDate = new Date('2024-02-01');
      const recurringIncome = cashFlowService.calculateRecurringIncome(monthDate);

      expect(recurringIncome).toBe(5000); // Only monthly salary, not annual bonus
    });

    it('should calculate recurring expenses correctly', () => {
      // Set up recurring transactions
      cashFlowService.recurringTransactions = [
        {
          amount: 1500,
          type: 'expense',
          category: 'housing',
          recurring: true,
          frequency: 'monthly',
          date: '2024-01-01'
        }
      ];

      const monthDate = new Date('2024-02-01');
      const recurringExpenses = cashFlowService.calculateRecurringExpenses(monthDate);

      expect(recurringExpenses).toBe(1500); // Monthly housing expense
    });

    it('should include annual transactions in correct months', () => {
      // Set up recurring transactions
      cashFlowService.recurringTransactions = [
        {
          amount: 5000,
          type: 'income',
          category: 'salary',
          recurring: true,
          frequency: 'monthly',
          date: '2024-01-01'
        },
        {
          amount: 5000,
          type: 'income',
          category: 'bonus',
          recurring: true,
          frequency: 'annual',
          date: '2024-01-25'
        }
      ];

      const januaryDate = new Date(2024, 0, 25); // January 25, 2024
      const februaryDate = new Date(2024, 1, 1);  // February 1, 2024
      const nextYearDate = new Date(2025, 0, 25); // January 25, 2025

      const januaryIncome = cashFlowService.calculateRecurringIncome(januaryDate);
      const februaryIncome = cashFlowService.calculateRecurringIncome(februaryDate);
      const nextYearIncome = cashFlowService.calculateRecurringIncome(nextYearDate);

      expect(januaryIncome).toBe(10000); // Salary + bonus
      expect(februaryIncome).toBe(5000); // Only salary
      expect(nextYearIncome).toBe(10000); // Salary + bonus again
    });

    it('should handle different frequencies correctly', () => {
      // Set up recurring transactions
      cashFlowService.recurringTransactions = [
        {
          amount: 5000,
          type: 'income',
          category: 'salary',
          recurring: true,
          frequency: 'monthly',
          date: '2024-01-01'
        },
        {
          amount: 1000,
          type: 'income',
          category: 'dividend',
          recurring: true,
          frequency: 'quarterly',
          date: '2024-01-01'
        }
      ];

      const monthlyDate = new Date('2024-03-01');
      const quarterlyDate = new Date('2024-04-01');

      const monthlyIncome = cashFlowService.calculateRecurringIncome(monthlyDate);
      const quarterlyIncome = cashFlowService.calculateRecurringIncome(quarterlyDate);

      expect(monthlyIncome).toBe(5000); // Only monthly salary
      expect(quarterlyIncome).toBe(6000); // Salary + quarterly dividend
    });
  });

  describe('Cash Flow Insights', () => {
    it('should generate negative cash flow warning', () => {
      const forecast = {
        months: 6,
        totalProjectedCashFlow: -5000,
        totalProjectedExpenses: 12000,
        warnings: [],
        opportunities: []
      };

      const historicalData = {
        avgMonthlyExpenses: 2000,
        avgMonthlyIncome: 1500
      };

      cashFlowService.generateCashFlowInsights(forecast, historicalData);

      // Should generate both negative_cashflow and low_cash_reserves warnings
      expect(forecast.warnings.length).toBe(2);
      expect(forecast.warnings.some(w => w.type === 'negative_cashflow')).toBe(true);
      expect(forecast.warnings.some(w => w.type === 'low_cash_reserves')).toBe(true);
    });

    it('should generate low cash reserves warning', () => {
      const forecast = {
        months: 6,
        totalProjectedCashFlow: 1000, // Very low positive cash flow
        warnings: [],
        opportunities: []
      };

      const historicalData = {
        avgMonthlyExpenses: 2000
      };

      cashFlowService.generateCashFlowInsights(forecast, historicalData);

      expect(forecast.warnings).toHaveLength(1);
      expect(forecast.warnings[0].type).toBe('low_cash_reserves');
      expect(forecast.warnings[0].severity).toBe('medium');
    });

    it('should generate income stabilization opportunity', () => {
      // Add transactions with high variability
      cashFlowService.transactions = [
        { type: 'income', amount: 1000 },
        { type: 'income', amount: 5000 },
        { type: 'income', amount: 2000 },
        { type: 'income', amount: 8000 }
      ];

      const forecast = { months: 6, totalProjectedCashFlow: 10000, warnings: [], opportunities: [] };
      const historicalData = { avgMonthlyIncome: 4000 };

      cashFlowService.generateCashFlowInsights(forecast, historicalData);

      expect(forecast.opportunities).toHaveLength(1);
      expect(forecast.opportunities[0].type).toBe('income_stabilization');
      expect(forecast.opportunities[0].priority).toBe('medium');
    });

    it('should generate expense reduction opportunity', () => {
      // Add a custom discretionary category
      cashFlowService.expenseCategories['luxury'] = { name: 'Luxury', type: 'discretionary', frequency: 'monthly' };
      cashFlowService.transactions = [
        { type: 'expense', amount: 3000, category: 'luxury' },
        { type: 'expense', amount: 3000, category: 'luxury' }
      ];

      const forecast = { months: 6, totalProjectedCashFlow: 1000, warnings: [], opportunities: [] };
      const historicalData = { avgMonthlyIncome: 5000 };

      cashFlowService.generateCashFlowInsights(forecast, historicalData);

      expect(forecast.opportunities).toHaveLength(1);
      expect(forecast.opportunities[0].type).toBe('expense_reduction');
      expect(forecast.opportunities[0].priority).toBe('high');
    });
  });

  describe('Analytics and Calculations', () => {
    it('should calculate income variability correctly', () => {
      cashFlowService.transactions = [
        { type: 'income', amount: 1000 },
        { type: 'income', amount: 2000 },
        { type: 'income', amount: 3000 }
      ];

      const variability = cashFlowService.calculateIncomeVariability();

      expect(variability).toBeGreaterThan(0);
      expect(typeof variability).toBe('number');
    });

    it('should return zero variability for single transaction', () => {
      cashFlowService.transactions = [
        { type: 'income', amount: 1000 }
      ];

      const variability = cashFlowService.calculateIncomeVariability();

      expect(variability).toBe(0);
    });

    it('should calculate expense breakdown correctly', () => {
      cashFlowService.transactions = [
        { type: 'expense', amount: 1000, category: 'housing' },
        { type: 'expense', amount: 500, category: 'food' },
        { type: 'expense', amount: 300, category: 'entertainment' }
      ];

      const breakdown = cashFlowService.calculateExpenseBreakdown();

      expect(breakdown.fixed).toBe(1000); // housing is fixed
      expect(breakdown.variable).toBe(800); // food and entertainment are variable
      expect(breakdown.discretionary).toBe(0); // none are discretionary in default
    });

    it('should handle unknown categories in expense breakdown', () => {
      cashFlowService.transactions = [
        { type: 'expense', amount: 1000, category: 'unknown' }
      ];

      const breakdown = cashFlowService.calculateExpenseBreakdown();

      expect(breakdown.fixed).toBe(0);
      expect(breakdown.variable).toBe(0);
      expect(breakdown.discretionary).toBe(0);
    });
  });

  describe('Cash Flow Summary', () => {
    beforeEach(async () => {
      // Add transactions for summary
      await cashFlowService.addTransaction({
        amount: 5000,
        type: 'income',
        category: 'salary',
        date: '2024-01-15'
      });

      await cashFlowService.addTransaction({
        amount: 1500,
        type: 'expense',
        category: 'housing',
        date: '2024-01-20',
        recurring: true
      });
    });

    it('should generate cash flow summary', () => {
      const summary = cashFlowService.getCashFlowSummary();

      expect(summary.yearToDate).toBeDefined();
      expect(summary.lastMonth).toBeDefined();
      expect(summary.totalTransactions).toBe(2);
      expect(summary.recurringTransactions).toBe(1);
      expect(summary.incomeCategories).toBeGreaterThan(0);
      expect(summary.expenseCategories).toBeGreaterThan(0);
    });

    it('should calculate year-to-date cash flow', () => {
      const now = new Date();
      const year = now.getFullYear();
      cashFlowService.transactions = [
        { amount: 5000, type: 'income', category: 'salary', date: `${year}-01-15` },
        { amount: 1500, type: 'expense', category: 'housing', date: `${year}-01-20`, recurring: true }
      ];
      const summary = cashFlowService.getCashFlowSummary();

      expect(summary.yearToDate.income).toBe(5000);
      expect(summary.yearToDate.expenses).toBe(1500);
      expect(summary.yearToDate.netCashFlow).toBe(3500);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid transaction object', async () => {
      await expect(cashFlowService.addTransaction(null))
        .rejects.toThrow('Transaction must be a valid object');

      await expect(cashFlowService.addTransaction('invalid'))
        .rejects.toThrow('Transaction must be a valid object');
    });

    it('should handle transactions with missing date', async () => {
      const transaction = {
        amount: 100,
        type: 'income',
        category: 'salary'
      };

      const result = await cashFlowService.addTransaction(transaction);

      expect(result.date).toBeDefined();
      expect(new Date(result.date)).toBeInstanceOf(Date);
    });

    it('should handle empty transaction arrays', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const transactions = cashFlowService.getTransactions(startDate, endDate);
      const cashFlow = cashFlowService.calculateCashFlow(startDate, endDate);

      expect(transactions).toEqual([]);
      expect(cashFlow.income).toBe(0);
      expect(cashFlow.expenses).toBe(0);
    });

    it('should handle date range with start after end', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      const transactions = cashFlowService.getTransactions(startDate, endDate);

      expect(transactions).toEqual([]);
    });

    it('should handle very large numbers', async () => {
      const transaction = {
        amount: 999999999.99,
        type: 'income',
        category: 'salary'
      };

      const result = await cashFlowService.addTransaction(transaction);

      expect(result.amount).toBe(999999999.99);
    });

    it('should handle decimal amounts', async () => {
      const transaction = {
        amount: 1234.56,
        type: 'expense',
        category: 'food'
      };

      const result = await cashFlowService.addTransaction(transaction);

      expect(result.amount).toBe(1234.56);
    });
  });
}); 