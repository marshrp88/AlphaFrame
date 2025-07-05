import { vi } from 'vitest';

const TaxService = {
  calculateTaxLiability: vi.fn().mockResolvedValue({
    success: true,
    totalTax: 15000,
    effectiveTaxRate: 0.15,
    recommendations: ['Consider tax-loss harvesting']
  }),
  calculateDeductions: vi.fn().mockReturnValue(5000),
  calculateCredits: vi.fn().mockReturnValue(2000),
  optimizeTaxStrategy: vi.fn().mockResolvedValue({
    savings: 3000,
    strategy: 'Maximize 401k contributions'
  })
};

// Make all methods spyable
Object.keys(TaxService).forEach(key => {
  if (typeof TaxService[key] === 'function') {
    TaxService[key] = vi.fn(TaxService[key]);
  }
});

export default TaxService;
export { TaxService }; 