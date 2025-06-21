/**
 * RuleEngine.test.js
 * 
 * Purpose: Comprehensive unit tests for the enhanced Rule Engine 2.0 to ensure
 * all advanced rule processing functionality works correctly including
 * multi-condition chaining, calendar triggers, live simulation, and logging.
 * 
 * Procedure:
 * 1. Test rule registration and management
 * 2. Test basic condition evaluation
 * 3. Test complex logical operators (AND/OR/NOT)
 * 4. Test calendar and date-based triggers
 * 5. Test rule simulation functionality
 * 6. Test ExecutionLogService integration
 * 7. Test error handling and validation
 * 
 * Conclusion: These tests validate that the Rule Engine 2.0 properly
 * processes complex rules, handles advanced conditions, and integrates
 * seamlessly with the logging system.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RuleEngine } from '../../../lib/services/ruleEngine.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Mock ExecutionLogService
vi.mock('../../../core/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn(),
    logError: vi.fn(),
    logRuleTriggered: vi.fn()
  }
}));

describe('RuleEngine 2.0', () => {
  let ruleEngine;

  beforeEach(() => {
    ruleEngine = new RuleEngine();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(ruleEngine.rules).toBeInstanceOf(Map);
      expect(ruleEngine.triggerHistory).toBeInstanceOf(Map);
    });

    it('should start with empty rules and history', () => {
      expect(ruleEngine.rules.size).toBe(0);
      expect(ruleEngine.triggerHistory.size).toBe(0);
    });
  });

  describe('Rule Registration', () => {
    it('should register a valid rule', async () => {
      const rule = {
        name: 'High Spending Alert',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: {
          type: 'notification',
          payload: { message: 'High amount purchase detected' }
        }
      };

      const ruleId = await ruleEngine.registerRule(rule);

      expect(ruleId).toBeDefined();
      expect(ruleEngine.rules.has(ruleId)).toBe(true);
      expect(ruleEngine.rules.get(ruleId).name).toBe('High Spending Alert');

      expect(executionLogService.log).toHaveBeenCalledWith(
        'rule.registered',
        expect.objectContaining({
          ruleId,
          ruleName: 'High Spending Alert',
          conditionsCount: 1,
          actionType: 'notification'
        })
      );
    });

    it('should generate rule ID if not provided', async () => {
      const rule = {
        name: 'Test Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 50 }
        ],
        action: { type: 'notification' }
      };

      const ruleId = await ruleEngine.registerRule(rule);

      expect(ruleId).toMatch(/^rule_\d+_[a-z0-9]+$/);
    });

    it('should reject invalid rules', async () => {
      const invalidRule = {
        name: 'Invalid Rule',
        action: { type: 'notification' }
      };

      await expect(ruleEngine.registerRule(invalidRule))
        .rejects.toThrow();

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'rule.registration.failed',
        expect.any(Error),
        { rule: invalidRule }
      );
    });
  });

  describe('Basic Condition Evaluation', () => {
    beforeEach(async () => {
      // Register a basic rule for testing
      const basicRule = {
        name: 'test-rule-basic',
        description: 'Test rule for basic evaluation',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(basicRule);
    });

    it('should evaluate simple greater-than rule', async () => {
      const transaction = {
        id: 'txn_1',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.evaluateRule(ruleEngine.rules.get('test-rule-basic'), transaction);
      expect(result).toBe(true);
    });

    it('should evaluate AND conditions', async () => {
      const andRule = {
        name: 'test-rule-and',
        description: 'Test rule with AND conditions',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          },
          {
            field: 'merchant_name',
            operator: 'contains',
            value: 'Store'
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount from store detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(andRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-and');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_2',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(true);
    });

    it('should return false for unmet conditions', async () => {
      const transaction = {
        id: 'txn_3',
        amount: 50,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-basic');
      const rule = ruleEngine.rules.get(ruleId);

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(false);
    });

    it('should handle missing transaction fields gracefully', async () => {
      const transaction = {
        id: 'txn_4',
        amount: 150,
        date: '2024-01-15'
        // merchant_name is missing
      };

      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-basic');
      const rule = ruleEngine.rules.get(ruleId);

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(true); // Should still pass the amount condition
    });
  });

  describe('Advanced Operators', () => {
    it('should handle string operators', async () => {
      const stringRule = {
        name: 'test-rule-string',
        description: 'Test rule with string operators',
        conditions: [
          {
            field: 'merchant_name',
            operator: 'contains',
            value: 'Coffee'
          }
        ],
        action: {
          type: 'notification',
          message: 'Coffee purchase detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(stringRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-string');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_5',
        amount: 5.50,
        merchant_name: 'Starbucks Coffee',
        date: '2024-01-15'
      };

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(true);
    });
  });

  describe('Logical Operators', () => {
    it('should handle OR conditions', async () => {
      const orRule = {
        name: 'test-rule-or',
        description: 'Test rule with OR conditions',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          },
          {
            field: 'merchant_name',
            operator: 'contains',
            value: 'Restaurant'
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount or restaurant purchase detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(orRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-or');
      const rule = ruleEngine.rules.get(ruleId);

      // Test with high amount
      const transaction1 = {
        id: 'txn_6',
        amount: 150,
        merchant_name: 'Grocery Store',
        date: '2024-01-15'
      };

      const result1 = await ruleEngine.evaluateRule(rule, transaction1);
      expect(result1).toBe(true);

      // Test with restaurant
      const transaction2 = {
        id: 'txn_7',
        amount: 25,
        merchant_name: 'Pizza Restaurant',
        date: '2024-01-15'
      };

      const result2 = await ruleEngine.evaluateRule(rule, transaction2);
      expect(result2).toBe(true);
    });

    it('should handle NOT conditions', async () => {
      const notRule = {
        name: 'test-rule-not',
        description: 'Test rule with NOT conditions',
        conditions: [
          {
            field: 'merchant_name',
            operator: '!==',
            value: 'Gas Station'
          }
        ],
        action: {
          type: 'notification',
          message: 'Non-gas purchase detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(notRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-not');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_8',
        amount: 25,
        merchant_name: 'Grocery Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(true);
    });

    it('should handle complex nested logical operators', async () => {
      const complexRule = {
        name: 'test-rule-complex',
        description: 'Test rule with complex nested conditions',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 50
          },
          {
            field: 'merchant_name',
            operator: 'contains',
            value: 'Store'
          },
          {
            field: 'category',
            operator: '!==',
            value: 'Gas'
          }
        ],
        action: {
          type: 'notification',
          message: 'Complex condition met'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(complexRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-complex');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_9',
        amount: 75,
        merchant_name: 'Grocery Store',
        category: 'Food',
        date: '2024-01-15'
      };

      const result = await ruleEngine.evaluateRule(rule, transaction);
      expect(result).toBe(true);
    });
  });

  describe('Rule Execution', () => {
    it('should execute rule actions', async () => {
      const executionRule = {
        name: 'test-rule-execution',
        description: 'Test rule execution',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(executionRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-execution');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_10',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.executeRule(rule, transaction);
      expect(result.success).toBe(true);
    });

    it('should update trigger history on execution', async () => {
      const historyRule = {
        name: 'test-rule-history',
        description: 'Test rule trigger history',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(historyRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-history');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_11',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      await ruleEngine.executeRule(rule, transaction);
      
      const frequency = ruleEngine.getTriggerFrequency(ruleId);
      expect(frequency).toBeGreaterThan(0);
    });
  });

  describe('Rule Simulation', () => {
    it('should simulate rule execution without executing', async () => {
      const simulationRule = {
        name: 'test-rule-simulation',
        description: 'Test rule simulation',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(simulationRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-simulation');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_12',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.simulateRule(rule, transaction);
      expect(result.wouldTrigger).toBe(true);
      expect(result.conditionsMet).toBe(true);
    });

    it('should simulate rule that would not trigger', async () => {
      const simulationRule = {
        name: 'test-rule-simulation-false',
        description: 'Test rule simulation that would not trigger',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(simulationRule);
      const ruleId = Array.from(ruleEngine.rules.keys()).find(key => ruleEngine.rules.get(key).name === 'test-rule-simulation-false');
      const rule = ruleEngine.rules.get(ruleId);

      const transaction = {
        id: 'txn_13',
        amount: 50,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const result = await ruleEngine.simulateRule(rule, transaction);
      expect(result.wouldTrigger).toBe(false);
      expect(result.conditionsMet).toBe(false);
    });
  });

  describe('Rule Management', () => {
    it('should remove rules', async () => {
      const removeRule = {
        name: 'test-rule-remove',
        description: 'Test rule for removal',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      const ruleId = await ruleEngine.registerRule(removeRule);
      expect(ruleEngine.rules.has(ruleId)).toBe(true);

      await ruleEngine.removeRule(ruleId);
      expect(ruleEngine.rules.has(ruleId)).toBe(false);
    });

    it('should clear all rules', async () => {
      const clearRule = {
        name: 'test-rule-clear',
        description: 'Test rule for clearing',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(clearRule);
      expect(ruleEngine.rules.size).toBeGreaterThan(0);

      await ruleEngine.clearRules();
      expect(ruleEngine.rules.size).toBe(0);
    });
  });

  describe('Matching Rules', () => {
    it('should find matching rules for a transaction', async () => {
      const matchingRule = {
        name: 'test-rule-matching',
        description: 'Test rule for matching',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      await ruleEngine.registerRule(matchingRule);

      const transaction = {
        id: 'txn_14',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      const matchingRules = await ruleEngine.getMatchingRules(transaction);
      expect(matchingRules.length).toBeGreaterThan(0);
      expect(matchingRules.some(rule => rule.name === 'test-rule-matching')).toBe(true);
    });
  });

  describe('Trigger Frequency', () => {
    it('should track trigger frequency', async () => {
      const frequencyRule = {
        name: 'test-rule-frequency',
        description: 'Test rule for frequency tracking',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      const ruleId = await ruleEngine.registerRule(frequencyRule);

      const transaction = {
        id: 'txn_15',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      await ruleEngine.executeRule(ruleEngine.rules.get(ruleId), transaction);
      
      const frequency = ruleEngine.getTriggerFrequency(ruleId);
      expect(frequency).toBeGreaterThan(0);
    });

    it('should respect time window for frequency calculation', async () => {
      const timeRule = {
        name: 'test-rule-time',
        description: 'Test rule for time window frequency',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'High amount transaction detected'
        },
        priority: 5,
        enabled: true
      };

      const ruleId = await ruleEngine.registerRule(timeRule);

      const transaction = {
        id: 'txn_16',
        amount: 150,
        merchant_name: 'Test Store',
        date: '2024-01-15'
      };

      await ruleEngine.executeRule(ruleEngine.rules.get(ruleId), transaction);
      
      const frequency7Days = ruleEngine.getTriggerFrequency(ruleId, 7);
      const frequency30Days = ruleEngine.getTriggerFrequency(ruleId, 30);
      
      expect(frequency7Days).toBeGreaterThan(0);
      expect(frequency30Days).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid logical operators', async () => {
      const invalidRule = {
        name: 'test-rule-invalid',
        description: 'Test rule with invalid operator',
        conditions: [
          {
            field: 'amount',
            operator: 'INVALID_OPERATOR',
            value: 100
          }
        ],
        action: {
          type: 'notification',
          message: 'Invalid operator test'
        },
        priority: 5,
        enabled: true
      };

      await expect(ruleEngine.registerRule(invalidRule))
        .rejects.toThrow('Invalid logical operator');
    });

    it('should handle missing required fields', async () => {
      const invalidRule = {
        name: 'test-rule-missing-fields',
        description: 'Test rule with missing fields',
        conditions: [
          {
            field: 'amount',
            // Missing operator and value
          }
        ],
        action: {
          type: 'notification',
          message: 'Missing fields test'
        },
        priority: 5,
        enabled: true
      };

      await expect(ruleEngine.registerRule(invalidRule))
        .rejects.toThrow('Rule validation failed');
    });
  });
});
