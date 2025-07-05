import { describe, it, expect } from 'vitest';
import TaxService from '../TaxService.js';

describe('TaxService', () => {
  it('should calculate valid tax liability and explanation', async () => {
    const taxService = new TaxService();
    const financialData = {
      income: 50000,
      deductions: [{ name: 'Standard Deduction', amount: 12950 }],
      filingStatus: 'single'
    };
    const result = await taxService.calculateTaxLiability(financialData);
    expect(result).toBeDefined();
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
}); 