/**
 * RuleExecutionEngine.js - Galileo Sprint 2 Core Automation Engine
 * 
 * Purpose: Real-time rule evaluation and execution system that provides
 * immediate visual feedback when rules are triggered, creating the "Aha!"
 * moment where AlphaFrame becomes a genuinely trusted financial automation tool.
 * 
 * Procedure:
 * 1. Evaluates all stored rules against available transaction data
 * 2. Logs rule triggers to localStorage for persistence
 * 3. Provides real-time notifications and visual updates
 * 4. Integrates with dashboard insights for immediate value visibility
 * 5. Supports both mock and real transaction data sources
 * 
 * Conclusion: Transforms AlphaFrame from a technical demo into a functional
 * financial automation platform that users can trust and rely on.
 */

import { evaluateAllRules, getRuleExecutionSummary } from './RuleEngineExecutor.js';
import { getMockTransactions, getTransactionsForTimeframe } from '../mock/transactions.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Import executionLogService only in browser environment
let executionLogService = null;
if (isBrowser) {
  try {
    const module = await import('../../core/services/ExecutionLogService.js');
    executionLogService = module.default;
  } catch (error) {
    console.warn('ExecutionLogService not available:', error);
  }
}

class RuleExecutionEngine {
  constructor() {
    this.isRunning = false;
    this.executionInterval = null;
    this.lastExecutionTime = null;
    this.triggerHistory = new Map();
    this.activeRules = [];
    this.transactions = [];
  }

  /**
   * Initialize the rule execution engine
   * @param {Array} rules - User's active rules
   * @param {Array} transactions - Transaction data to evaluate against
   */
  async initialize(rules = [], transactions = null) {
    try {
      this.activeRules = rules;
      this.transactions = transactions || getMockTransactions();
      
      // Load trigger history from localStorage (browser only)
      if (isBrowser) {
        this.loadTriggerHistory();
      }
      
      // Log initialization (if service available)
      if (executionLogService) {
        await executionLogService.log('rule.engine.initialized', {
          ruleCount: rules.length,
          transactionCount: this.transactions.length,
          timestamp: new Date().toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize RuleExecutionEngine:', error);
      if (executionLogService) {
        await executionLogService.logError('rule.engine.init.failed', error);
      }
      return false;
    }
  }

  /**
   * Start periodic rule evaluation
   * @param {number} intervalMs - Evaluation interval in milliseconds (default: 30 seconds)
   */
  async startPeriodicEvaluation(intervalMs = 30000) {
    if (this.isRunning) {
      console.warn('RuleExecutionEngine is already running');
      return;
    }

    this.isRunning = true;
    
    // Run initial evaluation immediately
    await this.evaluateAllRules();
    
    // Set up periodic evaluation
    this.executionInterval = setInterval(async () => {
      await this.evaluateAllRules();
    }, intervalMs);

    if (executionLogService) {
      await executionLogService.log('rule.engine.started', {
        intervalMs,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Stop periodic rule evaluation
   */
  async stopPeriodicEvaluation() {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    
    this.isRunning = false;
    
    if (executionLogService) {
      await executionLogService.log('rule.engine.stopped', {
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Evaluate all rules against current transaction data
   * @returns {Object} Evaluation results with triggers and insights
   */
  async evaluateAllRules() {
    try {
      const startTime = Date.now();
      
      // Get fresh transaction data
      const currentTransactions = getTransactionsForTimeframe('monthly');
      
      // Evaluate all rules
      const results = evaluateAllRules(this.activeRules, currentTransactions, 'monthly');
      const summary = getRuleExecutionSummary(results);
      
      // Check for new triggers
      const newTriggers = await this.processRuleResults(results);
      
      // Update last execution time
      this.lastExecutionTime = new Date();
      
      // Log evaluation (if service available)
      if (executionLogService) {
        await executionLogService.log('rule.engine.evaluated', {
          ruleCount: this.activeRules.length,
          transactionCount: currentTransactions.length,
          triggeredCount: newTriggers.length,
          executionTime: Date.now() - startTime,
          timestamp: this.lastExecutionTime.toISOString()
        });
      }

      return {
        results,
        summary,
        newTriggers,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Rule evaluation failed:', error);
      if (executionLogService) {
        await executionLogService.logError('rule.engine.evaluation.failed', error);
      }
      return {
        results: [],
        summary: { total: 0, triggered: 0, warnings: 0, ok: 0, hasAlerts: false },
        newTriggers: [],
        error: error.message
      };
    }
  }

  /**
   * Process rule evaluation results and identify new triggers
   * @param {Array} results - Rule evaluation results
   * @returns {Array} New rule triggers
   */
  async processRuleResults(results) {
    const newTriggers = [];
    
    for (const result of results) {
      if (result.status === 'triggered' || result.status === 'warning') {
        const triggerKey = `${result.ruleId}_${result.lastEvaluated}`;
        
        // Check if this is a new trigger
        if (!this.triggerHistory.has(triggerKey)) {
          const trigger = {
            id: triggerKey,
            ruleId: result.ruleId,
            ruleName: result.ruleName,
            status: result.status,
            message: result.message,
            timestamp: result.lastEvaluated,
            matchedTransactions: result.matchedTransactions || [],
            metrics: result.metrics || {}
          };
          
          // Add to trigger history
          this.triggerHistory.set(triggerKey, trigger);
          newTriggers.push(trigger);
          
          // Log the trigger (if service available)
          if (executionLogService) {
            await executionLogService.log('rule.triggered', {
              ruleId: result.ruleId,
              ruleName: result.ruleName,
              status: result.status,
              message: result.message,
              timestamp: trigger.timestamp
            });
          }
        }
      }
    }
    
    // Save trigger history to localStorage (browser only)
    if (isBrowser) {
      this.saveTriggerHistory();
    }
    
    return newTriggers;
  }

  /**
   * Get recent rule triggers
   * @param {number} hoursBack - Hours to look back (default: 24)
   * @returns {Array} Recent triggers
   */
  getRecentTriggers(hoursBack = 24) {
    const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    return Array.from(this.triggerHistory.values())
      .filter(trigger => new Date(trigger.timestamp) > cutoff)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get trigger statistics
   * @returns {Object} Trigger statistics
   */
  getTriggerStatistics() {
    const triggers = Array.from(this.triggerHistory.values());
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayTriggers = triggers.filter(t => new Date(t.timestamp) >= startOfDay);
    const thisWeekTriggers = triggers.filter(t => {
      const triggerDate = new Date(t.timestamp);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return triggerDate >= weekAgo;
    });
    
    return {
      total: triggers.length,
      today: todayTriggers.length,
      thisWeek: thisWeekTriggers.length,
      byStatus: {
        triggered: triggers.filter(t => t.status === 'triggered').length,
        warning: triggers.filter(t => t.status === 'warning').length
      }
    };
  }

  /**
   * Add a new rule to the active rules
   * @param {Object} rule - Rule to add
   */
  async addRule(rule) {
    this.activeRules.push(rule);
    
    // Immediately evaluate the new rule
    const results = await this.evaluateAllRules();
    
    if (executionLogService) {
      await executionLogService.log('rule.added', {
        ruleId: rule.id,
        ruleName: rule.name,
        totalRules: this.activeRules.length,
        timestamp: new Date().toISOString()
      });
    }
    
    return results;
  }

  /**
   * Remove a rule from active rules
   * @param {string} ruleId - ID of rule to remove
   */
  async removeRule(ruleId) {
    this.activeRules = this.activeRules.filter(rule => rule.id !== ruleId);
    
    if (executionLogService) {
      await executionLogService.log('rule.removed', {
        ruleId,
        totalRules: this.activeRules.length,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update transaction data
   * @param {Array} transactions - New transaction data
   */
  async updateTransactions(transactions) {
    this.transactions = transactions;
    
    // Re-evaluate rules with new data
    const results = await this.evaluateAllRules();
    
    if (executionLogService) {
      await executionLogService.log('transactions.updated', {
        transactionCount: transactions.length,
        timestamp: new Date().toISOString()
      });
    }
    
    return results;
  }

  /**
   * Load trigger history from localStorage
   */
  loadTriggerHistory() {
    try {
      if (!isBrowser) return;
      
      const stored = localStorage.getItem('alphaframe_rule_triggers');
      if (stored) {
        const triggers = JSON.parse(stored);
        this.triggerHistory = new Map(triggers.map(t => [t.id, t]));
      }
    } catch (error) {
      console.warn('Failed to load trigger history:', error);
    }
  }

  /**
   * Save trigger history to localStorage
   */
  saveTriggerHistory() {
    try {
      if (!isBrowser) return;
      
      const triggers = Array.from(this.triggerHistory.values());
      localStorage.setItem('alphaframe_rule_triggers', JSON.stringify(triggers));
    } catch (error) {
      console.warn('Failed to save trigger history:', error);
    }
  }

  /**
   * Clear trigger history
   */
  clearTriggerHistory() {
    this.triggerHistory.clear();
    if (isBrowser) {
      localStorage.removeItem('alphaframe_rule_triggers');
    }
  }

  /**
   * Get engine status
   * @returns {Object} Engine status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastExecutionTime: this.lastExecutionTime,
      activeRules: this.activeRules.length,
      transactionCount: this.transactions.length,
      triggerCount: this.triggerHistory.size,
      statistics: this.getTriggerStatistics()
    };
  }
}

// Create singleton instance
const ruleExecutionEngine = new RuleExecutionEngine();

export default ruleExecutionEngine; 