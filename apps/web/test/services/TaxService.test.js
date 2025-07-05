import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the TaxService mock
vi.mock('@/core/services/TaxService');

import TaxService from '@/core/services/TaxService';

describe('TaxService Mock Validation', () => {
  let taxService;

  beforeEach(() => {
    vi.clearAllMocks();
    taxService = new TaxService();
  });

  it('should use mocked TaxService instead of real implementation', async () => {
    const result = await taxService.calculateTaxLiability({ income: 50000 });
    
    expect(taxService.calculateTaxLiability).toHaveBeenCalledWith({ income: 50000 });
    expect(result.totalTax).toBe(5000);
    expect(result.effectiveTaxRate).toBe(15);
    expect(result.breakdown.federalTax).toBe(4000);
  });

  it('should mock individual calculation methods', () => {
    const federalTax = taxService.calculateFederalTax({ income: 50000 });
    const stateTax = taxService.calculateStateTax({ income: 50000 });
    
    expect(taxService.calculateFederalTax).toHaveBeenCalledWith({ income: 50000 });
    expect(taxService.calculateStateTax).toHaveBeenCalledWith({ income: 50000 });
    expect(federalTax).toBe(4000);
    expect(stateTax).toBe(1000);
  });
}); 