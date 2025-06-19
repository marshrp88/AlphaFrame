/**
 * BudgetService.test.js
 *
 * Purpose: Comprehensive unit tests for the BudgetService to ensure all budgeting
 * functionality works correctly including initialization, cap calculations,
 * category management, forecasting, warnings, and error handling.
 *
 * Procedure:
 * 1. Test initialization and default cap calculations
 * 2. Test category add, update, remove
 * 3. Test budget forecasting and warnings
 * 4. Test spending limit checks
 * 5. Test error handling and edge cases
 *
 * Conclusion: These tests validate that the BudgetService properly manages
 * budgeting logic, forecasting, and event logging.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BudgetService } from '../../../src/lib/services/BudgetService.js';

// Mock ExecutionLogService
vi.mock('../../../src/lib/services/ExecutionLogService.js', () => ({
  default: {
    logBudgetForecast: vi.fn(),
    logError: vi.fn(),
    log: vi.fn()
  }
}));

describe('BudgetService', () => {
  let service;

  beforeEach(() => {
    service = new BudgetService();
  });

  describe('Initialization', () => {
    it('should initialize with correct caps and types', async () => {
      const result = await service.initializeBudget(5000, 10000, 'category');
      expect(result.monthlyIncome).toBe(5000);
      expect(result.emergencyFund).toBe(10000);
      expect(result.budgetType).toBe('category');
      expect(Object.keys(result.categories)).toContain('housing');
      expect(result.categories.housing.monthlyCap).toBeGreaterThan(0);
    });
  });

  describe('Category Management', () => {
    it('should add a new category', async () => {
      await service.addCategory('pets', 'Pets', 'discretionary', 100);
      expect(service.categories.pets).toBeDefined();
      expect(service.categories.pets.monthlyCap).toBe(100);
    });

    it('should not add duplicate category', async () => {
      await service.addCategory('pets', 'Pets', 'discretionary', 100);
      await expect(service.addCategory('pets', 'Pets', 'discretionary', 100)).rejects.toThrow();
    });

    it('should update category cap', async () => {
      await service.updateCategoryCap('housing', 2000);
      expect(service.categories.housing.monthlyCap).toBe(2000);
    });

    it('should remove a category', async () => {
      await service.addCategory('pets', 'Pets', 'discretionary', 100);
      await service.removeCategory('pets');
      expect(service.categories.pets).toBeUndefined();
    });
  });

  describe('Forecasting', () => {
    it('should generate a forecast with default caps', async () => {
      await service.initializeBudget(6000, 5000, 'category');
      const forecast = await service.generateForecast(30);
      expect(forecast.totalBudget).toBe(6000);
      expect(forecast.period).toBe(30);
      expect(forecast.categoryForecasts.housing).toBeDefined();
    });

    it('should generate warnings for overspending', async () => {
      await service.initializeBudget(3000, 2000, 'category');
      // Create spending history that exceeds the budget
      const spendingHistory = [
        { category: 'entertainment', amount: 2000, date: '2024-05-01' },
        { category: 'shopping', amount: 1500, date: '2024-05-02' },
        { category: 'dining', amount: 1000, date: '2024-05-03' },
        { category: 'transportation', amount: 800, date: '2024-05-04' }
      ];
      const forecast = await service.generateForecast(30, spendingHistory);
      expect(forecast.warnings.length).toBeGreaterThan(0);
      expect(forecast.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Spending Limit Checks', () => {
    it('should detect spending limit breach', async () => {
      await service.initializeBudget(4000, 1000, 'category');
      await service.updateCategoryCap('entertainment', 100);
      const breach = await service.checkSpendingLimit('entertainment', 150);
      expect(breach.isBreached).toBe(true);
      expect(breach.current).toBe(150);
      expect(breach.limit).toBe(100);
    });

    it('should warn when close to limit', async () => {
      await service.initializeBudget(4000, 1000, 'category');
      await service.updateCategoryCap('entertainment', 100);
      const breach = await service.checkSpendingLimit('entertainment', 85);
      expect(breach.isWarning).toBe(true);
      expect(breach.percentageUsed).toBeGreaterThan(80);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unknown category on update', async () => {
      await expect(service.updateCategoryCap('unknown', 100)).rejects.toThrow();
    });
    it('should throw error for unknown category on remove', async () => {
      await expect(service.removeCategory('unknown')).rejects.toThrow();
    });
  });

  describe('Summary and Getters', () => {
    it('should return correct budget summary', async () => {
      await service.initializeBudget(5000, 1000, 'category');
      const summary = service.getBudgetSummary();
      expect(summary.monthlyIncome).toBe(5000);
      expect(summary.totalBudget).toBeGreaterThan(0);
      expect(summary.categories).toBeGreaterThan(0);
    });
    it('should return all categories', () => {
      const categories = service.getCategories();
      expect(categories.housing).toBeDefined();
    });
    it('should return budget type', async () => {
      await service.initializeBudget(5000, 1000, 'envelope');
      expect(service.getBudgetType()).toBe('envelope');
    });
  });
}); 