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
    
    // Reset mocks
    executionLogService.log.mockResolvedValue();
    executionLogService.logError.mockResolvedValue();
    executionLogService.logRuleTriggered.mockResolvedValue();
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
          type: 'alert',
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
          actionType: 'alert'
        })
      );
    });

    it('should generate rule ID if not provided', async () => {
      const rule = {
        name: 'Test Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 50 }
        ],
        action: { type: 'alert' }
      };

      const ruleId = await ruleEngine.registerRule(rule);

      expect(ruleId).toMatch(/^rule_\d+_[a-z0-9]+$/);
    });

    it('should reject invalid rules', async () => {
      const invalidRule = {
        name: 'Invalid Rule'
        // Missing conditions and action
      };

      await expect(ruleEngine.registerRule(invalidRule))
        .rejects.toThrow('Invalid rule structure');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'rule.registration.failed',
        expect.any(Error),
        { rule: invalidRule }
      );
    });
  });

  describe('Basic Condition Evaluation', () => {
    beforeEach(async () => {
      const rule = {
        name: 'Basic Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);
    });

    it('should evaluate simple conditions correctly', async () => {
      const transaction = { id: 'txn1', amount: 150 };
      const rule = ruleEngine.getAllRules()[0];

      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(true);
      expect(executionLogService.log).toHaveBeenCalledWith(
        'rule.evaluated',
        expect.objectContaining({
          ruleId: rule.id,
          result: true,
          transactionId: 'txn1'
        })
      );
    });

    it('should handle multiple conditions with AND logic', async () => {
      const rule = {
        name: 'Multi Condition Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 },
          { field: 'category', operator: '===', value: 'Food' }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150, category: 'Food' };
      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(true);
    });

    it('should return false when conditions are not met', async () => {
      const transaction = { id: 'txn1', amount: 50 };
      const rule = ruleEngine.getAllRules()[0];

      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(false);
    });

    it('should handle missing transaction fields', async () => {
      const transaction = { id: 'txn1' }; // Missing amount field
      const rule = ruleEngine.getAllRules()[0];

      await expect(ruleEngine.evaluateRule(rule, transaction))
        .rejects.toThrow('Field "amount" not found on transaction');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'rule.evaluation.failed',
        expect.objectContaining({
          message: 'Field "amount" not found on transaction.'
        }),
        expect.objectContaining({
          rule: expect.objectContaining({
            id: expect.any(String),
            name: 'Basic Rule'
          }),
          transaction: { id: 'txn1' }
        })
      );
    });
  });

  describe('Advanced Operators', () => {
    it('should handle string operators', async () => {
      const rule = {
        name: 'String Rule',
        conditions: [
          { field: 'description', operator: 'contains', value: 'coffee' }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', description: 'Starbucks coffee purchase' };
      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(true);
    });

    it('should handle date operators', async () => {
      const rule = {
        name: 'Date Rule',
        conditions: [
          { field: 'date', operator: 'isToday', value: null }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', date: new Date().toISOString() };
      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(true);
    });

    it('should handle comparison operators', async () => {
      const rule = {
        name: 'Comparison Rule',
        conditions: [
          { field: 'amount', operator: '>=', value: 100 },
          { field: 'amount', operator: '<=', value: 200 }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150 };
      const result = await ruleEngine.evaluateRule(rule, transaction);

      expect(result).toBe(true);
    });
  });

  describe('Logical Operators', () => {
    it('should handle OR conditions', async () => {
      const rule = {
        name: 'OR Rule',
        conditions: [
          {
            logicalOperator: 'OR',
            conditions: [
              { field: 'amount', operator: '>', value: 100 },
              { field: 'category', operator: '===', value: 'Food' }
            ]
          }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      // Test first condition true
      const transaction1 = { id: 'txn1', amount: 150, category: 'Transport' };
      const result1 = await ruleEngine.evaluateRule(rule, transaction1);
      expect(result1).toBe(true);

      // Test second condition true
      const transaction2 = { id: 'txn2', amount: 50, category: 'Food' };
      const result2 = await ruleEngine.evaluateRule(rule, transaction2);
      expect(result2).toBe(true);

      // Test both false
      const transaction3 = { id: 'txn3', amount: 50, category: 'Transport' };
      const result3 = await ruleEngine.evaluateRule(rule, transaction3);
      expect(result3).toBe(false);
    });

    it('should handle NOT conditions', async () => {
      const rule = {
        name: 'NOT Rule',
        conditions: [
          {
            logicalOperator: 'NOT',
            conditions: [
              { field: 'category', operator: '===', value: 'Food' }
            ]
          }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      // Test NOT Food (should be true)
      const transaction1 = { id: 'txn1', category: 'Transport' };
      const result1 = await ruleEngine.evaluateRule(rule, transaction1);
      expect(result1).toBe(true);

      // Test Food (should be false)
      const transaction2 = { id: 'txn2', category: 'Food' };
      const result2 = await ruleEngine.evaluateRule(rule, transaction2);
      expect(result2).toBe(false);
    });

    it('should handle complex nested logical operators', async () => {
      const rule = {
        name: 'Complex Rule',
        conditions: [
          {
            logicalOperator: 'AND',
            conditions: [
              { field: 'amount', operator: '>', value: 50 },
              {
                logicalOperator: 'OR',
                conditions: [
                  { field: 'category', operator: '===', value: 'Food' },
                  { field: 'category', operator: '===', value: 'Entertainment' }
                ]
              }
            ]
          }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      // Test valid case
      const transaction1 = { id: 'txn1', amount: 100, category: 'Food' };
      const result1 = await ruleEngine.evaluateRule(rule, transaction1);
      expect(result1).toBe(true);

      // Test invalid case
      const transaction2 = { id: 'txn2', amount: 30, category: 'Food' };
      const result2 = await ruleEngine.evaluateRule(rule, transaction2);
      expect(result2).toBe(false);
    });
  });

  describe('Rule Execution', () => {
    it('should execute rule actions', async () => {
      const rule = {
        name: 'Executable Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: {
          type: 'transfer',
          payload: { from: 'checking', to: 'savings', amount: 50 }
        }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150 };
      const result = await ruleEngine.executeRule(rule, transaction);

      expect(result.ruleId).toBe(rule.id);
      expect(result.actionType).toBe('transfer');
      expect(result.transactionId).toBe('txn1');
      expect(result.executionTime).toBeGreaterThan(0);

      expect(executionLogService.logRuleTriggered).toHaveBeenCalledWith(
        rule.id,
        'transfer',
        expect.objectContaining({
          ruleName: 'Executable Rule',
          transactionId: 'txn1'
        })
      );
    });

    it('should update trigger history on execution', async () => {
      const rule = {
        name: 'History Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150 };
      await ruleEngine.executeRule(rule, transaction);

      const frequency = ruleEngine.getTriggerFrequency(rule.id, 1);
      expect(frequency).toBe(1);
    });
  });

  describe('Rule Simulation', () => {
    it('should simulate rule execution without executing', async () => {
      const rule = {
        name: 'Simulation Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: {
          type: 'transfer',
          payload: { amount: 50 }
        }
      };
      await ruleEngine.registerRule(rule);
      const registeredRule = ruleEngine.rules.get(ruleEngine.getAllRules()[0].id);

      const transaction = { id: 'txn1', amount: 150 };
      const simulation = await ruleEngine.simulateRule(registeredRule, transaction);

      expect(simulation.wouldTrigger).toBe(true);
      expect(simulation.actionType).toBe('transfer');
      expect(simulation.transactionId).toBe('txn1');
      expect(simulation.simulationTime).toBeGreaterThan(0);

      expect(executionLogService.log).toHaveBeenLastCalledWith(
        'rule.simulated',
        expect.objectContaining({
          ruleId: registeredRule.id,
          wouldTrigger: true
        })
      );
    });

    it('should simulate rule that would not trigger', async () => {
      const rule = {
        name: 'No Trigger Rule',
        conditions: [
          { field: 'amount', operator: '>', value: 100 }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 50 };
      const simulation = await ruleEngine.simulateRule(rule, transaction);

      expect(simulation.wouldTrigger).toBe(false);
    });
  });

  describe('Rule Management', () => {
    it('should get all registered rules', async () => {
      const rule1 = {
        name: 'Rule 1',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const rule2 = {
        name: 'Rule 2',
        conditions: [{ field: 'category', operator: '===', value: 'Food' }],
        action: { type: 'alert' }
      };

      await ruleEngine.registerRule(rule1);
      await ruleEngine.registerRule(rule2);

      const allRules = ruleEngine.getAllRules();
      expect(allRules).toHaveLength(2);
      expect(allRules.map(r => r.name)).toContain('Rule 1');
      expect(allRules.map(r => r.name)).toContain('Rule 2');
    });

    it('should remove rules', async () => {
      const rule = {
        name: 'Removable Rule',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const ruleId = await ruleEngine.registerRule(rule);

      expect(ruleEngine.rules.has(ruleId)).toBe(true);

      await ruleEngine.removeRule(ruleId);

      expect(ruleEngine.rules.has(ruleId)).toBe(false);
      expect(executionLogService.log).toHaveBeenCalledWith(
        'rule.removed',
        { ruleId }
      );
    });

    it('should clear all rules', async () => {
      const rule1 = {
        name: 'Rule 1',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const rule2 = {
        name: 'Rule 2',
        conditions: [{ field: 'category', operator: '===', value: 'Food' }],
        action: { type: 'alert' }
      };

      await ruleEngine.registerRule(rule1);
      await ruleEngine.registerRule(rule2);

      expect(ruleEngine.rules.size).toBe(2);

      await ruleEngine.clearRules();

      expect(ruleEngine.rules.size).toBe(0);
      expect(ruleEngine.triggerHistory.size).toBe(0);
      expect(executionLogService.log).toHaveBeenCalledWith('rules.cleared');
    });
  });

  describe('Matching Rules', () => {
    beforeEach(async () => {
      const rule1 = {
        name: 'High Amount Rule',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const rule2 = {
        name: 'Food Category Rule',
        conditions: [{ field: 'category', operator: '===', value: 'Food' }],
        action: { type: 'alert' }
      };
      const rule3 = {
        name: 'Inactive Rule',
        conditions: [{ field: 'amount', operator: '>', value: 50 }],
        action: { type: 'alert' },
        isActive: false
      };

      await ruleEngine.registerRule(rule1);
      await ruleEngine.registerRule(rule2);
      await ruleEngine.registerRule(rule3);
    });

    it('should find matching rules for a transaction', async () => {
      const transaction = { id: 'txn1', amount: 150, category: 'Food' };
      const matchingRules = await ruleEngine.getMatchingRules(transaction);

      expect(matchingRules).toHaveLength(2);
      expect(matchingRules.map(r => r.name)).toContain('High Amount Rule');
      expect(matchingRules.map(r => r.name)).toContain('Food Category Rule');
      expect(matchingRules.map(r => r.name)).not.toContain('Inactive Rule');

      expect(executionLogService.log).toHaveBeenCalledWith(
        'rules.matching.found',
        expect.objectContaining({
          transactionId: 'txn1',
          matchingCount: 2,
          totalRules: 3
        })
      );
    });

    it('should handle transactions with no matches', async () => {
      const transaction = { id: 'txn1', amount: 50, category: 'Transport' };
      const matchingRules = await ruleEngine.getMatchingRules(transaction);

      expect(matchingRules).toHaveLength(0);
    });
  });

  describe('Trigger Frequency', () => {
    it('should track trigger frequency', async () => {
      const rule = {
        name: 'Frequency Rule',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const ruleId = await ruleEngine.registerRule(rule);
      const registeredRule = ruleEngine.rules.get(ruleId);

      const transaction = { id: 'txn1', amount: 150 };
      
      // Execute rule multiple times
      await ruleEngine.executeRule(registeredRule, transaction);
      await ruleEngine.executeRule(registeredRule, transaction);
      await ruleEngine.executeRule(registeredRule, transaction);

      const frequency = ruleEngine.getTriggerFrequency(ruleId, 1);
      expect(frequency).toBe(3);
    });

    it('should respect time window for frequency calculation', async () => {
      const rule = {
        name: 'Time Window Rule',
        conditions: [{ field: 'amount', operator: '>', value: 100 }],
        action: { type: 'alert' }
      };
      const ruleId = await ruleEngine.registerRule(rule);
      const registeredRule = ruleEngine.rules.get(ruleId);

      const transaction = { id: 'txn1', amount: 150 };
      await ruleEngine.executeRule(registeredRule, transaction);

      const frequency1Day = ruleEngine.getTriggerFrequency(ruleId, 1);
      const frequency30Days = ruleEngine.getTriggerFrequency(ruleId, 30);

      expect(frequency1Day).toBe(1);
      expect(frequency30Days).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown operators gracefully', async () => {
      const rule = {
        name: 'Unknown Operator Rule',
        conditions: [
          { field: 'amount', operator: 'unknown', value: 100 }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150 };
      
      await expect(ruleEngine.evaluateRule(rule, transaction))
        .rejects.toThrow('Unknown operator: unknown');
    });

    it('should handle invalid logical operators', async () => {
      const rule = {
        name: 'Invalid Logical Rule',
        conditions: [
          {
            logicalOperator: 'INVALID',
            conditions: [
              { field: 'amount', operator: '>', value: 100 }
            ]
          }
        ],
        action: { type: 'alert' }
      };
      await ruleEngine.registerRule(rule);

      const transaction = { id: 'txn1', amount: 150 };
      
      await expect(ruleEngine.evaluateRule(rule, transaction))
        .rejects.toThrow();
    });
  });
});
