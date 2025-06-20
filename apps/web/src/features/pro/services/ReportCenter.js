/**
 * ReportCenter.js - AlphaPro VX.0
 *
 * Purpose: Centralized reporting engine for AlphaPro. Generates budget heatmaps,
 * optimizer change maps, and dashboard mode reports for user insight and review.
 *
 * Procedure:
 * 1. Accepts financial state, budget, and optimizer data
 * 2. Generates visual and tabular reports (heatmaps, change maps)
 * 3. Supports dashboard mode-specific reporting
 * 4. Integrates with ExecutionLogService for auditability
 *
 * Conclusion: Provides actionable, visual, and exportable reports for all AlphaPro dashboard modes.
 */

import executionLogService from '../../../core/services/ExecutionLogService.js';

class ReportCenter {
  /**
   * Generate a budget heatmap
   * @param {Array} budgetData - Array of budget objects by category/month
   * @returns {Object} Heatmap data
   */
  async generateBudgetHeatmap(budgetData) {
    // Group by category and month, sum amounts
    const heatmap = {};
    for (const entry of budgetData) {
      const { category, month, amount } = entry;
      if (!heatmap[category]) heatmap[category] = {};
      if (!heatmap[category][month]) heatmap[category][month] = 0;
      heatmap[category][month] += amount;
    }
    await executionLogService.log('report.budget.heatmap.generated', { categories: Object.keys(heatmap) });
    return heatmap;
  }

  /**
   * Generate an optimizer change map
   * @param {Array} optimizerHistory - Array of optimizer state snapshots
   * @returns {Object} Change map data
   */
  async generateOptimizerChangeMap(optimizerHistory) {
    // Compare consecutive snapshots for changes
    const changeMap = [];
    for (let i = 1; i < optimizerHistory.length; i++) {
      const prev = optimizerHistory[i - 1];
      const curr = optimizerHistory[i];
      const changes = {};
      for (const key in curr) {
        if (curr[key] !== prev[key]) {
          changes[key] = { from: prev[key], to: curr[key] };
        }
      }
      changeMap.push({ index: i, changes });
    }
    await executionLogService.log('report.optimizer.changemap.generated', { count: changeMap.length });
    return changeMap;
  }

  /**
   * Generate a dashboard mode report
   * @param {string} mode - Dashboard mode ('Planner', 'Investor', 'Minimalist')
   * @param {Object} state - App state relevant to the mode
   * @returns {Object} Mode-specific report
   */
  async generateDashboardReport(mode, state) {
    let report = { mode, summary: {}, details: {} };
    switch (mode) {
      case 'Planner':
        report.summary = { budgets: state.budgets.length, rules: state.rules.length };
        report.details = { budgets: state.budgets, rules: state.rules };
        break;
      case 'Investor':
        report.summary = { portfolios: state.portfolios.length, netWorth: state.netWorth };
        report.details = { portfolios: state.portfolios };
        break;
      case 'Minimalist':
        report.summary = { activeGoals: state.goals.length };
        report.details = { goals: state.goals };
        break;
      default:
        report.summary = { message: 'Unknown mode' };
    }
    await executionLogService.log('report.dashboard.generated', { mode });
    return report;
  }
}

const reportCenter = new ReportCenter();
export default reportCenter;
export { ReportCenter }; 