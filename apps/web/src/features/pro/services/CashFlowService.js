/**
 * CashFlowService.js
 * 
 * Purpose: Manages cash flow analysis, income tracking, expense categorization,
 * and cash flow forecasting for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Tracks income sources and recurring expenses
 * 2. Analyzes cash flow patterns and trends
 * 3. Generates cash flow forecasts and projections
 * 4. Identifies cash flow issues and opportunities
 * 5. Logs cash flow events via ExecutionLogService
 * 
 * Conclusion: Provides comprehensive cash flow management tools
 * with predictive analytics while maintaining zero-knowledge compliance.
 */

import executionLogService from '../../../core/services/ExecutionLogService.js';

// Default income and expense categories
const DEFAULT_INCOME_CATEGORIES = {
  salary: { name: 'Salary', type: 'recurring', frequency: 'monthly' },
  bonus: { name: 'Bonus', type: 'variable', frequency: 'annual' },
  investment: { name: 'Investment Income', type: 'variable', frequency: 'monthly' },
  rental: { name: 'Rental Income', type: 'recurring', frequency: 'monthly' },
  freelance: { name: 'Freelance', type: 'variable', frequency: 'monthly' },
  other: { name: 'Other Income', type: 'variable', frequency: 'monthly' }
};

const DEFAULT_EXPENSE_CATEGORIES = {
  housing: { name: 'Housing', type: 'fixed', frequency: 'monthly' },
  utilities: { name: 'Utilities', type: 'variable', frequency: 'monthly' },
  transportation: { name: 'Transportation', type: 'mixed', frequency: 'monthly' },
  food: { name: 'Food & Dining', type: 'variable', frequency: 'monthly' },
  healthcare: { name: 'Healthcare', type: 'variable', frequency: 'monthly' },
  insurance: { name: 'Insurance', type: 'fixed', frequency: 'monthly' },
  entertainment: { name: 'Entertainment', type: 'variable', frequency: 'monthly' },
  shopping: { name: 'Shopping', type: 'variable', frequency: 'monthly' },
  debt: { name: 'Debt Payments', type: 'fixed', frequency: 'monthly' },
  savings: { name: 'Savings', type: 'fixed', frequency: 'monthly' }
};

class CashFlowService {
  constructor() {
    this.incomeCategories = { ...DEFAULT_INCOME_CATEGORIES };
    this.expenseCategories = { ...DEFAULT_EXPENSE_CATEGORIES };
    this.transactions = [];
    this.recurringTransactions = [];
  }

  /**
   * Add a transaction to cash flow
   * @param {Object} transaction - Transaction object
   * @returns {Object} Added transaction with ID
   */
  async addTransaction(transaction) {
    try {
      // Validate required fields
      if (!transaction || typeof transaction !== 'object') {
        throw new Error('Transaction must be a valid object');
      }
      
      if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
        throw new Error('Transaction amount must be a positive number');
      }
      
      if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        throw new Error('Transaction type must be either "income" or "expense"');
      }
      
      if (!transaction.category || typeof transaction.category !== 'string') {
        throw new Error('Transaction category is required and must be a string');
      }

      const newTransaction = {
        id: this.generateTransactionId(),
        date: transaction.date || new Date().toISOString(),
        amount: transaction.amount,
        type: transaction.type, // 'income' or 'expense'
        category: transaction.category,
        description: transaction.description || '',
        recurring: transaction.recurring || false,
        frequency: transaction.frequency || 'monthly',
        tags: transaction.tags || [],
        ...transaction
      };

      this.transactions.push(newTransaction);

      // If recurring, add to recurring transactions
      if (newTransaction.recurring) {
        this.recurringTransactions.push(newTransaction);
      }

      await executionLogService.log('cashflow.transaction.added', {
        transactionId: newTransaction.id,
        type: newTransaction.type,
        category: newTransaction.category,
        amount: newTransaction.amount,
        recurring: newTransaction.recurring
      });

      return newTransaction;
    } catch (error) {
      await executionLogService.logError('cashflow.transaction.add.failed', error, { transaction });
      throw error;
    }
  }

  /**
   * Generate unique transaction ID
   * @returns {string} Transaction ID
   */
  generateTransactionId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get transactions for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} type - Optional filter by type ('income' or 'expense')
   * @returns {Array} Filtered transactions
   */
  getTransactions(startDate, endDate, type = null) {
    let filtered = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    if (type) {
      filtered = filtered.filter(transaction => transaction.type === type);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Calculate cash flow for a period
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Cash flow summary
   */
  calculateCashFlow(startDate, endDate) {
    const transactions = this.getTransactions(startDate, endDate);
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = income - expenses;

    return {
      period: { startDate, endDate },
      income,
      expenses,
      netCashFlow,
      transactionCount: transactions.length,
      incomeTransactions: transactions.filter(t => t.type === 'income').length,
      expenseTransactions: transactions.filter(t => t.type === 'expense').length
    };
  }

  /**
   * Generate cash flow forecast
   * @param {number} months - Number of months to forecast
   * @returns {Object} Cash flow forecast
   */
  async generateForecast(months = 12) {
    try {
      const forecast = {
        months,
        monthlyProjections: [],
        totalProjectedIncome: 0,
        totalProjectedExpenses: 0,
        totalProjectedCashFlow: 0,
        cumulativeCashFlow: 0,
        warnings: [],
        opportunities: []
      };

      // Calculate average monthly income and expenses from historical data
      const historicalData = this.calculateHistoricalAverages();
      
      // Generate monthly projections
      for (let i = 0; i < months; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() + i);

        const monthlyProjection = {
          month: monthDate.toISOString().slice(0, 7), // YYYY-MM format
          projectedIncome: historicalData.avgMonthlyIncome,
          projectedExpenses: historicalData.avgMonthlyExpenses,
          projectedCashFlow: historicalData.avgMonthlyIncome - historicalData.avgMonthlyExpenses,
          recurringIncome: this.calculateRecurringIncome(monthDate),
          recurringExpenses: this.calculateRecurringExpenses(monthDate)
        };

        // Adjust for seasonal variations if we have enough data
        if (historicalData.seasonalFactors) {
          const month = monthDate.getMonth();
          const seasonalFactor = historicalData.seasonalFactors[month] || 1;
          monthlyProjection.projectedIncome *= seasonalFactor;
          monthlyProjection.projectedExpenses *= seasonalFactor;
          monthlyProjection.projectedCashFlow = monthlyProjection.projectedIncome - monthlyProjection.projectedExpenses;
        }

        forecast.monthlyProjections.push(monthlyProjection);
        forecast.totalProjectedIncome += monthlyProjection.projectedIncome;
        forecast.totalProjectedExpenses += monthlyProjection.projectedExpenses;
        forecast.totalProjectedCashFlow += monthlyProjection.projectedCashFlow;
        forecast.cumulativeCashFlow += monthlyProjection.projectedCashFlow;
      }

      // Generate warnings and opportunities
      this.generateCashFlowInsights(forecast, historicalData);

      await executionLogService.log('cashflow.forecast.generated', {
        months,
        totalProjectedIncome: forecast.totalProjectedIncome,
        totalProjectedExpenses: forecast.totalProjectedExpenses,
        totalProjectedCashFlow: forecast.totalProjectedCashFlow,
        warnings: forecast.warnings.length,
        opportunities: forecast.opportunities.length
      });

      return forecast;
    } catch (error) {
      await executionLogService.logError('cashflow.forecast.failed', error, { months });
      throw error;
    }
  }

  /**
   * Calculate historical averages from transaction data
   * @returns {Object} Historical averages and patterns
   */
  calculateHistoricalAverages() {
    if (this.transactions.length === 0) {
      return {
        avgMonthlyIncome: 0,
        avgMonthlyExpenses: 0,
        seasonalFactors: null
      };
    }

    // Group transactions by month
    const monthlyData = {};
    this.transactions.forEach(transaction => {
      const monthKey = transaction.date.slice(0, 7); // YYYY-MM format
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    // Calculate averages
    const months = Object.keys(monthlyData).length;
    const totalIncome = Object.values(monthlyData).reduce((sum, data) => sum + data.income, 0);
    const totalExpenses = Object.values(monthlyData).reduce((sum, data) => sum + data.expenses, 0);

    // Calculate seasonal factors if we have at least 12 months of data
    let seasonalFactors = null;
    if (months >= 12) {
      seasonalFactors = this.calculateSeasonalFactors(monthlyData);
    }

    return {
      avgMonthlyIncome: months > 0 ? totalIncome / months : 0,
      avgMonthlyExpenses: months > 0 ? totalExpenses / months : 0,
      seasonalFactors,
      months
    };
  }

  /**
   * Calculate seasonal factors from monthly data
   * @param {Object} monthlyData - Monthly transaction data
   * @returns {Array} Seasonal factors for each month (0-11)
   */
  calculateSeasonalFactors(monthlyData) {
    const monthlyAverages = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);

    Object.entries(monthlyData).forEach(([monthKey, data]) => {
      const month = parseInt(monthKey.split('-')[1]) - 1; // 0-11
      monthlyAverages[month] += data.income + data.expenses;
      monthlyCounts[month]++;
    });

    // Calculate average for each month
    monthlyAverages.forEach((sum, month) => {
      if (monthlyCounts[month] > 0) {
        monthlyAverages[month] = sum / monthlyCounts[month];
      }
    });

    // Calculate overall average
    const overallAverage = monthlyAverages.reduce((sum, avg) => sum + avg, 0) / 12;

    // Calculate seasonal factors
    return monthlyAverages.map(avg => overallAverage > 0 ? avg / overallAverage : 1);
  }

  /**
   * Calculate recurring income for a specific month
   * @param {Date} monthDate - Month to calculate for
   * @returns {number} Recurring income amount
   */
  calculateRecurringIncome(monthDate) {
    return this.recurringTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => {
        if (this.shouldIncludeRecurringTransaction(t, monthDate)) {
          return sum + t.amount;
        }
        return sum;
      }, 0);
  }

  /**
   * Calculate recurring expenses for a specific month
   * @param {Date} monthDate - Month to calculate for
   * @returns {number} Recurring expenses amount
   */
  calculateRecurringExpenses(monthDate) {
    return this.recurringTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        if (this.shouldIncludeRecurringTransaction(t, monthDate)) {
          return sum + t.amount;
        }
        return sum;
      }, 0);
  }

  /**
   * Check if a recurring transaction should be included for a given month
   * @param {Object} transaction - Recurring transaction
   * @param {Date} monthDate - Month to check
   * @returns {boolean} Whether to include the transaction
   */
  shouldIncludeRecurringTransaction(transaction, monthDate) {
    const transactionDate = new Date(transaction.date);
    const monthsDiff = (monthDate.getFullYear() - transactionDate.getFullYear()) * 12 +
      (monthDate.getMonth() - transactionDate.getMonth());

    switch (transaction.frequency) {
      case 'monthly':
        return monthsDiff >= 0;
      case 'quarterly':
        return monthsDiff >= 0 && monthsDiff % 3 === 0;
      case 'annual':
        // For annual transactions:
        // 1. Must be in the same month
        // 2. Must be a multiple of 12 months from start
        return monthDate.getMonth() === transactionDate.getMonth() &&
               monthsDiff >= 0 && monthsDiff % 12 === 0;
      default:
        return monthsDiff >= 0;
    }
  }

  /**
   * Generate cash flow insights (warnings and opportunities)
   * @param {Object} forecast - Cash flow forecast
   * @param {Object} historicalData - Historical data
   */
  generateCashFlowInsights(forecast, historicalData) {
    // Check for negative cash flow
    if (forecast.totalProjectedCashFlow < 0) {
      forecast.warnings.push({
        type: 'negative_cashflow',
        message: `Projected negative cash flow of $${Math.abs(forecast.totalProjectedCashFlow).toLocaleString()} over ${forecast.months} months`,
        severity: 'high'
      });
    }

    // Check for low cash reserves
    const avgMonthlyCashFlow = forecast.totalProjectedCashFlow / forecast.months;
    if (avgMonthlyCashFlow < historicalData.avgMonthlyExpenses * 0.1) {
      forecast.warnings.push({
        type: 'low_cash_reserves',
        message: 'Projected cash flow may not provide adequate reserves for emergencies',
        severity: 'medium'
      });
    }

    // Check for income opportunities
    const incomeVariability = this.calculateIncomeVariability();
    if (incomeVariability > 0.3) {
      forecast.opportunities.push({
        type: 'income_stabilization',
        message: 'Consider diversifying income sources to reduce variability',
        priority: 'medium'
      });
    }

    // Check for expense reduction opportunities
    const expenseBreakdown = this.calculateExpenseBreakdown();
    const discretionaryExpenses = expenseBreakdown.discretionary || 0;
    if (discretionaryExpenses > historicalData.avgMonthlyIncome * 0.4) {
      forecast.opportunities.push({
        type: 'expense_reduction',
        message: 'High discretionary spending - consider reducing to improve cash flow',
        priority: 'high'
      });
    }
  }

  /**
   * Calculate income variability
   * @returns {number} Income variability coefficient
   */
  calculateIncomeVariability() {
    const incomeTransactions = this.transactions.filter(t => t.type === 'income');
    if (incomeTransactions.length < 2) return 0;

    const amounts = incomeTransactions.map(t => t.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);

    return mean > 0 ? standardDeviation / mean : 0;
  }

  /**
   * Calculate expense breakdown by type
   * @returns {Object} Expense breakdown
   */
  calculateExpenseBreakdown() {
    const breakdown = { fixed: 0, variable: 0, discretionary: 0 };

    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = this.expenseCategories[transaction.category];
        if (category) {
          if (category.type === 'fixed') {
            breakdown.fixed += transaction.amount;
          } else if (category.type === 'variable') {
            breakdown.variable += transaction.amount;
          } else {
            breakdown.discretionary += transaction.amount;
          }
        }
      });

    return breakdown;
  }

  /**
   * Get cash flow summary
   * @returns {Object} Cash flow summary
   */
  getCashFlowSummary() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const yearToDate = this.calculateCashFlow(startOfYear, now);

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthFlow = this.calculateCashFlow(lastMonth, endOfLastMonth);

    return {
      yearToDate,
      lastMonth: lastMonthFlow,
      totalTransactions: this.transactions.length,
      recurringTransactions: this.recurringTransactions.length,
      incomeCategories: Object.keys(this.incomeCategories).length,
      expenseCategories: Object.keys(this.expenseCategories).length
    };
  }

  /**
   * Get all income categories
   * @returns {Object} Income categories
   */
  getIncomeCategories() {
    return { ...this.incomeCategories };
  }

  /**
   * Get all expense categories
   * @returns {Object} Expense categories
   */
  getExpenseCategories() {
    return { ...this.expenseCategories };
  }
}

// Export singleton instance
const cashFlowService = new CashFlowService();
export default cashFlowService;

// Also export the class for testing
export { CashFlowService }; 