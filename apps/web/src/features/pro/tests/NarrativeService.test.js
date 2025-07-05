/**
 * NarrativeService.test.js
 * 
 * Purpose: Comprehensive unit tests for the NarrativeService to ensure
 * all narrative generation functionality works correctly including insight
 * generation, log analysis, and template processing.
 * 
 * Procedure:
 * 1. Test insight generation from execution logs
 * 2. Test portfolio change analysis
 * 3. Test budget pattern analysis
 * 4. Test rule trigger analysis
 * 5. Test cash flow trend analysis
 * 6. Test validation and error handling
 * 
 * Conclusion: These tests validate that the NarrativeService properly
 * generates insights, analyzes patterns, and provides meaningful narratives.
 */

import { describe, it, expect, beforeEach, jest, afterEach } from 'vitest';

// Mock the module at the top level
jest.mock('../../../core/services/ExecutionLogService.js');

// Import after mocks are set up
import { NarrativeService } from '../services/NarrativeService.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Set up the mock implementation after import
const mockLog = jest.fn().mockResolvedValue({ id: 'test-log-id' });
const mockLogError = jest.fn().mockResolvedValue({ id: 'test-error-id' });

// Mock the default export
executionLogService.log = mockLog;
executionLogService.logError = mockLogError;
executionLogService.logPortfolioAnalysis = jest.fn().mockResolvedValue({ id: 'test-portfolio-log-id' });
executionLogService.logSimulationRun = jest.fn().mockResolvedValue({ id: 'test-simulation-log-id' });
executionLogService.logBudgetForecast = jest.fn().mockResolvedValue({ id: 'test-budget-log-id' });
executionLogService.logRuleTriggered = jest.fn().mockResolvedValue({ id: 'test-rule-log-id' });
executionLogService.queryLogs = jest.fn().mockResolvedValue([]);
executionLogService.getSessionLogs = jest.fn().mockResolvedValue([]);
executionLogService.getComponentLogs = jest.fn().mockResolvedValue([]);
executionLogService.getPerformanceLogs = jest.fn().mockResolvedValue([]);
executionLogService.clearOldLogs = jest.fn().mockResolvedValue(0);
executionLogService.exportLogs = jest.fn().mockResolvedValue({ logs: [] });
executionLogService.decryptPayload = jest.fn().mockResolvedValue({});
executionLogService.generateId = jest.fn(() => 'test-id');
executionLogService.generateSessionId = jest.fn(() => 'test-session');
executionLogService.getUserId = jest.fn(() => 'test-user');
executionLogService.initDatabase = jest.fn().mockResolvedValue();
executionLogService.initEncryption = jest.fn().mockResolvedValue();
executionLogService.encryptPayload = jest.fn().mockResolvedValue('encrypted-data');
executionLogService.storeLog = jest.fn().mockResolvedValue();
executionLogService.getLogs = jest.fn().mockResolvedValue([]);

describe('NarrativeService', () => {
  let narrativeService;

  beforeEach(() => {
    narrativeService = new NarrativeService();
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Re-setup the mock functions with default resolved values
    executionLogService.log.mockResolvedValue({ id: 'test-log-id' });
    executionLogService.logError.mockResolvedValue({ id: 'test-error-id' });
    executionLogService.logPortfolioAnalysis.mockResolvedValue({ id: 'test-portfolio-log-id' });
    executionLogService.logSimulationRun.mockResolvedValue({ id: 'test-simulation-log-id' });
    executionLogService.logBudgetForecast.mockResolvedValue({ id: 'test-budget-log-id' });
    executionLogService.logRuleTriggered.mockResolvedValue({ id: 'test-rule-log-id' });
    executionLogService.queryLogs.mockResolvedValue([]);
    executionLogService.getSessionLogs.mockResolvedValue([]);
    executionLogService.getComponentLogs.mockResolvedValue([]);
    executionLogService.getPerformanceLogs.mockResolvedValue([]);
    executionLogService.clearOldLogs.mockResolvedValue(0);
    executionLogService.exportLogs.mockResolvedValue({ logs: [] });
    executionLogService.decryptPayload.mockResolvedValue({});
    executionLogService.generateId.mockReturnValue('test-id');
    executionLogService.generateSessionId.mockReturnValue('test-session');
    executionLogService.getUserId.mockReturnValue('test-user');
    executionLogService.initDatabase.mockResolvedValue();
    executionLogService.initEncryption.mockResolvedValue();
    executionLogService.encryptPayload.mockResolvedValue('encrypted-data');
    executionLogService.storeLog.mockResolvedValue();
    executionLogService.getLogs.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(narrativeService.insights).toEqual([]);
      expect(narrativeService.lastAnalysisTime).toBeNull();
    });

    it('should have insight templates defined', () => {
      // Access templates through a test method or check if they exist
      expect(narrativeService.analyzePortfolioChanges).toBeDefined();
      expect(narrativeService.analyzeBudgetPatterns).toBeDefined();
      expect(narrativeService.analyzeRuleTriggers).toBeDefined();
      expect(narrativeService.analyzeCashFlowTrends).toBeDefined();
    });
  });

  describe('Insight Generation', () => {
    it('should generate insights from execution logs', async () => {
      const mockLogs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {
            deviations: { equity: 10, bonds: -5 },
            diversificationScores: { overall: 45 }
          }
        }
      ];

      executionLogService.getLogs.mockResolvedValue(mockLogs);

      const insights = await narrativeService.generateInsights(24);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
      expect(narrativeService.insights).toEqual(insights);
      expect(narrativeService.lastAnalysisTime).toBeDefined();

      expect(executionLogService.log).toHaveBeenCalledWith(
        'narrative.insights.generated',
        expect.objectContaining({
          insightCount: expect.any(Number),
          hoursBack: 24,
          priorities: expect.any(Object)
        })
      );
    });

    it('should handle empty logs gracefully', async () => {
      executionLogService.getLogs.mockResolvedValue([]);

      const insights = await narrativeService.generateInsights(24);

      expect(insights).toEqual([]);
      expect(narrativeService.insights).toEqual([]);
    });

    it('should handle insight generation errors', async () => {
      executionLogService.getLogs.mockRejectedValue(new Error('Failed to get logs'));

      await expect(narrativeService.generateInsights(24))
        .rejects.toThrow('Failed to get logs');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'narrative.insights.failed',
        expect.any(Error),
        { hoursBack: 24 }
      );
    });

    it('should sort insights by priority and timestamp', async () => {
      const mockLogs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date(Date.now() - 1000).toISOString(),
          payload: { category: 'entertainment', amount: 500 }
        },
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: { deviations: { equity: 5 } }
        }
      ];

      executionLogService.getLogs.mockResolvedValue(mockLogs);

      const insights = await narrativeService.generateInsights(24);

      // High priority insights should come first
      const priorities = insights.map(insight => insight.priority);
      expect(priorities[0]).toBe('high');
    });
  });

  describe('Portfolio Analysis', () => {
    it('should analyze portfolio allocation changes', () => {
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

      const insights = narrativeService.analyzePortfolioChanges(logs);

      expect(insights.length).toBeGreaterThan(0);
      
      const equityInsight = insights.find(insight => 
        insight.data && insight.data.sector === 'equity'
      );
      expect(equityInsight).toBeDefined();
      expect(equityInsight.data.direction).toBe('increased');
      expect(equityInsight.data.percentage).toBe('15.0');
    });

    it('should analyze diversification scores', () => {
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

      const insights = narrativeService.analyzePortfolioChanges(logs);

      const diversificationInsight = insights.find(insight => 
        insight.type === 'diversification_low'
      );
      expect(diversificationInsight).toBeDefined();
      expect(diversificationInsight.data.score).toBe(35);
    });

    it('should handle portfolio logs without deviations', () => {
      const logs = [
        {
          type: 'portfolio.analysis.run',
          timestamp: new Date().toISOString(),
          payload: {}
        }
      ];

      const insights = narrativeService.analyzePortfolioChanges(logs);

      expect(insights).toEqual([]);
    });
  });

  describe('Budget Analysis', () => {
    it('should analyze budget spending patterns', () => {
      const logs = [
        {
          type: 'spending.limit.breached',
          timestamp: new Date().toISOString(),
          payload: {
            category: 'entertainment',
            overage: 200  // Changed from amount/limit to overage
          }
        }
      ];

      const insights = narrativeService.analyzeBudgetPatterns(logs);

      expect(insights.length).toBeGreaterThan(0);
      
      const budgetInsight = insights.find(insight => 
        insight.type === 'budget_overspending'
      );
      expect(budgetInsight).toBeDefined();
      expect(budgetInsight.data.category).toBe('entertainment');
      expect(budgetInsight.data.amount).toBe(200); // Now matches overage field
    });

    it('should analyze budget forecasts', () => {
      const logs = [
        {
          type: 'budget.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {
            projectedSpending: 5000,  // Changed from projectedOverspending
            totalBudget: 4200         // Added totalBudget field
          }
        }
      ];

      const insights = narrativeService.analyzeBudgetPatterns(logs);

      expect(insights.length).toBeGreaterThan(0);
      
      const forecastInsight = insights.find(insight => 
        insight.type === 'budget_forecast'
      );
      expect(forecastInsight).toBeDefined();
      expect(forecastInsight.data.outcome).toBe('exceed');
      expect(forecastInsight.data.amount).toBe('800'); // 5000 - 4200 = 800
    });

    it('should handle budget logs without relevant data', () => {
      const logs = [
        {
          type: 'budget.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {}
        }
      ];

      const insights = narrativeService.analyzeBudgetPatterns(logs);

      expect(insights).toEqual([]);
    });
  });

  describe('Rule Analysis', () => {
    it('should analyze rule triggers', () => {
      const logs = [
        {
          type: 'rule.triggered',
          timestamp: new Date(Date.now() - 1000).toISOString(),
          payload: {
            ruleName: 'Auto Rebalance'
          }
        },
        {
          type: 'rule.triggered',
          timestamp: new Date().toISOString(),
          payload: {
            ruleName: 'Auto Rebalance'
          }
        },
        {
          type: 'rule.triggered',
          timestamp: new Date().toISOString(),
          payload: {
            ruleName: 'Auto Rebalance'
          }
        }
      ];

      const insights = narrativeService.analyzeRuleTriggers(logs);

      expect(insights.length).toBeGreaterThan(0);
      
      const ruleInsight = insights.find(insight => 
        insight.type === 'rule_frequency'
      );
      expect(ruleInsight).toBeDefined();
      expect(ruleInsight.data.rule_name).toBe('Auto Rebalance');
      expect(ruleInsight.data.count).toBe(3);
      expect(ruleInsight.data.period).toBe('day'); // Within 24 hours
    });

    it('should handle rule logs without relevant data', () => {
      const logs = [
        {
          type: 'rule.triggered',
          timestamp: new Date().toISOString(),
          payload: {}
        }
      ];

      const insights = narrativeService.analyzeRuleTriggers(logs);

      expect(insights).toEqual([]);
    });
  });

  describe('Cash Flow Analysis', () => {
    it('should analyze cash flow trends', () => {
      const logs = [
        {
          type: 'cashflow.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {
            projectedCashFlow: -1200  // Changed from netCashFlow
          }
        }
      ];

      const insights = narrativeService.analyzeCashFlowTrends(logs);

      expect(insights.length).toBeGreaterThan(0);
      
      const cashFlowInsight = insights.find(insight => 
        insight.type === 'cash_flow_negative'
      );
      expect(cashFlowInsight).toBeDefined();
      expect(cashFlowInsight.data.amount).toBe('1200');
      expect(cashFlowInsight.data.category).toBe('discretionary'); // Default when no expense logs
    });

    it('should handle cash flow logs without relevant data', () => {
      const logs = [
        {
          type: 'cashflow.forecast.generated',
          timestamp: new Date().toISOString(),
          payload: {}
        }
      ];

      const insights = narrativeService.analyzeCashFlowTrends(logs);

      expect(insights).toEqual([]);
    });
  });

  describe('Utility Methods', () => {
    it('should get recommended asset class', () => {
      const portfolioData = {
        currentAllocation: {
          equity: 80,
          bonds: 15,
          cash: 5,
          international: 0  // Lowest allocation
        }
      };

      const recommended = narrativeService.getRecommendedAssetClass(portfolioData);
      expect(recommended).toBe('international'); // Should recommend lowest allocation
    });

    it('should get time period from logs', () => {
      const logs = [
        { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }, // 12 hours ago
        { timestamp: new Date().toISOString() }
      ];

      const period = narrativeService.getTimePeriod(logs);
      expect(period).toBe('day'); // Within 24 hours
    });

    it('should get highest expense category', () => {
      const logs = [
        {
          type: 'cashflow.transaction.added',
          payload: { 
            type: 'expense',
            category: 'housing', 
            amount: 1500 
          }
        },
        {
          type: 'cashflow.transaction.added',
          payload: { 
            type: 'expense',
            category: 'food', 
            amount: 800 
          }
        }
      ];

      const highest = narrativeService.getHighestExpenseCategory(logs);
      expect(highest).toBe('housing'); // Higher amount
    });

    it('should get priority breakdown', () => {
      const insights = [
        { priority: 'high' },
        { priority: 'medium' },
        { priority: 'high' },
        { priority: 'low' }
      ];

      const breakdown = narrativeService.getPriorityBreakdown(insights);
      expect(breakdown.high).toBe(2);
      expect(breakdown.medium).toBe(1);
      expect(breakdown.low).toBe(1);
    });

    it('should get insights by priority', () => {
      const insights = [
        { priority: 'high', id: '1' },
        { priority: 'medium', id: '2' },
        { priority: 'high', id: '3' }
      ];

      narrativeService.insights = insights;

      const highInsights = narrativeService.getInsightsByPriority('high');
      expect(highInsights).toHaveLength(2);
      expect(highInsights[0].id).toBe('1');
      expect(highInsights[1].id).toBe('3');
    });

    it('should get recent insights', () => {
      const insights = [
        { id: '1', timestamp: new Date().toISOString() },
        { id: '2', timestamp: new Date().toISOString() }
      ];

      narrativeService.insights = insights;

      const recent = narrativeService.getRecentInsights();
      expect(recent).toEqual(insights);
    });

    it('should clear insights', () => {
      narrativeService.insights = [{ id: '1' }, { id: '2' }];
      narrativeService.lastAnalysisTime = new Date();

      narrativeService.clearInsights();

      expect(narrativeService.insights).toEqual([]);
      expect(narrativeService.lastAnalysisTime).toBeNull();
    });
  });
});
