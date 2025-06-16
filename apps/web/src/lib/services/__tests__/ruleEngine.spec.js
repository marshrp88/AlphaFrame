import { describe, it, expect } from 'vitest';
import { RuleEngine } from '../ruleEngine';

describe('Rule Engine', () => {
  it('should initialize with empty rules', () => {
    const engine = new RuleEngine();
    expect(engine.getRules()).toEqual([]);
  });

  it('should add and evaluate rules correctly', () => {
    const engine = new RuleEngine();
    const rule = {
      condition: (data) => data.value > 10,
      action: (data) => ({ ...data, processed: true })
    };
    
    engine.addRule(rule);
    const result = engine.evaluate({ value: 15 });
    expect(result.processed).toBe(true);
  });
}); 