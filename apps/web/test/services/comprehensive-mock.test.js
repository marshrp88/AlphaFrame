import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use the same approach as working tests - let __mocks__ handle the implementation
vi.mock('@/core/services/TaxService');
vi.mock('@/lib/services/RetirementService');
vi.mock('@/lib/services/AuthService', () => ({
  default: {
    isAuthenticated: vi.fn(() => true),
    getCurrentUser: vi.fn(() => ({ id: 1, email: 'test@example.com' }))
  }
}));

import TaxService from '@/core/services/TaxService';
import RetirementService from '@/lib/services/RetirementService';
import AuthService from '@/lib/services/AuthService';

describe('Comprehensive Mock System Validation', () => {
  let taxService;
  let retirementService;

  beforeEach(() => {
    vi.clearAllMocks();
    taxService = new TaxService();
    retirementService = new RetirementService();
  });

  it('should mock TaxService correctly', async () => {
    const result = await taxService.calculateTaxLiability({ income: 50000 });
    
    expect(taxService.calculateTaxLiability).toHaveBeenCalledWith({ income: 50000 });
    expect(result.totalTax).toBe(5000);
    expect(result.effectiveTaxRate).toBe(15);
  });

  it('should mock RetirementService correctly', async () => {
    const result = await retirementService.calculateRetirementReadiness({
      currentAge: 35,
      currentIncome: 75000
    });
    
    expect(retirementService.calculateRetirementReadiness).toHaveBeenCalledWith({
      currentAge: 35,
      currentIncome: 75000
    });
    expect(result.projectedSavings).toBe(2500000);
    expect(result.readinessScore).toBe(85);
  });

  it('should mock AuthService correctly', () => {
    const isAuth = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
    expect(AuthService.getCurrentUser).toHaveBeenCalled();
    expect(isAuth).toBe(true);
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });
}); 