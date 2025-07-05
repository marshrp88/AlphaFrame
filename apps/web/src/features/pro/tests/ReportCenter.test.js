/**
 * ReportCenter.test.js
 *
 * Purpose: Unit tests for the ReportCenter service, covering all report generation features.
 *
 * Procedure:
 * 1. Test budget heatmap generation
 * 2. Test optimizer change map generation
 * 3. Test dashboard mode report generation for all modes
 * 4. Test error handling and edge cases
 *
 * Conclusion: Ensures ReportCenter provides correct, actionable, and auditable reports.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the module at the top level
vi.mock('../../../core/services/ExecutionLogService.js');

// Import after mocks are set up
import { ReportCenter } from '../services/ReportCenter.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Set up the mock implementation after import
const mockLog = vi.fn().mockResolvedValue({ id: 'test-log-id' });
const mockLogError = vi.fn().mockResolvedValue({ id: 'test-error-id' });

// Mock the default export
executionLogService.log = mockLog;
executionLogService.logError = mockLogError;
executionLogService.logPortfolioAnalysis = vi.fn().mockResolvedValue({ id: 'test-portfolio-log-id' });
executionLogService.logSimulationRun = vi.fn().mockResolvedValue({ id: 'test-simulation-log-id' });
executionLogService.logBudgetForecast = vi.fn().mockResolvedValue({ id: 'test-budget-log-id' });
executionLogService.logRuleTriggered = vi.fn().mockResolvedValue({ id: 'test-rule-log-id' });
executionLogService.queryLogs = vi.fn().mockResolvedValue([]);
executionLogService.getSessionLogs = vi.fn().mockResolvedValue([]);
executionLogService.getComponentLogs = vi.fn().mockResolvedValue([]);
executionLogService.getPerformanceLogs = vi.fn().mockResolvedValue([]);
executionLogService.clearOldLogs = vi.fn().mockResolvedValue(0);
executionLogService.exportLogs = vi.fn().mockResolvedValue({ logs: [] });
executionLogService.decryptPayload = vi.fn().mockResolvedValue({});
executionLogService.generateId = vi.fn(() => 'test-id');
executionLogService.generateSessionId = vi.fn(() => 'test-session');
executionLogService.getUserId = vi.fn(() => 'test-user');
executionLogService.initDatabase = vi.fn().mockResolvedValue();
executionLogService.initEncryption = vi.fn().mockResolvedValue();
executionLogService.encryptPayload = vi.fn().mockResolvedValue('encrypted-data');
executionLogService.storeLog = vi.fn().mockResolvedValue();

describe('ReportCenter', () => {
  let reportCenter;
  beforeEach(() => {
    reportCenter = new ReportCenter();
    
    // Reset all mocks before each test
    vi.clearAllMocks();
    
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
  });

  it('should generate a correct budget heatmap', async () => {
    const budgetData = [
      { category: 'Food', month: '2024-01', amount: 200 },
      { category: 'Food', month: '2024-02', amount: 180 },
      { category: 'Rent', month: '2024-01', amount: 1000 },
      { category: 'Rent', month: '2024-02', amount: 1000 }
    ];
    const heatmap = await reportCenter.generateBudgetHeatmap(budgetData);
    expect(heatmap.Food['2024-01']).toBe(200);
    expect(heatmap.Food['2024-02']).toBe(180);
    expect(heatmap.Rent['2024-01']).toBe(1000);
    expect(heatmap.Rent['2024-02']).toBe(1000);
    expect(executionLogService.log).toHaveBeenCalledWith('report.budget.heatmap.generated', expect.any(Object));
  });

  it('should generate an optimizer change map', async () => {
    const optimizerHistory = [
      { a: 1, b: 2 },
      { a: 2, b: 2 },
      { a: 2, b: 3 }
    ];
    const changeMap = await reportCenter.generateOptimizerChangeMap(optimizerHistory);
    expect(changeMap.length).toBe(2);
    expect(changeMap[0].changes).toHaveProperty('a');
    expect(changeMap[1].changes).toHaveProperty('b');
    expect(executionLogService.log).toHaveBeenCalledWith('report.optimizer.changemap.generated', expect.any(Object));
  });

  it('should generate dashboard report for Planner mode', async () => {
    const state = { budgets: [{}, {}], rules: [{}] };
    const report = await reportCenter.generateDashboardReport('Planner', state);
    expect(report.mode).toBe('Planner');
    expect(report.summary.budgets).toBe(2);
    expect(report.summary.rules).toBe(1);
    expect(executionLogService.log).toHaveBeenCalledWith('report.dashboard.generated', { mode: 'Planner' });
  });

  it('should generate dashboard report for Investor mode', async () => {
    const state = { portfolios: [{}, {}], netWorth: 50000 };
    const report = await reportCenter.generateDashboardReport('Investor', state);
    expect(report.mode).toBe('Investor');
    expect(report.summary.portfolios).toBe(2);
    expect(report.summary.netWorth).toBe(50000);
    expect(executionLogService.log).toHaveBeenCalledWith('report.dashboard.generated', { mode: 'Investor' });
  });

  it('should generate dashboard report for Minimalist mode', async () => {
    const state = { goals: [{}, {}, {}] };
    const report = await reportCenter.generateDashboardReport('Minimalist', state);
    expect(report.mode).toBe('Minimalist');
    expect(report.summary.activeGoals).toBe(3);
    expect(executionLogService.log).toHaveBeenCalledWith('report.dashboard.generated', { mode: 'Minimalist' });
  });

  it('should handle unknown dashboard mode', async () => {
    const state = {};
    const report = await reportCenter.generateDashboardReport('Unknown', state);
    expect(report.summary.message).toBe('Unknown mode');
    expect(executionLogService.log).toHaveBeenCalledWith('report.dashboard.generated', { mode: 'Unknown' });
  });
}); 