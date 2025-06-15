import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateRule, executeRule, validateRule, getMatchingRules } from '../../../src/lib/services/ruleEngine';

describe('RuleEngine Integration', () => {
  let mockRule;
  let mockTransaction;

  beforeEach(() => {
    mockRule = {
      id: 'rule1',
      name: 'High Amount Alert',
      condition: {
        type: 'amount',
        operator: '>',
        value: 1000
      },
      action: {
        type: 'alert',
        message: 'High amount transaction detected'
      }
    };

    mockTransaction = {
      id: 'tx1',
      amount: 1500,
      description: 'Large Purchase',
      date: new Date().toISOString()
    };
  });

  it('should evaluate rule conditions correctly', async () => {
    const result = await evaluateRule(mockRule, mockTransaction);
    expect(result).toBe(true);
  });

  it('should execute rule actions', async () => {
    await expect(executeRule(mockRule, mockTransaction)).resolves.not.toThrow();
  });

  it('should validate rule structure', async () => {
    const isValid = await validateRule(mockRule);
    expect(isValid).toBe(true);
  });

  it('should find matching rules for a transaction', async () => {
    const matchingRules = await getMatchingRules(mockTransaction);
    expect(Array.isArray(matchingRules)).toBe(true);
    expect(matchingRules.length).toBeGreaterThan(0);
    expect(matchingRules[0]).toHaveProperty('id');
  });

  it('should handle invalid rule structures', async () => {
    const invalidRule = { ...mockRule, condition: null };
    await expect(validateRule(invalidRule)).resolves.toBe(false);
  });

  it('should handle rule execution errors', async () => {
    const invalidTransaction = { ...mockTransaction, amount: 'invalid' };
    await expect(evaluateRule(mockRule, invalidTransaction)).rejects.toThrow();
  });
}); 