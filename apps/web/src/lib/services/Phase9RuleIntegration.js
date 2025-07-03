/**
 * Phase9RuleIntegration.js - End-to-End Success Scenarios Integration
 * 
 * Purpose: Integrates RuleExecutionEngine with PlaidService to enable
 * real-time rule evaluation against live transaction data and generate
 * actionable insights for the dashboard.
 * 
 * Procedure:
 * 1. Connect RuleExecutionEngine to PlaidService for real data
 * 2. Implement real-time rule evaluation against live transactions
 * 3. Generate insights from rule execution results
 * 4. Provide dashboard integration for real-time updates
 * 5. Track user journey success metrics
 * 
 * Conclusion: Enables complete automation workflows with real data
 * and ensures users experience immediate value from their rules.
 */

import RuleExecutionEngine from './RuleExecutionEngine.js';
import PlaidService from './PlaidService.js';
import executionLogService from '../../core/services/ExecutionLogService.js';

class Phase9RuleIntegration {
  constructor() {
    this.ruleEngine = new RuleExecutionEngine();
    this.plaidService = new PlaidService();
    this.isInitialized = false;
    this.isRunning = false;
    this.insights = [];
    this.userJourney = {
      onboardingComplete: false,
      bankConnected: false,
      ruleCreated: false,
      ruleTriggered: false,
      insightGenerated: false,
      dashboardAccessed: false
    };
    this.successMetrics = {
      totalRules: 0,
      activeRules: 0,
      triggeredRules: 0,
      insightsGenerated: 0,
      userActions: 0
    };
  }

  /**
   * Initialize the integration with real data
   * @param {string} userId - User identifier
   * @returns {Promise<boolean>} Initialization success
   */
  async initialize(userId) {
    try {
      await executionLogService.log('phase9.integration.initializing', {
        userId,
        timestamp: new Date().toISOString()
      });

      // Initialize Plaid service
      await this.plaidService.initialize();
      
      // Check if user has connected bank account
      const isConnected = await this.plaidService.loadStoredAccessToken();
      if (isConnected) {
        this.userJourney.bankConnected = true;
        await executionLogService.log('phase9.bank.connected', {
          userId,
          accountCount: this.plaidService.accounts.length
        });
      }

      // Get real transaction data
      const transactions = await this.plaidService.getTransactions(30);
      
      // Initialize rule engine with real data
      await this.ruleEngine.initialize([], transactions);
      
      this.isInitialized = true;
      
      await executionLogService.log('phase9.integration.initialized', {
        userId,
        transactionCount: transactions.length,
        accountCount: this.plaidService.accounts.length
      });

      return true;
    } catch (error) {
      await executionLogService.logError('phase9.integration.initialization.failed', error, {
        userId
      });
      throw new Error(`Failed to initialize Phase 9 integration: ${error.message}`);
    }
  }

  /**
   * Start real-time rule evaluation
   * @param {number} intervalMs - Evaluation interval in milliseconds
   * @returns {Promise<boolean>} Start success
   */
  async startRealTimeEvaluation(intervalMs = 30000) {
    try {
      if (!this.isInitialized) {
        throw new Error('Integration not initialized. Call initialize() first.');
      }

      if (this.isRunning) {
        return true; // Already running
      }

      this.isRunning = true;
      
      // Start periodic evaluation
      this.ruleEngine.startPeriodicEvaluation(intervalMs);
      
      // Set up event listener for rule results
      this.ruleEngine.onEvent((event) => {
        this.handleRuleEvent(event);
      });

      await executionLogService.log('phase9.realtime.evaluation.started', {
        intervalMs,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      await executionLogService.logError('phase9.realtime.evaluation.start.failed', error);
      throw new Error(`Failed to start real-time evaluation: ${error.message}`);
    }
  }

  /**
   * Stop real-time rule evaluation
   */
  async stopRealTimeEvaluation() {
    try {
      this.ruleEngine.stopPeriodicEvaluation();
      this.isRunning = false;
      
      await executionLogService.log('phase9.realtime.evaluation.stopped', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      await executionLogService.logError('phase9.realtime.evaluation.stop.failed', error);
    }
  }

  /**
   * Handle rule execution events and generate insights
   * @param {Object} event - Rule execution event
   */
  async handleRuleEvent(event) {
    try {
      const insight = this.generateInsightFromRuleEvent(event);
      
      if (insight) {
        this.insights.unshift(insight); // Add to beginning of array
        this.insights = this.insights.slice(0, 50); // Keep only last 50 insights
        
        this.userJourney.insightGenerated = true;
        this.successMetrics.insightsGenerated++;
        
        await executionLogService.log('phase9.insight.generated', {
          insightId: insight.id,
          ruleId: event.ruleId,
          insightType: insight.type,
          message: insight.message
        });
      }

      // Update success metrics
      if (event.status === 'triggered') {
        this.userJourney.ruleTriggered = true;
        this.successMetrics.triggeredRules++;
      }
    } catch (error) {
      await executionLogService.logError('phase9.rule.event.handling.failed', error, {
        event
      });
    }
  }

  /**
   * Generate insight from rule execution event
   * @param {Object} event - Rule execution event
   * @returns {Object|null} Generated insight or null
   */
  generateInsightFromRuleEvent(event) {
    try {
      if (!event || event.status === 'error') {
        return null;
      }

      const insight = {
        id: `insight_${event.ruleId}_${Date.now()}`,
        ruleId: event.ruleId,
        ruleName: event.ruleName,
        type: event.status === 'triggered' ? 'alert' : 'info',
        title: this.getInsightTitle(event),
        message: event.message,
        action: this.getInsightAction(event),
        timestamp: event.evaluatedAt,
        metrics: event.metrics || {},
        priority: event.status === 'triggered' ? 'high' : 'medium'
      };

      return insight;
    } catch (error) {
      console.error('Failed to generate insight:', error);
      return null;
    }
  }

  /**
   * Get insight title based on rule event
   * @param {Object} event - Rule execution event
   * @returns {string} Insight title
   */
  getInsightTitle(event) {
    switch (event.status) {
      case 'triggered':
        return `${event.ruleName} - Action Required`;
      case 'missed':
        return `${event.ruleName} - All Good`;
      default:
        return event.ruleName;
    }
  }

  /**
   * Get insight action based on rule event
   * @param {Object} event - Rule execution event
   * @returns {Object} Action object
   */
  getInsightAction(event) {
    if (event.status === 'triggered') {
      return {
        type: 'review',
        label: 'Review Spending',
        url: '/dashboard/spending',
        description: 'Review your spending patterns and adjust your budget'
      };
    }
    
    return {
      type: 'view',
      label: 'View Details',
      url: '/dashboard/rules',
      description: 'View your rule details and performance'
    };
  }

  /**
   * Create a new rule with real data validation
   * @param {Object} rule - Rule configuration
   * @returns {Promise<Object>} Created rule with ID
   */
  async createRule(rule) {
    try {
      // Validate rule against real transaction data
      const transactions = await this.plaidService.getTransactions(30);
      const validationResult = await this.validateRuleAgainstRealData(rule, transactions);
      
      if (!validationResult.valid) {
        throw new Error(`Rule validation failed: ${validationResult.reason}`);
      }

      // Add rule to engine
      this.ruleEngine.addRule(rule);
      
      this.userJourney.ruleCreated = true;
      this.successMetrics.totalRules++;
      this.successMetrics.activeRules++;
      
      await executionLogService.log('phase9.rule.created', {
        ruleId: rule.id,
        ruleName: rule.name,
        ruleType: rule.type,
        validationResult: validationResult
      });

      return {
        ...rule,
        validationResult,
        created: true
      };
    } catch (error) {
      await executionLogService.logError('phase9.rule.creation.failed', error, {
        rule
      });
      throw error;
    }
  }

  /**
   * Validate rule against real transaction data
   * @param {Object} rule - Rule configuration
   * @param {Array} transactions - Real transaction data
   * @returns {Promise<Object>} Validation result
   */
  async validateRuleAgainstRealData(rule, transactions) {
    try {
      // Test rule against recent transactions
      const testResult = this.ruleEngine.evaluateRule(rule, transactions);
      
      return {
        valid: true,
        reason: 'Rule validated against real data',
        testResult,
        transactionCount: transactions.length,
        estimatedTriggers: this.estimateRuleTriggers(rule, transactions)
      };
    } catch (error) {
      return {
        valid: false,
        reason: `Rule validation error: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Estimate how often a rule will trigger
   * @param {Object} rule - Rule configuration
   * @param {Array} transactions - Transaction data
   * @returns {number} Estimated trigger frequency
   */
  estimateRuleTriggers(rule, transactions) {
    try {
      let triggerCount = 0;
      
      // Simple estimation based on rule type
      if (rule.type === 'spending_limit') {
        const { category, limit } = rule.conditions;
        const categoryTransactions = transactions.filter(tx => tx.category === category);
        const totalSpent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        if (totalSpent > limit) {
          triggerCount = Math.ceil((totalSpent - limit) / 100); // Rough estimate
        }
      }
      
      return Math.min(triggerCount, 10); // Cap at 10 for estimation
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get current insights for dashboard
   * @returns {Array} Current insights
   */
  getInsights() {
    return this.insights;
  }

  /**
   * Get user journey status
   * @returns {Object} User journey status
   */
  getUserJourneyStatus() {
    return {
      ...this.userJourney,
      completedSteps: Object.values(this.userJourney).filter(Boolean).length,
      totalSteps: Object.keys(this.userJourney).length,
      completionRate: (Object.values(this.userJourney).filter(Boolean).length / Object.keys(this.userJourney).length) * 100
    };
  }

  /**
   * Get success metrics
   * @returns {Object} Success metrics
   */
  getSuccessMetrics() {
    return {
      ...this.successMetrics,
      ruleEffectiveness: this.successMetrics.totalRules > 0 ? 
        (this.successMetrics.triggeredRules / this.successMetrics.totalRules) * 100 : 0,
      insightGenerationRate: this.successMetrics.insightsGenerated / Math.max(this.successMetrics.totalRules, 1)
    };
  }

  /**
   * Mark user journey step as complete
   * @param {string} step - Journey step name
   */
  markJourneyStepComplete(step) {
    if (this.userJourney.hasOwnProperty(step)) {
      this.userJourney[step] = true;
      this.successMetrics.userActions++;
      
      executionLogService.log('phase9.journey.step.completed', {
        step,
        completionRate: this.getUserJourneyStatus().completionRate
      });
    }
  }

  /**
   * Get integration status
   * @returns {Object} Integration status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isRunning: this.isRunning,
      plaidConnected: this.plaidService.isConnected(),
      activeRules: this.ruleEngine.activeRules.length,
      insightsCount: this.insights.length,
      userJourney: this.getUserJourneyStatus(),
      successMetrics: this.getSuccessMetrics()
    };
  }
}

export default Phase9RuleIntegration; 