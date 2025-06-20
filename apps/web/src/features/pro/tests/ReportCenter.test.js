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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportCenter } from '../services/ReportCenter.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

vi.mock('../../../core/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn(),
    logError: vi.fn()
  }
}));

describe('ReportCenter', () => {
  let reportCenter;
  beforeEach(() => {
    reportCenter = new ReportCenter();
    executionLogService.log.mockClear();
    executionLogService.logError.mockClear();
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