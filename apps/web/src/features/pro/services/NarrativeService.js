/**
 * NarrativeService.js
 * 
 * Purpose: Generates deterministic insights and narratives from execution logs
 * and financial state data to provide users with meaningful analysis and
 * recommendations.
 * 
 * Procedure:
 * 1. Analyzes execution logs for patterns and trends
 * 2. Generates template-based insights from financial data
 * 3. Provides actionable recommendations based on user behavior
 * 4. Creates time-based narratives for financial progress
 * 
 * Conclusion: Delivers personalized financial insights while maintaining
 * zero-knowledge compliance through local-only processing.
 */

import executionLogService from './ExecutionLogService.js';

// Insight templates for different types of analysis
const INSIGHT_TEMPLATES = {
  // Portfolio insights
  portfolio_allocation_change: {
    template: "Your {sector} allocation {direction} by {percentage}%",
    conditions: ['portfolio.analysis.run', 'portfolio.divergence.detected'],
    priority: 'medium'
  },
  
  // Budget insights
  budget_overspending: {
    template: "You've exceeded your {category} budget by ${amount} this month",
    conditions: ['spending.limit.breached'],
    priority: 'high'
  },
  
  budget_forecast: {
    template: "Based on current spending, you're projected to {outcome} your budget by ${amount}",
    conditions: ['budget.forecast.generated'],
    priority: 'medium'
  },
  
  // Cash flow insights
  cash_flow_negative: {
    template: "Your cash flow was negative ${amount} this month - consider reducing {category} spending",
    conditions: ['cashflow.forecast.generated'],
    priority: 'high'
  },
  
  // Rule engine insights
  rule_frequency: {
    template: "Rule '{rule_name}' has triggered {count} times this {period}",
    conditions: ['rule.triggered'],
    priority: 'medium'
  },
  
  // Goal progress insights
  goal_progress: {
    template: "You're {percentage}% toward your {goal_name} goal - {status}",
    conditions: ['goal.progress.updated'],
    priority: 'medium'
  },
  
  // Diversification insights
  diversification_low: {
    template: "Your portfolio diversification score is {score}/100 - consider adding more {asset_class}",
    conditions: ['portfolio.analysis.run'],
    priority: 'medium'
  }
};

class NarrativeService {
  constructor() {
    this.insights = [];
    this.lastAnalysisTime = null;
  }

  /**
   * Generate insights from recent execution logs
   * @param {number} hoursBack - Hours to look back for analysis
   * @returns {Array} Generated insights
   */
  async generateInsights(hoursBack = 24) {
    try {
      const logs = await executionLogService.getLogs(hoursBack);
      const insights = [];

      // Analyze portfolio changes
      const portfolioInsights = this.analyzePortfolioChanges(logs);
      insights.push(...portfolioInsights);

      // Analyze budget patterns
      const budgetInsights = this.analyzeBudgetPatterns(logs);
      insights.push(...budgetInsights);

      // Analyze rule triggers
      const ruleInsights = this.analyzeRuleTriggers(logs);
      insights.push(...ruleInsights);

      // Analyze cash flow trends
      const cashFlowInsights = this.analyzeCashFlowTrends(logs);
      insights.push(...cashFlowInsights);

      // Sort by priority and timestamp
      insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority] || 
               new Date(b.timestamp) - new Date(a.timestamp);
      });

      this.insights = insights;
      this.lastAnalysisTime = new Date();

      await executionLogService.log('narrative.insights.generated', {
        insightCount: insights.length,
        hoursBack,
        priorities: this.getPriorityBreakdown(insights)
      });

      return insights;
    } catch (error) {
      await executionLogService.logError('narrative.insights.failed', error, { hoursBack });
      throw error;
    }
  }

  /**
   * Analyze portfolio allocation changes
   * @param {Array} logs - Execution logs
   * @returns {Array} Portfolio insights
   */
  analyzePortfolioChanges(logs) {
    const insights = [];
    const portfolioLogs = logs.filter(log => 
      log.type === 'portfolio.analysis.run' || 
      log.type === 'portfolio.divergence.detected'
    );

    if (portfolioLogs.length === 0) return insights;

    // Find the most recent portfolio analysis
    const latestAnalysis = portfolioLogs[portfolioLogs.length - 1];
    
    if (latestAnalysis.payload && latestAnalysis.payload.deviations) {
      Object.entries(latestAnalysis.payload.deviations).forEach(([assetClass, deviation]) => {
        if (Math.abs(deviation) > 5) {
          const direction = deviation > 0 ? 'increased' : 'decreased';
          const percentage = Math.abs(deviation).toFixed(1);
          
          insights.push({
            id: `portfolio_${assetClass}_${Date.now()}`,
            type: 'portfolio_allocation_change',
            template: INSIGHT_TEMPLATES.portfolio_allocation_change.template,
            data: {
              sector: assetClass,
              direction,
              percentage
            },
            priority: INSIGHT_TEMPLATES.portfolio_allocation_change.priority,
            timestamp: latestAnalysis.timestamp,
            message: `Your ${assetClass} allocation ${direction} by ${percentage}%`
          });
        }
      });
    }

    // Check diversification score
    if (latestAnalysis.payload && latestAnalysis.payload.diversificationScores) {
      const score = latestAnalysis.payload.diversificationScores.overall;
      if (score < 50) {
        insights.push({
          id: `diversification_${Date.now()}`,
          type: 'diversification_low',
          template: INSIGHT_TEMPLATES.diversification_low.template,
          data: {
            score,
            asset_class: this.getRecommendedAssetClass(latestAnalysis.payload)
          },
          priority: INSIGHT_TEMPLATES.diversification_low.priority,
          timestamp: latestAnalysis.timestamp,
          message: `Your portfolio diversification score is ${score}/100 - consider adding more bonds`
        });
      }
    }

    return insights;
  }

  /**
   * Analyze budget spending patterns
   * @param {Array} logs - Execution logs
   * @returns {Array} Budget insights
   */
  analyzeBudgetPatterns(logs) {
    const insights = [];
    const budgetLogs = logs.filter(log => 
      log.type === 'spending.limit.breached' || 
      log.type === 'budget.forecast.generated'
    );

    // Analyze spending limit breaches
    const breaches = budgetLogs.filter(log => log.type === 'spending.limit.breached');
    breaches.forEach(breach => {
      if (breach.payload) {
        insights.push({
          id: `budget_breach_${breach.timestamp}`,
          type: 'budget_overspending',
          template: INSIGHT_TEMPLATES.budget_overspending.template,
          data: {
            category: breach.payload.category || 'budget',
            amount: breach.payload.overage || 0
          },
          priority: INSIGHT_TEMPLATES.budget_overspending.priority,
          timestamp: breach.timestamp,
          message: `You've exceeded your ${breach.payload.category || 'budget'} budget by $${breach.payload.overage || 0} this month`
        });
      }
    });

    // Analyze budget forecasts
    const forecasts = budgetLogs.filter(log => log.type === 'budget.forecast.generated');
    if (forecasts.length > 0) {
      const latestForecast = forecasts[forecasts.length - 1];
      if (latestForecast.payload && latestForecast.payload.projectedSpending > latestForecast.payload.totalBudget) {
        const overage = latestForecast.payload.projectedSpending - latestForecast.payload.totalBudget;
        insights.push({
          id: `budget_forecast_${latestForecast.timestamp}`,
          type: 'budget_forecast',
          template: INSIGHT_TEMPLATES.budget_forecast.template,
          data: {
            outcome: 'exceed',
            amount: overage.toFixed(0)
          },
          priority: INSIGHT_TEMPLATES.budget_forecast.priority,
          timestamp: latestForecast.timestamp,
          message: `Based on current spending, you're projected to exceed your budget by $${overage.toFixed(0)}`
        });
      }
    }

    return insights;
  }

  /**
   * Analyze rule engine triggers
   * @param {Array} logs - Execution logs
   * @returns {Array} Rule insights
   */
  analyzeRuleTriggers(logs) {
    const insights = [];
    const ruleLogs = logs.filter(log => log.type === 'rule.triggered');

    // Group by rule name and count frequency
    const ruleCounts = {};
    ruleLogs.forEach(log => {
      const ruleName = log.payload?.ruleName || 'Unknown Rule';
      ruleCounts[ruleName] = (ruleCounts[ruleName] || 0) + 1;
    });

    Object.entries(ruleCounts).forEach(([ruleName, count]) => {
      if (count > 1) {
        const period = this.getTimePeriod(ruleLogs);
        insights.push({
          id: `rule_frequency_${ruleName}_${Date.now()}`,
          type: 'rule_frequency',
          template: INSIGHT_TEMPLATES.rule_frequency.template,
          data: {
            rule_name: ruleName,
            count,
            period
          },
          priority: INSIGHT_TEMPLATES.rule_frequency.priority,
          timestamp: new Date().toISOString(),
          message: `Rule '${ruleName}' has triggered ${count} times this ${period}`
        });
      }
    });

    return insights;
  }

  /**
   * Analyze cash flow trends
   * @param {Array} logs - Execution logs
   * @returns {Array} Cash flow insights
   */
  analyzeCashFlowTrends(logs) {
    const insights = [];
    const cashFlowLogs = logs.filter(log => 
      log.type === 'cashflow.forecast.generated' ||
      log.type === 'cashflow.transaction.added'
    );

    // Check for negative cash flow
    const forecasts = cashFlowLogs.filter(log => log.type === 'cashflow.forecast.generated');
    if (forecasts.length > 0) {
      const latestForecast = forecasts[forecasts.length - 1];
      if (latestForecast.payload && latestForecast.payload.projectedCashFlow < 0) {
        const amount = Math.abs(latestForecast.payload.projectedCashFlow);
        insights.push({
          id: `cashflow_negative_${latestForecast.timestamp}`,
          type: 'cash_flow_negative',
          template: INSIGHT_TEMPLATES.cash_flow_negative.template,
          data: {
            amount: amount.toFixed(0),
            category: this.getHighestExpenseCategory(cashFlowLogs)
          },
          priority: INSIGHT_TEMPLATES.cash_flow_negative.priority,
          timestamp: latestForecast.timestamp,
          message: `Your cash flow was negative $${amount.toFixed(0)} this month - consider reducing discretionary spending`
        });
      }
    }

    return insights;
  }

  /**
   * Get recommended asset class for diversification
   * @param {Object} portfolioData - Portfolio analysis data
   * @returns {string} Recommended asset class
   */
  getRecommendedAssetClass(portfolioData) {
    if (!portfolioData.currentAllocation) return 'bonds';
    
    const allocation = portfolioData.currentAllocation;
    const allocations = {
      equity: allocation.equity || 0,
      bonds: allocation.bonds || 0,
      cash: allocation.cash || 0,
      international: allocation.international || 0
    };

    // Find the lowest allocation
    const minAllocation = Math.min(...Object.values(allocations));
    const recommended = Object.keys(allocations).find(key => allocations[key] === minAllocation);
    
    return recommended || 'bonds';
  }

  /**
   * Get time period for rule frequency analysis
   * @param {Array} logs - Rule trigger logs
   * @returns {string} Time period
   */
  getTimePeriod(logs) {
    if (logs.length === 0) return 'period';
    
    const timestamps = logs.map(log => new Date(log.timestamp));
    const timeSpan = Math.max(...timestamps) - Math.min(...timestamps);
    const hours = timeSpan / (1000 * 60 * 60);
    
    if (hours < 24) return 'day';
    if (hours < 168) return 'week';
    return 'month';
  }

  /**
   * Get highest expense category from cash flow logs
   * @param {Array} logs - Cash flow logs
   * @returns {string} Category name
   */
  getHighestExpenseCategory(logs) {
    const expenseLogs = logs.filter(log => 
      log.type === 'cashflow.transaction.added' && 
      log.payload?.type === 'expense'
    );

    const categoryTotals = {};
    expenseLogs.forEach(log => {
      const category = log.payload?.category || 'other';
      categoryTotals[category] = (categoryTotals[category] || 0) + (log.payload?.amount || 0);
    });

    if (Object.keys(categoryTotals).length === 0) return 'discretionary';

    const maxCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    return maxCategory;
  }

  /**
   * Get priority breakdown of insights
   * @param {Array} insights - Generated insights
   * @returns {Object} Priority counts
   */
  getPriorityBreakdown(insights) {
    return insights.reduce((acc, insight) => {
      acc[insight.priority] = (acc[insight.priority] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Get insights by priority
   * @param {string} priority - Priority level (high, medium, low)
   * @returns {Array} Filtered insights
   */
  getInsightsByPriority(priority) {
    return this.insights.filter(insight => insight.priority === priority);
  }

  /**
   * Get recent insights (last 24 hours)
   * @returns {Array} Recent insights
   */
  getRecentInsights() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.insights.filter(insight => new Date(insight.timestamp) > cutoff);
  }

  /**
   * Clear stored insights
   */
  clearInsights() {
    this.insights = [];
    this.lastAnalysisTime = null;
  }
}

// Export singleton instance
const narrativeService = new NarrativeService();
export default narrativeService;

// Also export the class for testing
export { NarrativeService }; 