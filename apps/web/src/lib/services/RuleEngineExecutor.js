/**
 * RuleEngineExecutor.js - AlphaFrame Rule Execution Engine
 * 
 * Purpose: Evaluate financial rules against transaction data to provide
 * real-time monitoring and alerting functionality.
 * 
 * Procedure:
 * 1. Accept rule configuration and transaction data
 * 2. Evaluate rules based on type and criteria
 * 3. Return execution status and matched transactions
 * 4. Provide actionable feedback and context
 * 
 * Conclusion: Core engine that makes rules functional and valuable to users.
 */

/**
 * Rule execution result structure
 * @typedef {Object} RuleExecutionResult
 * @property {string} status - 'triggered' | 'ok' | 'warning'
 * @property {string} message - Human-readable status message
 * @property {Array} matchedTransactions - Transactions that triggered the rule
 * @property {Object} metrics - Calculated metrics for the rule
 * @property {Date} lastEvaluated - When the rule was last evaluated
 */

/**
 * Evaluate a financial rule against transaction data
 * @param {Object} rule - Rule configuration
 * @param {Array} transactions - Transaction data to evaluate against
 * @param {string} timeframe - 'monthly' | 'weekly' | 'daily'
 * @returns {RuleExecutionResult} Execution result with status and context
 */
export const evaluateRule = (rule, transactions, timeframe = 'monthly') => {
  const now = new Date();
  const startDate = getTimeframeStart(now, timeframe);
  
  // Filter transactions for the current timeframe
  const relevantTransactions = transactions.filter(tx => 
    new Date(tx.timestamp) >= startDate && new Date(tx.timestamp) <= now
  );

  // Evaluate based on rule type
  switch (rule.type) {
    case 'spending_limit':
      return evaluateSpendingLimit(rule, relevantTransactions, timeframe);
    case 'savings_goal':
      return evaluateSavingsGoal(rule, relevantTransactions, timeframe);
    case 'bill_reminder':
      return evaluateBillReminder(rule, relevantTransactions, timeframe);
    case 'category_tracking':
      return evaluateCategoryTracking(rule, relevantTransactions, timeframe);
    default:
      return {
        status: 'error',
        message: 'Unknown rule type',
        matchedTransactions: [],
        metrics: {},
        lastEvaluated: now
      };
  }
};

/**
 * Evaluate spending limit rules
 */
const evaluateSpendingLimit = (rule, transactions, timeframe) => {
  const totalSpent = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const threshold = parseFloat(rule.amount);
  
  const isTriggered = totalSpent > threshold;
  const percentageUsed = (totalSpent / threshold) * 100;
  
  return {
    status: isTriggered ? 'triggered' : (percentageUsed > 80 ? 'warning' : 'ok'),
    message: isTriggered 
      ? `You've exceeded your ${timeframe} spending limit of $${threshold.toFixed(2)}. Current spending: $${totalSpent.toFixed(2)}`
      : `You're ${percentageUsed.toFixed(1)}% through your ${timeframe} spending limit. Current spending: $${totalSpent.toFixed(2)}`,
    matchedTransactions: transactions,
    metrics: {
      totalSpent,
      threshold,
      percentageUsed,
      remaining: threshold - totalSpent
    },
    lastEvaluated: new Date()
  };
};

/**
 * Evaluate savings goal rules
 */
const evaluateSavingsGoal = (rule, transactions, timeframe) => {
  const savingsTransactions = transactions.filter(tx => 
    tx.category === 'savings' || tx.category === 'transfer' || tx.amount < 0
  );
  
  const totalSaved = savingsTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const targetAmount = parseFloat(rule.amount);
  const percentageAchieved = (totalSaved / targetAmount) * 100;
  
  const isTriggered = totalSaved >= targetAmount;
  
  return {
    status: isTriggered ? 'triggered' : (percentageAchieved > 80 ? 'warning' : 'ok'),
    message: isTriggered
      ? `🎉 Congratulations! You've reached your ${timeframe} savings goal of $${targetAmount.toFixed(2)}!`
      : `You're ${percentageAchieved.toFixed(1)}% toward your ${timeframe} savings goal. Current savings: $${totalSaved.toFixed(2)}`,
    matchedTransactions: savingsTransactions,
    metrics: {
      totalSaved,
      targetAmount,
      percentageAchieved,
      remaining: targetAmount - totalSaved
    },
    lastEvaluated: new Date()
  };
};

/**
 * Evaluate bill reminder rules
 */
const evaluateBillReminder = (rule, transactions, timeframe) => {
  const billTransactions = transactions.filter(tx => 
    tx.category === 'bills' || tx.category === 'utilities' || tx.category === 'subscriptions'
  );
  
  const totalBills = billTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const expectedAmount = parseFloat(rule.amount);
  
  // Check if bills are paid (assuming bills are negative amounts)
  const isTriggered = totalBills < expectedAmount;
  
  return {
    status: isTriggered ? 'triggered' : 'ok',
    message: isTriggered
      ? `⚠️ You have unpaid bills totaling $${(expectedAmount - totalBills).toFixed(2)} this ${timeframe}`
      : `✅ All bills paid for this ${timeframe}. Total: $${totalBills.toFixed(2)}`,
    matchedTransactions: billTransactions,
    metrics: {
      totalBills,
      expectedAmount,
      unpaid: expectedAmount - totalBills
    },
    lastEvaluated: new Date()
  };
};

/**
 * Evaluate category tracking rules
 */
const evaluateCategoryTracking = (rule, transactions, timeframe) => {
  const categoryTransactions = transactions.filter(tx => 
    tx.category === rule.category || tx.category === rule.category?.toLowerCase()
  );
  
  const totalSpent = categoryTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const threshold = parseFloat(rule.amount);
  
  const isTriggered = totalSpent > threshold;
  const percentageUsed = (totalSpent / threshold) * 100;
  
  return {
    status: isTriggered ? 'triggered' : (percentageUsed > 80 ? 'warning' : 'ok'),
    message: isTriggered
      ? `You've exceeded your ${timeframe} ${rule.category} budget of $${threshold.toFixed(2)}. Current spending: $${totalSpent.toFixed(2)}`
      : `You're ${percentageUsed.toFixed(1)}% through your ${timeframe} ${rule.category} budget. Current spending: $${totalSpent.toFixed(2)}`,
    matchedTransactions: categoryTransactions,
    metrics: {
      totalSpent,
      threshold,
      percentageUsed,
      remaining: threshold - totalSpent
    },
    lastEvaluated: new Date()
  };
};

/**
 * Get the start date for a given timeframe
 */
const getTimeframeStart = (date, timeframe) => {
  const start = new Date(date);
  
  switch (timeframe) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
  }
  
  return start;
};

/**
 * Evaluate all rules for a user
 * @param {Array} rules - Array of user rules
 * @param {Array} transactions - Transaction data
 * @param {string} timeframe - Evaluation timeframe
 * @returns {Array} Array of rule execution results
 */
export const evaluateAllRules = (rules, transactions, timeframe = 'monthly') => {
  return rules.map(rule => ({
    ruleId: rule.id,
    ruleName: rule.name,
    ...evaluateRule(rule, transactions, timeframe)
  }));
};

/**
 * Get summary of rule execution results
 * @param {Array} results - Array of rule execution results
 * @returns {Object} Summary statistics
 */
export const getRuleExecutionSummary = (results) => {
  const triggered = results.filter(r => r.status === 'triggered').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const ok = results.filter(r => r.status === 'ok').length;
  
  return {
    total: results.length,
    triggered,
    warnings,
    ok,
    hasAlerts: triggered > 0 || warnings > 0
  };
};

export default {
  evaluateRule,
  evaluateAllRules,
  getRuleExecutionSummary
}; 