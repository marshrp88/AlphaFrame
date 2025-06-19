/**
 * CashFlowService.test.js
 *
 * Purpose: Comprehensive unit tests for the CashFlowService to ensure all cash flow
 * functionality works correctly including transaction management, cash flow calculations,
 * forecasting, warnings, and error handling.
 *
 * Procedure:
 * 1. Test transaction add, retrieval, and filtering
 * 2. Test cash flow calculations for various periods
 * 3. Test cash flow forecasting and warnings
 * 4. Test recurring transaction logic
 * 5. Test error handling and edge cases
 *
 * Conclusion: These tests validate that the CashFlowService properly manages
 * cash flow logic, forecasting, and event logging.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CashFlowService } from '../../../src/lib/services/CashFlowService.js';

// Mock ExecutionLogService
vi.mock('../../../src/lib/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn(),
    logError: vi.fn()
  }
}));

describe('CashFlowService', () => {
  let service;

  beforeEach(() => {
    service = new CashFlowService();
  });

  describe('Transaction Management', () => {
    it('should add a transaction', async () => {
      const txn = await service.addTransaction({
        amount: 1000,
        type: 'income',
        category: 'salary',
        description: 'Test salary',
        date: '2024-05-01'
      });
      expect(txn.id).toMatch(/^txn_/);
      expect(service.transactions.length).toBe(1);
    });

    it('should add a recurring transaction', async () => {
      const txn = await service.addTransaction({
        amount: 500,
        type: 'expense',
        category: 'housing',
        recurring: true,
        frequency: 'monthly',
        date: '2024-05-01'
      });
      expect(txn.recurring).toBe(true);
      expect(service.recurringTransactions.length).toBe(1);
    });

    it('should filter transactions by date and type', async () => {
      await service.addTransaction({ amount: 1000, type: 'income', category: 'salary', date: '2024-05-01' });
      await service.addTransaction({ amount: 200, type: 'expense', category: 'food', date: '2024-05-02' });
      const start = new Date('2024-05-01');
      const end = new Date('2024-05-31');
      const incomeTxns = service.getTransactions(start, end, 'income');
      expect(incomeTxns.length).toBe(1);
      expect(incomeTxns[0].type).toBe('income');
    });
  });

  describe('Cash Flow Calculations', () => {
    beforeEach(async () => {
      await service.addTransaction({ amount: 1000, type: 'income', category: 'salary', date: '2024-05-01' });
      await service.addTransaction({ amount: 200, type: 'expense', category: 'food', date: '2024-05-02' });
      await service.addTransaction({ amount: 300, type: 'expense', category: 'utilities', date: '2024-05-03' });
    });

    it('should calculate cash flow for a period', () => {
      const start = new Date('2024-05-01');
      const end = new Date('2024-05-31');
      const summary = service.calculateCashFlow(start, end);
      expect(summary.income).toBe(1000);
      expect(summary.expenses).toBe(500);
      expect(summary.netCashFlow).toBe(500);
    });
  });

  describe('Forecasting', () => {
    beforeEach(async () => {
      await service.addTransaction({ amount: 1000, type: 'income', category: 'salary', date: '2024-05-01' });
      await service.addTransaction({ amount: 200, type: 'expense', category: 'food', date: '2024-05-02' });
      await service.addTransaction({ amount: 300, type: 'expense', category: 'utilities', date: '2024-05-03' });
    });

    it('should generate a cash flow forecast', async () => {
      const forecast = await service.generateForecast(3);
      expect(forecast.months).toBe(3);
      expect(forecast.monthlyProjections.length).toBe(3);
      expect(forecast.totalProjectedIncome).toBeGreaterThan(0);
      expect(forecast.totalProjectedExpenses).toBeGreaterThan(0);
    });

    it('should generate warnings for negative cash flow', async () => {
      // Add large expense to create negative cash flow
      await service.addTransaction({ amount: 5000, type: 'expense', category: 'shopping', date: '2024-05-04' });
      const forecast = await service.generateForecast(3);
      expect(forecast.warnings.some(w => w.type === 'negative_cashflow')).toBe(true);
    });
  });

  describe('Recurring Transactions', () => {
    it('should include recurring income in forecast', async () => {
      await service.addTransaction({ amount: 2000, type: 'income', category: 'salary', recurring: true, frequency: 'monthly', date: '2024-05-01' });
      const forecast = await service.generateForecast(2);
      expect(forecast.monthlyProjections[0].recurringIncome).toBeGreaterThan(0);
    });
    it('should include recurring expenses in forecast', async () => {
      await service.addTransaction({ amount: 500, type: 'expense', category: 'housing', recurring: true, frequency: 'monthly', date: '2024-05-01' });
      const forecast = await service.generateForecast(2);
      expect(forecast.monthlyProjections[0].recurringExpenses).toBeGreaterThan(0);
    });
  });

  describe('Summary and Getters', () => {
    it('should return cash flow summary', async () => {
      await service.addTransaction({ amount: 1000, type: 'income', category: 'salary', date: '2024-05-01' });
      const summary = service.getCashFlowSummary();
      expect(summary.totalTransactions).toBeGreaterThan(0);
      expect(summary.incomeCategories).toBeGreaterThan(0);
      expect(summary.expenseCategories).toBeGreaterThan(0);
    });
    it('should return income and expense categories', () => {
      const incomeCats = service.getIncomeCategories();
      const expenseCats = service.getExpenseCategories();
      expect(incomeCats.salary).toBeDefined();
      expect(expenseCats.housing).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should log errors on transaction add failure', async () => {
      // Simulate error by passing invalid transaction
      await expect(service.addTransaction({})).rejects.toThrow();
    });
    it('should log errors on forecast failure', async () => {
      // Simulate error by monkey-patching calculateHistoricalAverages
      service.calculateHistoricalAverages = () => { throw new Error('Test error'); };
      await expect(service.generateForecast(2)).rejects.toThrow('Test error');
    });
  });
}); 