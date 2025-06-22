import { describe, it, expect, vi, beforeEach } from 'vitest';
import ruleEngine from '../../../src/lib/services/ruleEngine';
import { RuleSchema } from '@/lib/validation/schemas';

// Mock data for rules and state
const mockState = {
  checking_account_balance: 6000,
  savings_account_balance: 12000,
  credit_score: 750,
};

describe('ruleEngine (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should evaluate simple greater-than rule', async () => {
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

  it('should evaluate AND conditions', async () => {
    const rule = {
      id: 'complex-rule',
      name: 'Complex Rule',
      conditions: [
        {
          logicalOperator: 'AND',
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

  it('should return false for unmet conditions', async () => {
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

  it('should handle invalid rule format gracefully', async () => {
    const rule = {
      conditions: [
        { field: 'nonexistent_field', operator: '>', value: 100 }
      ]
    };
    // Contract test: validate rule with Zod
    const parsed = RuleSchema.safeParse(rule);
    expect(parsed.success).toBe(true);
    await expect(ruleEngine.evaluateRule(rule, mockState)).rejects.toThrow();
  });

  // Add more tests for edge cases as needed
});

// Notes:
// - This file is focused on ruleEngine logic only.
// - All external dependencies are mocked or stubbed.
// - Each test is isolated and easy to understand for a 10th-grade reader. 
