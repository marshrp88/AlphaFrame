import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ruleEngine from '../ruleEngine';

// CLUSTER 2 FIX: Proper transaction data with required fields
const mockTransaction = {
  id: 'txn_123',
  amount: 1500,
  date: '2024-01-15',
  category: 'income',
  description: 'Test transaction'
};

describe('ruleEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('evaluateRule', () => {
    it('should evaluate a simple condition rule', async () => {
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test rule for high amounts',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 1000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'High balance alert' }
        },
        logicOperator: 'AND',
        enabled: true
      };

      const result = await ruleEngine.evaluateRule(rule, mockTransaction);
      
      expect(result.matched).toBe(true);
      expect(result.action.type).toBe(rule.action.type);
      expect(result.action.payload).toEqual(rule.action.payload);
    });

    it('should handle complex conditions', async () => {
      const rule = {
        id: 'complex-rule',
        name: 'Complex Rule',
        description: 'Complex rule with multiple conditions',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 1000
          },
          {
            field: 'category',
            operator: '===',
            value: 'income'
          }
        ],
        action: {
          type: 'webhook',
          payload: { url: 'https://api.example.com/webhook' }
        },
        logicOperator: 'AND',
        enabled: true
      };

      const result = await ruleEngine.evaluateRule(rule, mockTransaction);
      
      expect(result.matched).toBe(true);
    });

    it('should return false for non-matching conditions', async () => {
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test rule for high amounts',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 2000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'High balance alert' }
        },
        logicOperator: 'AND',
        enabled: true
      };

      const result = await ruleEngine.evaluateRule(rule, mockTransaction);
      
      expect(result.matched).toBe(false);
    });
  });

  describe('evaluateRules', () => {
    it('should evaluate multiple rules', async () => {
      const rules = [
        {
          id: 'rule1',
          name: 'Rule 1',
          description: 'First rule for testing',
          conditions: [
            {
              field: 'amount',
              operator: '>',
              value: 1000
            }
          ],
          action: {
            type: 'notification',
            payload: { message: 'High balance' }
          },
          logicOperator: 'AND',
          enabled: true
        },
        {
          id: 'rule2',
          name: 'Rule 2',
          description: 'Second rule for testing',
          conditions: [
            {
              field: 'category',
              operator: '===',
              value: 'income'
            }
          ],
          action: {
            type: 'webhook',
            payload: { url: 'https://api.example.com/expense' }
          },
          logicOperator: 'AND',
          enabled: true
        }
      ];

      const results = await ruleEngine.evaluateRules(rules, mockTransaction);
      
      expect(results).toHaveLength(2);
      expect(results[0].matched).toBe(true);
      expect(results[1].matched).toBe(true);
    });
  });

  describe('validateRule', () => {
    it('should validate a correct rule', async () => {
      const rule = {
        id: 'valid-rule',
        name: 'Valid Rule',
        description: 'Valid rule for testing',
        conditions: [
          {
            field: 'amount',
            operator: '>',
            value: 1000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'Test message' }
        },
        logicOperator: 'AND',
        enabled: true
      };

      const result = await ruleEngine.validateRule(rule);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid rules', async () => {
      const rule = {
        id: 'invalid-rule',
        // Missing required fields
      };

      const result = await ruleEngine.validateRule(rule);
      expect(result.valid).toBe(false);
    });
  });
}); 