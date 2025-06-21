import { describe, it, expect, vi, beforeEach } from 'vitest';
import ruleEngine from '../ruleEngine';

describe('ruleEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('evaluateRule', () => {
    it('should evaluate a simple condition rule', async () => {
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        conditions: [
          {
            field: 'balance',
            operator: '>',
            value: 1000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'High balance alert' }
        },
        isActive: true
      };

      const data = { balance: 1500 };
      const result = await ruleEngine.evaluateRule(rule, data);
      
      expect(result.matched).toBe(true);
      expect(result.action).toEqual(rule.action);
    });

    it('should handle complex conditions', async () => {
      const rule = {
        id: 'complex-rule',
        name: 'Complex Rule',
        conditions: [
          {
            logicalOperator: 'and',
            conditions: [
              {
                field: 'balance',
                operator: '>',
                value: 1000
              },
              {
                field: 'category',
                operator: '===',
                value: 'income'
              }
            ]
          }
        ],
        action: {
          type: 'webhook',
          payload: { url: 'https://api.example.com/webhook' }
        },
        isActive: true
      };

      const data = { balance: 1500, category: 'income' };
      const result = await ruleEngine.evaluateRule(rule, data);
      
      expect(result.matched).toBe(true);
    });

    it('should return false for non-matching conditions', async () => {
      const rule = {
        id: 'test-rule',
        name: 'Test Rule',
        conditions: [
          {
            field: 'balance',
            operator: '>',
            value: 1000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'High balance alert' }
        },
        isActive: true
      };

      const data = { balance: 500 };
      const result = await ruleEngine.evaluateRule(rule, data);
      
      expect(result.matched).toBe(false);
    });
  });

  describe('evaluateRules', () => {
    it('should evaluate multiple rules', async () => {
      const rules = [
        {
          id: 'rule1',
          name: 'Rule 1',
          conditions: [
            {
              field: 'balance',
              operator: '>',
              value: 1000
            }
          ],
          action: {
            type: 'notification',
            payload: { message: 'High balance' }
          },
          isActive: true
        },
        {
          id: 'rule2',
          name: 'Rule 2',
          conditions: [
            {
              field: 'category',
              operator: '===',
              value: 'expense'
            }
          ],
          action: {
            type: 'webhook',
            payload: { url: 'https://api.example.com/expense' }
          },
          isActive: true
        }
      ];

      const data = { balance: 1500, category: 'expense' };
      const results = await ruleEngine.evaluateRules(rules, data);
      
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
        conditions: [
          {
            field: 'balance',
            operator: '>',
            value: 1000
          }
        ],
        action: {
          type: 'notification',
          payload: { message: 'Test message' }
        },
        isActive: true
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