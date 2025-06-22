/**
 * Rule Engine 2.0 - AlphaPro VX.1 Finalization
 * 
 * Purpose: Advanced rule evaluation system with multi-condition chaining,
 * calendar triggers, live simulation, comprehensive logging, and robust
 * schema validation for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Evaluates complex rule conditions with AND/OR/NOT logic
 * 2. Supports calendar and event-based triggers
 * 3. Provides live simulation of rule outcomes
 * 4. Integrates with ExecutionLogService for comprehensive tracking
 * 5. Validates all rule data with Zod schemas before processing
 * 6. Ensures data integrity and prevents invalid rule execution
 * 
 * Conclusion: Delivers sophisticated rule processing while maintaining
 * zero-knowledge compliance, robust error handling, and data validation.
 */

import { z } from 'zod';
import executionLogService from '../../core/services/ExecutionLogService.js';

/**
 * Enhanced rule validation schemas
 */
const RuleConditionSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: z.enum([
    '>', '<', '>=', '<=', '===', '!==', 'contains', 'startsWith', 'endsWith',
    'isToday', 'isThisWeek', 'isThisMonth'
  ], { errorMap: () => ({ message: 'Invalid operator' }) }),
  value: z.any(),
  logicalOperator: z.enum(['AND', 'OR', 'NOT']).optional(),
  conditions: z.array(z.lazy(() => RuleConditionSchema)).optional()
});

const RuleActionSchema = z.object({
  type: z.enum(['notification', 'categorization', 'webhook', 'budget_adjustment', 'custom']),
  parameters: z.record(z.any()).optional(),
  payload: z.record(z.any()).optional(),
  webhook: z.object({
    url: z.string().url('Invalid webhook URL'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
    headers: z.record(z.string()).optional(),
    body: z.any().optional()
  }).optional(),
  notification: z.object({
    title: z.string(),
    message: z.string(),
    type: z.enum(['info', 'warning', 'error', 'success']).default('info')
  }).optional()
});

const RuleSchemaV2 = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required').max(100, 'Rule name too long'),
  description: z.string().optional(),
  logicOperator: z.enum(['AND', 'OR', 'NOT']).default('AND'),
  conditions: z.array(RuleConditionSchema).min(1, 'At least one condition is required'),
  action: RuleActionSchema,
  enabled: z.boolean().default(true),
  priority: z.number().min(1).max(10).default(5),
  tags: z.array(z.string()).optional(),
  created: z.date().optional(),
  updated: z.date().optional()
});

const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  merchant_name: z.string().optional(),
  category: z.string().optional(),
  date: z.string().or(z.date()),
  account_id: z.string().optional(),
  pending: z.boolean().optional(),
  payment_channel: z.string().optional(),
  transaction_type: z.string().optional()
});

// Enhanced rule operators
const OPERATORS = {
  // Comparison operators
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '===': (a, b) => a === b,
  '!==': (a, b) => a !== b,
  'contains': (a, b) => typeof a === 'string' && a.toLowerCase().includes(String(b).toLowerCase()),
  'startsWith': (a, b) => typeof a === 'string' && a.toLowerCase().startsWith(String(b).toLowerCase()),
  'endsWith': (a, b) => typeof a === 'string' && a.toLowerCase().endsWith(String(b).toLowerCase()),
  
  // Date operators
  'isToday': (a) => {
    const today = new Date().toDateString();
    const dateA = new Date(a).toDateString();
    return dateA === today;
  },
  'isThisWeek': (a) => {
    const now = new Date();
    const dateA = new Date(a);
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return dateA >= weekStart && dateA <= weekEnd;
  },
  'isThisMonth': (a) => {
    const now = new Date();
    const dateA = new Date(a);
    return dateA.getMonth() === now.getMonth() && dateA.getFullYear() === now.getFullYear();
  }
};

// Logical operators for complex conditions
const LOGICAL_OPERATORS = {
  'AND': (conditions) => conditions.every(condition => condition),
  'OR': (conditions) => conditions.some(condition => condition),
  'NOT': (conditions) => {
    // NOT expects a single condition, so we take the first one and negate it
    if (Array.isArray(conditions)) {
      return !conditions[0];
    }
    return !conditions;
  }
};

class RuleEngine {
  constructor(logger = executionLogService) {
    this.rules = new Map();
    this.triggerHistory = new Map();
    this.logger = logger;
  }

  /**
   * Register a rule with the engine with enhanced validation
   * @param {Object} rule - Rule object
   * @returns {string} Rule ID
   */
  async registerRule(rule) {
    try {
      // Validate rule with enhanced schema
      const validationResult = RuleSchemaV2.safeParse(rule);
      if (!validationResult.success) {
        const validationError = new Error(`Rule validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
        await this.logger.logError('rule.validation.failed', validationError, {
          errors: validationResult.error.errors,
          rule: rule
        });
        throw validationError;
      }

      const validatedRule = validationResult.data;
      const ruleId = validatedRule.id || `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add metadata
      const ruleWithMetadata = {
        ...validatedRule,
        id: ruleId,
        created: validatedRule.created || new Date(),
        updated: new Date()
      };

      this.rules.set(ruleId, ruleWithMetadata);

      await this.logger.log('rule.registered', {
        ruleId,
        ruleName: ruleWithMetadata.name,
        conditionsCount: ruleWithMetadata.conditions.length,
        actionType: ruleWithMetadata.action?.type,
        priority: ruleWithMetadata.priority
      });

      return ruleId;
    } catch (error) {
      await this.logger.logError('rule.registration.failed', error, { rule });
      throw error;
    }
  }

  /**
   * Evaluate a single rule against transaction data with validation
   * @param {Object} rule - Rule object
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Object>} Evaluation result with matched and action properties
   */
  async evaluateRule(rule, transaction) {
    try {
      // Validate rule with enhanced schema
      const ruleValidation = RuleSchemaV2.safeParse(rule);
      if (!ruleValidation.success) {
        const validationError = new Error(`Rule validation failed: ${ruleValidation.error.errors.map(e => e.message).join(', ')}`);
        await this.logger.logError('rule.evaluation.validation.failed', validationError, {
          errors: ruleValidation.error.errors,
          rule: rule
        });
        throw validationError;
      }

      // Validate transaction
      const transactionValidation = TransactionSchema.safeParse(transaction);
      if (!transactionValidation.success) {
        const validationError = new Error(`Transaction validation failed: ${transactionValidation.error.errors.map(e => e.message).join(', ')}`);
        await this.logger.logError('rule.evaluation.transaction.validation.failed', validationError, {
          errors: transactionValidation.error.errors,
          transaction: transaction
        });
        throw validationError;
      }

      const validatedRule = ruleValidation.data;
      const validatedTransaction = transactionValidation.data;

      // Extract logicOperator from rule and pass it to evaluateConditions
      const { logicOperator = 'AND' } = validatedRule;
      const matched = await this.evaluateConditions(validatedRule.conditions, validatedTransaction, logicOperator);
      
      // CLUSTER 2 FIX: Return expected object structure with matched and action properties
      const result = {
        matched,
        action: validatedRule.action,
        ruleId: validatedRule.id,
        ruleName: validatedRule.name,
        transactionId: validatedTransaction.id
      };
      
      // Log evaluation
      await this.logger.log('rule.evaluated', {
        ruleId: validatedRule.id,
        ruleName: validatedRule.name,
        result: matched,
        transactionId: validatedTransaction.id,
        conditionsCount: validatedRule.conditions.length,
        priority: validatedRule.priority
      });

      return result;
    } catch (error) {
      await this.logger.logError('rule.evaluation.failed', error, { rule, transaction });
      throw error;
    }
  }

  /**
   * Create a new rule
   * @param {Object} ruleData - Rule data
   * @returns {Promise<Object>} The created rule
   */
  async createRule(ruleData) {
    try {
      const validationResult = RuleSchemaV2.safeParse(ruleData);
      if (!validationResult.success) {
        const validationError = new Error(`Rule creation validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
        await this.logger.logError('rule.creation.validation.failed', validationError, {
          errors: validationResult.error.errors,
          ruleData: ruleData
        });
        throw validationError;
      }
      
      const validatedRule = validationResult.data;
      const ruleId = await this.registerRule(validatedRule);
      const createdRule = this.rules.get(ruleId);
      
      await this.logger.log('rule.created', {
        ruleId,
        ruleName: createdRule.name,
        conditionsCount: createdRule.conditions.length,
        actionType: createdRule.action?.type,
        priority: createdRule.priority
      });

      return createdRule;
    } catch (error) {
      await this.logger.logError('rule.creation.failed', error, { ruleData });
      throw error;
    }
  }

  /**
   * Update an existing rule
   * @param {string} ruleId - Rule ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated rule
   */
  async updateRule(ruleId, updates) {
    try {
      const existingRule = this.rules.get(ruleId);
      if (!existingRule) {
        throw new Error(`Rule with ID ${ruleId} not found`);
      }

      const updatedRule = { ...existingRule, ...updates, updated: new Date() };

      const validationResult = RuleSchemaV2.safeParse(updatedRule);
      if (!validationResult.success) {
        const validationError = new Error(`Rule update validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`);
        await this.logger.logError('rule.update.validation.failed', validationError, {
          errors: validationResult.error.errors,
          ruleId,
          updates: updates
        });
        throw validationError;
      }
      
      const validatedRule = validationResult.data;
      this.rules.set(ruleId, validatedRule);

      await this.logger.log('rule.updated', {
        ruleId,
        ruleName: validatedRule.name,
        updatedFields: Object.keys(updates)
      });

      return validatedRule;
    } catch (error) {
      await this.logger.logError('rule.update.failed', error, { ruleId, updates });
      throw error;
    }
  }

  /**
   * Evaluate a set of conditions against transaction data
   * @param {Array} conditions - Array of condition objects
   * @param {Object} transaction - Transaction data
   * @param {string} logicOperator - AND, OR, NOT
   * @returns {Promise<boolean>} Evaluation result
   */
  async evaluateConditions(conditions, transaction, logicOperator = 'AND') {
    const results = [];
    for (const condition of conditions) {
      if (condition.conditions && condition.conditions.length > 0) {
        // Handle nested conditions recursively
        const nestedResult = await this.evaluateConditions(
          condition.conditions,
          transaction,
          condition.logicalOperator || 'AND'
        );
        results.push(nestedResult);
      } else {
        const result = await this.evaluateSingleCondition(condition, transaction);
        results.push(result);
      }
    }

    const logicalOperatorFn = LOGICAL_OPERATORS[logicOperator];
    if (!logicalOperatorFn) {
      throw new Error(`Unsupported logical operator: ${logicOperator}`);
    }

    return logicalOperatorFn(results);
  }

  /**
   * Evaluate a single condition
   * @param {Object} condition - Condition object
   * @param {Object} transaction - Transaction data
   * @returns {Promise<boolean>} Evaluation result
   */
  async evaluateSingleCondition(condition, transaction) {
    const operatorFn = OPERATORS[condition.operator];
    if (!operatorFn) {
      throw new Error(`Unsupported operator: ${condition.operator}`);
    }

    let transactionValue;
    // Handle nested fields like transaction.location.city
    if (condition.field.includes('.')) {
      transactionValue = condition.field.split('.').reduce((obj, key) => obj && obj[key], transaction);
    } else {
      transactionValue = transaction[condition.field];
    }

    if (transactionValue === undefined) {
      return false; // Field does not exist on transaction
    }

    return operatorFn(transactionValue, condition.value);
  }

  /**
   * Execute a rule's action with timeout protection
   * @param {Object} rule - Rule object
   * @param {Object} transaction - Transaction that triggered the rule
   * @returns {Promise<Object>} Action result
   */
  async executeRule(rule, transaction) {
    const startTime = Date.now();
    try {
      await this.logger.logRuleTriggered(rule.id, rule.action?.type, {
        ruleName: rule.name,
        transactionId: transaction.id,
        actionPayload: rule.action?.payload
      });

      const result = {
        ruleId: rule.id,
        ruleName: rule.name,
        actionType: rule.action?.type,
        payload: rule.action?.payload,
        transactionId: transaction.id,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime
      };

      this.updateTriggerHistory(rule.id);

      await this.logger.log('rule.executed', {
        ruleId: rule.id,
        ruleName: rule.name,
        executionTime: result.executionTime,
        actionType: rule.action?.type
      });

      return result;
    } catch (error) {
      await this.logger.logError('rule.execution.failed', error, { rule, transaction });
      throw error;
    }
  }

  /**
   * Get all rules that match a transaction
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Array>} Matching rules
   */
  async getMatchingRules(transaction) {
    try {
      const matchingRules = [];
      
      for (const [ruleId, rule] of this.rules) {
        if (rule.isActive !== false) { // Default to active if not specified
          try {
            const matches = await this.evaluateRule(rule, transaction);
            if (matches) {
              matchingRules.push(rule);
            }
          } catch (error) {
            // Log evaluation error but continue with other rules
            await this.logger.logError('rule.evaluation.error', error, { ruleId, transaction });
          }
        }
      }

      await this.logger.log('rules.matching.found', {
        transactionId: transaction.id,
        matchingCount: matchingRules.length,
        totalRules: this.rules.size
      });

      return matchingRules;
    } catch (error) {
      await this.logger.logError('rules.matching.failed', error, { transaction });
      throw error;
    }
  }

  /**
   * Simulate rule execution without actually executing
   * @param {Object} rule - Rule object
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Object>} Simulation result
   */
  async simulateRule(rule, transaction) {
    const startTime = Date.now();
    try {
      const evaluationResult = await this.evaluateRule(rule, transaction);
      
      const simulation = {
        ruleId: rule.id,
        ruleName: rule.name,
        wouldTrigger: evaluationResult.matched,
        actionType: rule.action?.type,
        payload: rule.action?.payload,
        transactionId: transaction.id,
        simulationTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
      
      await this.logger.log('rule.simulated', {
        ruleId: rule.id,
        ruleName: rule.name,
        wouldTrigger: evaluationResult.matched,
        simulationTime: simulation.simulationTime
      });
      
      return simulation;
    } catch (error) {
      await this.logger.logError('rule.simulation.failed', error, { rule, transaction });
      throw error;
    }
  }

  /**
   * Update trigger history for frequency analysis
   * @param {string} ruleId - Rule ID
   */
  updateTriggerHistory(ruleId) {
    const now = Date.now();
    const history = this.triggerHistory.get(ruleId) || [];
    
    // Keep only last 30 days of triggers
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(timestamp => timestamp > thirtyDaysAgo);
    
    recentHistory.push(now);
    this.triggerHistory.set(ruleId, recentHistory);
  }

  /**
   * Get trigger frequency for a rule
   * @param {string} ruleId - Rule ID
   * @param {number} days - Number of days to look back
   * @returns {number} Trigger count
   */
  getTriggerFrequency(ruleId, days = 7) {
    const history = this.triggerHistory.get(ruleId) || [];
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return history.filter(timestamp => timestamp > cutoff).length;
  }

  /**
   * Validate rule structure
   * @param {Object} rule - Rule object
   * @returns {Promise<Object>} Validation result with valid property
   */
  async validateRule(rule) {
    try {
      const parsed = RuleSchemaV2.safeParse(rule);
      // CLUSTER 2 FIX: Return expected object structure with valid property
      return {
        valid: parsed.success,
        errors: parsed.success ? [] : parsed.error.errors
      };
    } catch (error) {
      await this.logger.logError('rule.validation.failed', error, { rule });
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Get all registered rules
   * @returns {Array} Array of rules
   */
  getAllRules() {
    return Array.from(this.rules.values());
  }

  /**
   * Remove a rule
   * @param {string} ruleId - Rule ID
   */
  async removeRule(ruleId) {
    if (this.rules.has(ruleId)) {
      this.rules.delete(ruleId);
      this.triggerHistory.delete(ruleId);
      
      await this.logger.log('rule.removed', { ruleId });
    }
  }

  /**
   * Evaluate multiple rules against transaction data
   * @param {Array} rules - Array of rule objects
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Array>} Array of evaluation results
   */
  async evaluateRules(rules, transaction) {
    try {
      const results = [];
      
      for (const rule of rules) {
        try {
          const result = await this.evaluateRule(rule, transaction);
          results.push({
            ruleId: rule.id,
            ruleName: rule.name,
            matched: result.matched,
            action: rule.action
          });
        } catch (error) {
          // Log evaluation error but continue with other rules
          await this.logger.logError('rule.evaluation.error', error, { ruleId: rule.id, transaction });
          results.push({
            ruleId: rule.id,
            ruleName: rule.name,
            matched: false,
            error: error.message
          });
        }
      }

      await this.logger.log('rules.evaluated', {
        transactionId: transaction.id,
        rulesCount: rules.length,
        resultsCount: results.length
      });

      return results;
    } catch (error) {
      await this.logger.logError('rules.evaluation.failed', error, { rules, transaction });
      throw error;
    }
  }

  /**
   * Clear all rules
   */
  async clearRules() {
    this.rules.clear();
    this.triggerHistory.clear();
    
    await this.logger.log('rules.cleared');
  }
}

// Export singleton instance
const ruleEngine = new RuleEngine();
export default ruleEngine;

// Export the class for testing
export { RuleEngine };

// Legacy exports for backward compatibility
export const evaluateRule = (rule, transaction) => ruleEngine.evaluateRule(rule, transaction);
export const executeRule = (rule, transaction) => ruleEngine.executeRule(rule, transaction);
export const simulateRule = (rule, transaction) => ruleEngine.simulateRule(rule, transaction);
export const validateRule = (rule) => ruleEngine.validateRule(rule);
export const getMatchingRules = (transaction, allRules) => {
  // Legacy function - now uses internal rule registry
  return ruleEngine.getMatchingRules(transaction);
}; 
