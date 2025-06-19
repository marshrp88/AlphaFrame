import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateRule } from '@/lib/services/ruleEngine';
import { RuleSchema } from '@/lib/validation/schemas';

// Mock data for rules and state
const mockState = {
  checking_account_balance: 6000,
  savings_account_balance: 12000,
  credit_score: 750,
};

describe('ruleEngine (unit)', () => {
  it('should evaluate simple greater-than rule', async () => {
    const rule = {
      conditions: [
        { field: 'checking_account_balance', operator: '>', value: 5000 }
      ]
    };
    // Contract test: validate rule with Zod
    const parsed = RuleSchema.safeParse(rule);
    expect(parsed.success).toBe(true);
    expect(await evaluateRule(rule, mockState)).toBe(true);
  });

  it('should evaluate AND conditions', async () => {
    const rule = {
      conditions: [
        { field: 'checking_account_balance', operator: '>', value: 5000 },
        { field: 'savings_account_balance', operator: '>', value: 10000 },
        { field: 'credit_score', operator: '>', value: 700 }
      ]
    };
    // Contract test: validate rule with Zod
    const parsed = RuleSchema.safeParse(rule);
    expect(parsed.success).toBe(true);
    expect(await evaluateRule(rule, mockState)).toBe(true);
  });

  it('should return false for unmet conditions', async () => {
    const rule = {
      conditions: [
        { field: 'checking_account_balance', operator: '>', value: 10000 }
      ]
    };
    // Contract test: validate rule with Zod
    const parsed = RuleSchema.safeParse(rule);
    expect(parsed.success).toBe(true);
    expect(await evaluateRule(rule, mockState)).toBe(false);
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
    await expect(evaluateRule(rule, mockState)).rejects.toThrow();
  });

  // Add more tests for edge cases as needed
});

// Notes:
// - This file is focused on ruleEngine logic only.
// - All external dependencies are mocked or stubbed.
// - Each test is isolated and easy to understand for a 10th-grade reader. 
