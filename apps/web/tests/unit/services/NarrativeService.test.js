/**
 * NarrativeService.test.js
 *
 * Purpose: Comprehensive unit tests for the NarrativeService to ensure all
 * insight generation, log analysis, and narrative creation functionality
 * works correctly with proper error handling and edge cases.
 *
 * Procedure:
 * 1. Test insight generation from various log types
 * 2. Test portfolio analysis insights
 * 3. Test budget pattern analysis
 * 4. Test rule trigger analysis
 * 5. Test cash flow trend analysis
 * 6. Test utility functions and edge cases
 *
 * Conclusion: These tests validate that the NarrativeService properly
 * generates meaningful insights from execution logs while maintaining
 * deterministic behavior and proper error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NarrativeService } from '../../../src/lib/services/NarrativeService.js';

// Mock ExecutionLogService
vi.mock('../../../src/lib/services/ExecutionLogService.js', () => ({
  default: {
    getLogs: vi.fn(),
    log: vi.fn(),
    logError: vi.fn()
  }
}));

describe('NarrativeService', () => {
  let service;
  let mockExecutionLogService;

  beforeEach(async () => {
    service = new NarrativeService();
    mockExecutionLogService = (await import('../../../src/lib/services/ExecutionLogService.js')).default;
    vi.clearAllMocks();
  });

  describe('Insight Generation', () => {
    it('should generate insights from portfolio analysis logs', async () => {
      const mockLogs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {
            deviations: {
              equity: 15,
              bonds: -10
            },
            diversificationScores: {
              overall: 45
            }
          }
        }
      ];

      mockExecutionLogService.getLogs.mockResolvedValue(mockLogs);
      mockExecutionLogService.log.mockResolvedValue();

      const insights = await service.generateInsights(24);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.type === 'portfolio_allocation_change')).toBe(true);
      expect(insights.some(i => i.type === 'diversification_low')).toBe(true);
      expect(mockExecutionLogService.log).toHaveBeenCalledWith('narrative.insights.generated', expect.any(Object));
    });

    it('should generate insights from budget breach logs', async () => {
      const mockLogs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date().toISOString(),
          payload: {
            category: 'entertainment',
            overage: 150
          }
        }
      ];

      mockExecutionLogService.getLogs.mockResolvedValue(mockLogs);
      mockExecutionLogService.log.mockResolvedValue();

      const insights = await service.generateInsights(24);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.type === 'budget_overspending')).toBe(true);
      expect(insights.find(i => i.type === 'budget_overspending').data.category).toBe('entertainment');
      expect(insights.find(i => i.type === 'budget_overspending').data.amount).toBe(150);
    });

    it('should generate insights from rule trigger logs', async () => {
      const mockLogs = [
        {
          type: 'rule.triggered',
          timestamp: new Date().toISOString(),
          payload: { ruleName: 'High Spending Alert' }
        },
        {
          type: 'rule.triggered',
          timestamp: new Date().toISOString(),
          payload: { ruleName: 'High Spending Alert' }
        }
      ];

      mockExecutionLogService.getLogs.mockResolvedValue(mockLogs);
      mockExecutionLogService.log.mockResolvedValue();

      const insights = await service.generateInsights(24);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.type === 'rule_frequency')).toBe(true);
      expect(insights.find(i => i.type === 'rule_frequency').data.count).toBe(2);
    });

    it('should handle empty logs gracefully', async () => {
      mockExecutionLogService.getLogs.mockResolvedValue([]);
      mockExecutionLogService.log.mockResolvedValue();

      const insights = await service.generateInsights(24);

      expect(insights).toEqual([]);
      expect(mockExecutionLogService.log).toHaveBeenCalledWith('narrative.insights.generated', expect.any(Object));
    });

    it('should sort insights by priority and timestamp', async () => {
      const mockLogs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date(Date.now() - 1000).toISOString(),
          payload: { category: 'entertainment', overage: 150 }
        },
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: { deviations: { equity: 5 } }
        }
      ];

      mockExecutionLogService.getLogs.mockResolvedValue(mockLogs);
      mockExecutionLogService.log.mockResolvedValue();

      const insights = await service.generateInsights(24);

      expect(insights.length).toBeGreaterThan(0);
      // High priority insights should come first
      const highPriorityInsights = insights.filter(i => i.priority === 'high');
      const mediumPriorityInsights = insights.filter(i => i.priority === 'medium');
      
      if (highPriorityInsights.length > 0 && mediumPriorityInsights.length > 0) {
        expect(insights.indexOf(highPriorityInsights[0])).toBeLessThan(insights.indexOf(mediumPriorityInsights[0]));
      }
    });
  });

  describe('Portfolio Analysis', () => {
    it('should detect significant allocation changes', () => {
      const logs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {
            deviations: {
              equity: 15,
              bonds: -8,
              cash: 2
            }
          }
        }
      ];

      const insights = service.analyzePortfolioChanges(logs);

      expect(insights.length).toBe(2); // equity and bonds exceed 5% threshold
      expect(insights.some(i => i.data.sector === 'equity' && i.data.direction === 'increased')).toBe(true);
      expect(insights.some(i => i.data.sector === 'bonds' && i.data.direction === 'decreased')).toBe(true);
    });

    it('should detect low diversification scores', () => {
      const logs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {
            diversificationScores: {
              overall: 35
            }
          }
        }
      ];

      const insights = service.analyzePortfolioChanges(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('diversification_low');
      expect(insights[0].data.score).toBe(35);
    });

    it('should not generate insights for insignificant changes', () => {
      const logs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {
            deviations: {
              equity: 3,
              bonds: -2
            },
            diversificationScores: {
              overall: 75
            }
          }
        }
      ];

      const insights = service.analyzePortfolioChanges(logs);

      expect(insights.length).toBe(0);
    });
  });

  describe('Budget Analysis', () => {
    it('should detect budget overspending', () => {
      const logs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date().toISOString(),
          payload: {
            category: 'dining',
            overage: 200
          }
        }
      ];

      const insights = service.analyzeBudgetPatterns(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('budget_overspending');
      expect(insights[0].data.category).toBe('dining');
      expect(insights[0].data.amount).toBe(200);
    });

    it('should detect budget forecast overages', () => {
      const logs = [
        {
          type: 'budget.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {
            projectedSpending: 5000,
            totalBudget: 4500
          }
        }
      ];

      const insights = service.analyzeBudgetPatterns(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('budget_forecast');
      expect(insights[0].data.outcome).toBe('exceed');
      expect(insights[0].data.amount).toBe('500');
    });

    it('should handle missing payload data gracefully', () => {
      const logs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date().toISOString()
        }
      ];

      const insights = service.analyzeBudgetPatterns(logs);

      expect(insights.length).toBe(0);
    });
  });

  describe('Rule Analysis', () => {
    it('should detect frequent rule triggers', () => {
      const logs = [
        { type: 'rule.triggered', payload: { ruleName: 'Alert Rule' } },
        { type: 'rule.triggered', payload: { ruleName: 'Alert Rule' } },
        { type: 'rule.triggered', payload: { ruleName: 'Alert Rule' } }
      ];

      const insights = service.analyzeRuleTriggers(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('rule_frequency');
      expect(insights[0].data.rule_name).toBe('Alert Rule');
      expect(insights[0].data.count).toBe(3);
    });

    it('should not generate insights for single rule triggers', () => {
      const logs = [
        { type: 'rule.triggered', payload: { ruleName: 'Single Alert' } }
      ];

      const insights = service.analyzeRuleTriggers(logs);

      expect(insights.length).toBe(0);
    });

    it('should handle missing rule names', () => {
      const logs = [
        { type: 'rule.triggered' },
        { type: 'rule.triggered' }
      ];

      const insights = service.analyzeRuleTriggers(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].data.rule_name).toBe('Unknown Rule');
    });
  });

  describe('Cash Flow Analysis', () => {
    it('should detect negative cash flow', () => {
      const logs = [
        {
          type: 'cashflow.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {
            projectedCashFlow: -500
          }
        }
      ];

      const insights = service.analyzeCashFlowTrends(logs);

      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('cash_flow_negative');
      expect(insights[0].data.amount).toBe('500');
    });

    it('should identify highest expense category', () => {
      const logs = [
        {
          type: 'cashflow.transaction.added',
          payload: { type: 'expense', category: 'dining', amount: 100 }
        },
        {
          type: 'cashflow.transaction.added',
          payload: { type: 'expense', category: 'entertainment', amount: 200 }
        }
      ];

      const insights = service.analyzeCashFlowTrends(logs);

      // This test checks the utility function indirectly
      expect(service.getHighestExpenseCategory(logs)).toBe('entertainment');
    });
  });

  describe('Utility Functions', () => {
    it('should recommend asset class for diversification', () => {
      const portfolioData = {
        currentAllocation: {
          equity: 80,
          bonds: 10,
          cash: 5,
          international: 5
        }
      };

      const recommended = service.getRecommendedAssetClass(portfolioData);
      expect(recommended).toBe('cash');
    });

    it('should determine time period correctly', () => {
      const logs = [
        { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date().toISOString() }
      ];

      const period = service.getTimePeriod(logs);
      expect(period).toBe('day');
    });

    it('should get priority breakdown', () => {
      const insights = [
        { priority: 'high' },
        { priority: 'high' },
        { priority: 'medium' },
        { priority: 'low' }
      ];

      const breakdown = service.getPriorityBreakdown(insights);
      expect(breakdown.high).toBe(2);
      expect(breakdown.medium).toBe(1);
      expect(breakdown.low).toBe(1);
    });

    it('should filter insights by priority', () => {
      service.insights = [
        { priority: 'high', id: '1' },
        { priority: 'medium', id: '2' },
        { priority: 'high', id: '3' }
      ];

      const highPriority = service.getInsightsByPriority('high');
      expect(highPriority.length).toBe(2);
      expect(highPriority.every(i => i.priority === 'high')).toBe(true);
    });

    it('should get recent insights', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      
      service.insights = [
        { timestamp: now.toISOString(), id: '1' },
        { timestamp: yesterday.toISOString(), id: '2' }
      ];

      const recent = service.getRecentInsights();
      expect(recent.length).toBe(1);
      expect(recent[0].id).toBe('1');
    });

    it('should clear insights', () => {
      service.insights = [{ id: '1' }];
      service.lastAnalysisTime = new Date();

      service.clearInsights();

      expect(service.insights).toEqual([]);
      expect(service.lastAnalysisTime).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle execution log service errors', async () => {
      const error = new Error('Log service error');
      mockExecutionLogService.getLogs.mockRejectedValue(error);
      mockExecutionLogService.logError.mockResolvedValue();

      await expect(service.generateInsights(24)).rejects.toThrow('Log service error');
      expect(mockExecutionLogService.logError).toHaveBeenCalledWith('narrative.insights.failed', error, { hoursBack: 24 });
    });

    it('should handle malformed log data gracefully', () => {
      const logs = [
        { type: 'portfolio.analysis.run', payload: null },
        { type: 'spending.limit.breached', payload: {} }
      ];

      const portfolioInsights = service.analyzePortfolioChanges(logs);
      const budgetInsights = service.analyzeBudgetPatterns(logs);

      expect(portfolioInsights.length).toBe(0);
      expect(budgetInsights.length).toBe(1);
    });
  });
}); 