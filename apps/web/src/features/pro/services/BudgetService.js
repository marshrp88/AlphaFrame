/**
 * BudgetService.js
 * 
 * Purpose: Manages budgeting functionality including envelope budgeting,
 * category-based budgeting, predictive monthly caps, and budget forecasting
 * for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Handles envelope and category budgeting toggle
 * 2. Calculates predictive monthly spending caps
 * 3. Generates 30/60/90 day budget forecasts
 * 4. Tracks spending against budget limits
 * 5. Logs budget events via ExecutionLogService
 * 
 * Conclusion: Provides comprehensive budgeting tools with predictive
 * analytics while maintaining zero-knowledge compliance.
 */

import executionLogService from '../../../core/services/ExecutionLogService.js';

// Default budget categories
const DEFAULT_CATEGORIES = {
  housing: { name: 'Housing', type: 'essential', monthlyCap: 0 },
  transportation: { name: 'Transportation', type: 'essential', monthlyCap: 0 },
  food: { name: 'Food & Dining', type: 'essential', monthlyCap: 0 },
  utilities: { name: 'Utilities', type: 'essential', monthlyCap: 0 },
  healthcare: { name: 'Healthcare', type: 'essential', monthlyCap: 0 },
  entertainment: { name: 'Entertainment', type: 'discretionary', monthlyCap: 0 },
  shopping: { name: 'Shopping', type: 'discretionary', monthlyCap: 0 },
  travel: { name: 'Travel', type: 'discretionary', monthlyCap: 0 },
  savings: { name: 'Savings', type: 'savings', monthlyCap: 0 },
  debt: { name: 'Debt Payment', type: 'essential', monthlyCap: 0 }
};

class BudgetService {
  constructor() {
    this.categories = { ...DEFAULT_CATEGORIES };
    this.budgetType = 'category'; // 'category' or 'envelope'
    this.monthlyIncome = 0;
    this.emergencyFund = 0;
    this.budgets = {};
  }

  /**
   * Initialize budget with income and emergency fund
   * @param {number} monthlyIncome - Monthly income amount
   * @param {number} emergencyFund - Emergency fund amount
   * @param {string} budgetType - 'category' or 'envelope'
   */
  async initializeBudget(monthlyIncome, emergencyFund = 0, budgetType = 'category') {
    try {
      this.monthlyIncome = monthlyIncome;
      this.emergencyFund = emergencyFund;
      this.budgetType = budgetType;

      // Calculate default monthly caps based on income
      this.calculateDefaultCaps();

      await executionLogService.logBudgetForecast({
        action: 'budget.initialized',
        monthlyIncome,
        emergencyFund,
        budgetType,
        categories: Object.keys(this.categories).length
      });

      return {
        monthlyIncome,
        emergencyFund,
        budgetType,
        categories: this.categories
      };
    } catch (error) {
      await executionLogService.logError('budget.initialization.failed', error, {
        monthlyIncome,
        emergencyFund,
        budgetType
      });
      throw error;
    }
  }

  /**
   * Calculate default monthly caps based on income
   */
  calculateDefaultCaps() {
    const essentialPercentage = 0.5; // 50% for essentials
    const discretionaryPercentage = 0.3; // 30% for discretionary
    const savingsPercentage = 0.2; // 20% for savings

    const essentialBudget = this.monthlyIncome * essentialPercentage;
    const discretionaryBudget = this.monthlyIncome * discretionaryPercentage;
    const savingsBudget = this.monthlyIncome * savingsPercentage;

    // Distribute essential budget across essential categories
    const essentialCategories = Object.entries(this.categories)
      .filter(([, category]) => category.type === 'essential');
    
    const essentialPerCategory = essentialBudget / essentialCategories.length;

    essentialCategories.forEach(([key]) => {
      this.categories[key].monthlyCap = essentialPerCategory;
    });

    // Distribute discretionary budget
    const discretionaryCategories = Object.entries(this.categories)
      .filter(([, category]) => category.type === 'discretionary');
    
    const discretionaryPerCategory = discretionaryBudget / discretionaryCategories.length;

    discretionaryCategories.forEach(([key]) => {
      this.categories[key].monthlyCap = discretionaryPerCategory;
    });

    // Set savings
    this.categories.savings.monthlyCap = savingsBudget;
  }

  /**
   * Update category monthly cap
   * @param {string} categoryKey - Category key
   * @param {number} monthlyCap - New monthly cap
   */
  async updateCategoryCap(categoryKey, monthlyCap) {
    if (!this.categories[categoryKey]) {
      throw new Error(`Category '${categoryKey}' not found`);
    }

    this.categories[categoryKey].monthlyCap = monthlyCap;

    await executionLogService.logBudgetForecast({
      action: 'category.cap.updated',
      category: categoryKey,
      newCap: monthlyCap
    });
  }

  /**
   * Add new budget category
   * @param {string} key - Category key
   * @param {string} name - Category name
   * @param {string} type - Category type ('essential', 'discretionary', 'savings')
   * @param {number} monthlyCap - Monthly cap
   */
  async addCategory(key, name, type, monthlyCap = 0) {
    if (this.categories[key]) {
      throw new Error(`Category '${key}' already exists`);
    }

    this.categories[key] = {
      name,
      type,
      monthlyCap
    };

    await executionLogService.logBudgetForecast({
      action: 'category.added',
      category: key,
      name,
      type,
      monthlyCap
    });
  }

  /**
   * Remove budget category
   * @param {string} categoryKey - Category key to remove
   */
  async removeCategory(categoryKey) {
    if (!this.categories[categoryKey]) {
      throw new Error(`Category '${categoryKey}' not found`);
    }

    delete this.categories[categoryKey];

    await executionLogService.logBudgetForecast({
      action: 'category.removed',
      category: categoryKey
    });
  }

  /**
   * Generate budget forecast for specified days
   * @param {number} days - Number of days to forecast (30, 60, 90)
   * @param {Array} spendingHistory - Historical spending data
   * @returns {Object} Budget forecast
   */
  async generateForecast(days, spendingHistory = []) {
    try {
      const months = Math.ceil(days / 30);
      const forecast = {
        period: days,
        months,
        totalBudget: 0,
        projectedSpending: 0,
        projectedSavings: 0,
        categoryForecasts: {},
        warnings: [],
        recommendations: []
      };

      // Calculate total budget for the period
      forecast.totalBudget = this.monthlyIncome * months;

      // Calculate projected spending based on history
      if (spendingHistory.length > 0) {
        const avgMonthlySpending = this.calculateAverageMonthlySpending(spendingHistory);
        forecast.projectedSpending = avgMonthlySpending * months;
      } else {
        // Use category caps as baseline
        forecast.projectedSpending = Object.values(this.categories)
          .reduce((sum, category) => sum + category.monthlyCap, 0) * months;
      }

      // Calculate projected savings
      forecast.projectedSavings = forecast.totalBudget - forecast.projectedSpending;

      // Generate category forecasts
      Object.entries(this.categories).forEach(([key, category]) => {
        const categorySpending = this.calculateCategorySpending(key, spendingHistory);
        const projectedCategorySpending = categorySpending * months;
        const categoryBudget = category.monthlyCap * months;

        forecast.categoryForecasts[key] = {
          name: category.name,
          type: category.type,
          budget: categoryBudget,
          projectedSpending: projectedCategorySpending,
          variance: categoryBudget - projectedCategorySpending,
          status: this.getCategoryStatus(categoryBudget, projectedCategorySpending)
        };
      });

      // Generate warnings and recommendations
      this.generateWarningsAndRecommendations(forecast);

      await executionLogService.logBudgetForecast({
        action: 'forecast.generated',
        days,
        totalBudget: forecast.totalBudget,
        projectedSpending: forecast.projectedSpending,
        projectedSavings: forecast.projectedSavings,
        warnings: forecast.warnings.length
      });

      return forecast;
    } catch (error) {
      await executionLogService.logError('budget.forecast.failed', error, { days });
      throw error;
    }
  }

  /**
   * Calculate average monthly spending from history
   * @param {Array} spendingHistory - Historical spending data
   * @returns {number} Average monthly spending
   */
  calculateAverageMonthlySpending(spendingHistory) {
    if (spendingHistory.length === 0) return 0;

    const totalSpending = spendingHistory.reduce((sum, transaction) => sum + transaction.amount, 0);
    const months = this.calculateMonthsFromHistory(spendingHistory);

    return months > 0 ? totalSpending / months : 0;
  }

  /**
   * Calculate months covered by spending history
   * @param {Array} spendingHistory - Historical spending data
   * @returns {number} Number of months
   */
  calculateMonthsFromHistory(spendingHistory) {
    if (spendingHistory.length === 0) return 0;

    const dates = spendingHistory.map(t => new Date(t.date)).sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    const months = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
      (lastDate.getMonth() - firstDate.getMonth()) + 1;

    return Math.max(1, months);
  }

  /**
   * Calculate spending for specific category
   * @param {string} categoryKey - Category key
   * @param {Array} spendingHistory - Historical spending data
   * @returns {number} Average monthly spending for category
   */
  calculateCategorySpending(categoryKey, spendingHistory) {
    const categoryTransactions = spendingHistory.filter(t => t.category === categoryKey);
    const totalCategorySpending = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const months = this.calculateMonthsFromHistory(spendingHistory);

    return months > 0 ? totalCategorySpending / months : 0;
  }

  /**
   * Get category status based on budget vs projected spending
   * @param {number} budget - Category budget
   * @param {number} projectedSpending - Projected spending
   * @returns {string} Status ('under', 'over', 'on-track')
   */
  getCategoryStatus(budget, projectedSpending) {
    const variance = budget - projectedSpending;
    const percentage = budget > 0 ? (variance / budget) * 100 : 0;

    if (percentage > 10) return 'under';
    if (percentage < -10) return 'over';
    return 'on-track';
  }

  /**
   * Generate warnings and recommendations for forecast
   * @param {Object} forecast - Budget forecast
   */
  generateWarningsAndRecommendations(forecast) {
    // Check for overspending
    if (forecast.projectedSpending > forecast.totalBudget) {
      forecast.warnings.push({
        type: 'overspending',
        message: `Projected spending exceeds budget by $${(forecast.projectedSpending - forecast.totalBudget).toLocaleString()}`,
        severity: 'high'
      });

      forecast.recommendations.push({
        type: 'reduce_spending',
        message: 'Consider reducing discretionary spending to stay within budget',
        priority: 'high'
      });
    }

    // Check for low savings
    const savingsRate = forecast.projectedSavings / forecast.totalBudget;
    if (savingsRate < 0.1) {
      forecast.warnings.push({
        type: 'low_savings',
        message: `Savings rate is ${(savingsRate * 100).toFixed(1)}%, below recommended 10%`,
        severity: 'medium'
      });

      forecast.recommendations.push({
        type: 'increase_savings',
        message: 'Consider increasing savings allocation to build emergency fund',
        priority: 'medium'
      });
    }

    // Check individual categories
    Object.entries(forecast.categoryForecasts).forEach(([, category]) => {
      if (category.status === 'over') {
        forecast.warnings.push({
          type: 'category_overspending',
          message: `${category.name} is projected to exceed budget by $${Math.abs(category.variance).toLocaleString()}`,
          severity: 'medium'
        });
      }
    });
  }

  /**
   * Check if spending limit is breached
   * @param {string} categoryKey - Category key
   * @param {number} currentSpending - Current spending amount
   * @returns {Object} Breach status
   */
  async checkSpendingLimit(categoryKey, currentSpending) {
    const category = this.categories[categoryKey];
    if (!category) {
      throw new Error(`Category '${categoryKey}' not found`);
    }

    const remaining = category.monthlyCap - currentSpending;
    const percentageUsed = category.monthlyCap > 0 ? (currentSpending / category.monthlyCap) * 100 : 0;

    const breach = {
      category: categoryKey,
      limit: category.monthlyCap,
      current: currentSpending,
      remaining,
      percentageUsed,
      isBreached: currentSpending > category.monthlyCap,
      isWarning: percentageUsed > 80 && percentageUsed <= 100
    };

    if (breach.isBreached) {
      await executionLogService.log('spending.limit.breached', {
        category: categoryKey,
        limit: category.monthlyCap,
        current: currentSpending,
        overage: currentSpending - category.monthlyCap
      }, 'warning');
    } else if (breach.isWarning) {
      await executionLogService.log('spending.limit.warning', {
        category: categoryKey,
        limit: category.monthlyCap,
        current: currentSpending,
        percentageUsed
      }, 'warning');
    }

    return breach;
  }

  /**
   * Get budget summary
   * @returns {Object} Budget summary
   */
  getBudgetSummary() {
    const totalBudget = Object.values(this.categories)
      .reduce((sum, category) => sum + category.monthlyCap, 0);

    const essentialBudget = Object.values(this.categories)
      .filter(category => category.type === 'essential')
      .reduce((sum, category) => sum + category.monthlyCap, 0);

    const discretionaryBudget = Object.values(this.categories)
      .filter(category => category.type === 'discretionary')
      .reduce((sum, category) => sum + category.monthlyCap, 0);

    const savingsBudget = Object.values(this.categories)
      .filter(category => category.type === 'savings')
      .reduce((sum, category) => sum + category.monthlyCap, 0);

    return {
      monthlyIncome: this.monthlyIncome,
      totalBudget,
      essentialBudget,
      discretionaryBudget,
      savingsBudget,
      budgetType: this.budgetType,
      emergencyFund: this.emergencyFund,
      categories: Object.keys(this.categories).length,
      monthlyExpenses: this.monthlyIncome - totalBudget,
      savingsRate: savingsBudget / totalBudget
    };
  }

  /**
   * Get all categories
   * @returns {Object} All budget categories
   */
  getCategories() {
    return { ...this.categories };
  }

  /**
   * Get budget type
   * @returns {string} Current budget type
   */
  getBudgetType() {
    return this.budgetType;
  }

  setBudget(category, amount) {
    this.budgets[category] = amount;
  }

  getBudget(category) {
    return this.budgets[category] || 0;
  }
}

// Export singleton instance
const budgetService = new BudgetService();
export default budgetService;

// Also export the class for testing
export { BudgetService }; 