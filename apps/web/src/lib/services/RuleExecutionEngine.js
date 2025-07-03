/**
 * RuleExecutionEngine.js - Production-Grade Rule Execution Engine (Phase 1)
 *
 * Purpose: Provides real-time rule evaluation and execution system for AlphaFrame.
 * Evaluates user-defined rules against transaction data (mock or Firestore),
 * emits structured results, and logs all evaluation events for reporting.
 *
 * CTO-Level Requirements:
 * - Modular, testable, and production-ready
 * - Supports both simulation and production data
 * - Emits events for triggers, misses, and errors
 * - Logs all evaluation attempts and results
 * - Exposes composable API for integration with UI and reporting
 */

/**
 * @typedef {Object} Rule
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {Object} conditions
 * @property {Object} actions
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} date
 * @property {number} amount
 * @property {string} category
 * @property {string} description
 * @property {string} accountId
 */

class RuleExecutionEngine {
  constructor() {
    this.isRunning = false;
    this.executionInterval = null;
    this.lastExecutionTime = null;
    this.triggerHistory = [];
    this.activeRules = [];
    this.transactions = [];
    this.eventLog = [];
    this.listeners = [];
  }

  /**
   * Initialize the rule execution engine
   * @param {Rule[]} rules
   * @param {Transaction[]} transactions
   */
  async initialize(rules = [], transactions = []) {
    this.activeRules = rules;
    this.transactions = transactions;
    this.isRunning = false;
    this.lastExecutionTime = null;
    this.triggerHistory = [];
    this.eventLog = [];
    this.listeners = [];
  }

  /**
   * Register a listener for rule events
   * @param {(event: Object) => void} listener
   */
  onEvent(listener) {
    this.listeners.push(listener);
  }

  /**
   * Emit an event to all listeners and log it
   * @param {Object} event
   */
  emitEvent(event) {
    this.eventLog.push({ ...event, timestamp: new Date().toISOString() });
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Start periodic rule evaluation
   * @param {number} intervalMs
   */
  startPeriodicEvaluation(intervalMs = 30000) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.executionInterval = setInterval(() => {
      this.evaluateAllRules();
    }, intervalMs);
  }

  /**
   * Stop periodic rule evaluation
   */
  stopPeriodicEvaluation() {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Evaluate all rules against current transaction data
   * Emits events for each rule evaluation
   * @returns {Object} { results: Array, summary: Object, newTriggers: Array }
   */
  evaluateAllRules() {
    if (!this.activeRules.length || !this.transactions.length) {
      return { results: [], summary: { total: 0, triggered: 0, missed: 0 }, newTriggers: [] };
    }
    
    const results = [];
    const newTriggers = [];
    
    this.activeRules.forEach((rule) => {
      if (!rule.enabled) return;
      const result = this.evaluateRule(rule, this.transactions);
      results.push(result);
      this.emitEvent(result);
      
      if (result.status === 'triggered') {
        this.triggerHistory.push({ ruleId: rule.id, time: new Date().toISOString() });
        newTriggers.push(result);
      }
    });
    
    this.lastExecutionTime = new Date().toISOString();
    
    const summary = {
      total: results.length,
      triggered: results.filter(r => r.status === 'triggered').length,
      missed: results.filter(r => r.status === 'missed').length,
      errors: results.filter(r => r.status === 'error').length
    };
    
    return { results, summary, newTriggers };
  }

  /**
   * Evaluate a single rule against transactions
   * @param {Rule} rule
   * @param {Transaction[]} transactions
   * @returns {Object} Evaluation result
   */
  evaluateRule(rule, transactions) {
    try {
      let triggered = false;
      let matchedTx = null;
      let message = '';
      
      if (rule.type === 'spending_limit') {
        const { category, limit } = rule.conditions;
        const total = transactions
          .filter((tx) => tx.category === category)
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        if (total > limit) {
          triggered = true;
          matchedTx = transactions.find((tx) => tx.category === category && tx.amount > 0);
          message = `Spending limit exceeded for ${category}: $${total.toFixed(2)} > $${limit}`;
        } else {
          message = `Spending within limit for ${category}: $${total.toFixed(2)} <= $${limit}`;
        }
      } else if (rule.type === 'balance_check') {
        const { threshold } = rule.conditions;
        const totalBalance = transactions
          .filter((tx) => tx.amount > 0)
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        if (totalBalance < threshold) {
          triggered = true;
          message = `Balance below threshold: $${totalBalance.toFixed(2)} < $${threshold}`;
        } else {
          message = `Balance above threshold: $${totalBalance.toFixed(2)} >= $${threshold}`;
        }
      } else {
        // Unknown rule type
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          status: 'error',
          error: `Unknown rule type: ${rule.type}`,
          evaluatedAt: new Date().toISOString(),
          message: `Rule type '${rule.type}' is not supported`
        };
      }
      
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        status: triggered ? 'triggered' : 'missed',
        matchedTransaction: matchedTx,
        evaluatedAt: new Date().toISOString(),
        message: message,
        metrics: {
          totalSpent: rule.type === 'spending_limit' ? 
            transactions.filter((tx) => tx.category === rule.conditions.category)
              .reduce((sum, tx) => sum + tx.amount, 0) : undefined,
          threshold: rule.conditions.limit || rule.conditions.threshold
        }
      };
    } catch (error) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        status: 'error',
        error: error.message,
        evaluatedAt: new Date().toISOString(),
        message: `Error evaluating rule: ${error.message}`
      };
    }
  }

  /**
   * Add a new rule
   * @param {Rule} rule
   */
  addRule(rule) {
    this.activeRules.push(rule);
  }

  /**
   * Remove a rule by ID
   * @param {string} ruleId
   */
  removeRule(ruleId) {
    this.activeRules = this.activeRules.filter((r) => r.id !== ruleId);
  }

  /**
   * Update transaction data
   * @param {Transaction[]} transactions
   */
  updateTransactions(transactions) {
    this.transactions = transactions;
  }

  /**
   * Get engine status
   * @returns {Object}
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastExecutionTime: this.lastExecutionTime,
      activeRules: this.activeRules.length,
      transactionCount: this.transactions.length,
      triggerCount: this.triggerHistory.length,
      statistics: this.getTriggerStatistics(),
      status: 'OK',
    };
  }

  /**
   * Get trigger statistics
   * @returns {Object}
   */
  getTriggerStatistics() {
    const today = new Date().toISOString().slice(0, 10);
    const todayTriggers = this.triggerHistory.filter((t) => t.time.slice(0, 10) === today).length;
    return {
      total: this.triggerHistory.length,
      today: todayTriggers,
      byStatus: {
        triggered: this.triggerHistory.length,
        warning: 0, // Extend as needed
      },
    };
  }

  /**
   * Get event log
   * @returns {Object[]}
   */
  getEventLog() {
    return this.eventLog;
  }

  /**
   * Get recent triggers within specified hours
   * @param {number} hours - Number of hours to look back
   * @returns {Object[]}
   */
  getRecentTriggers(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.triggerHistory.filter(trigger => 
      new Date(trigger.time) > cutoffTime
    );
  }
}

export default RuleExecutionEngine;

export function logRuleTrigger(ruleId, status = "triggered") {
  const previous = JSON.parse(localStorage.getItem('rule_log') || '[]');
  previous.push({ ruleId, timestamp: Date.now(), status });
  localStorage.setItem('rule_log', JSON.stringify(previous));
} 