/**
 * Galileo V2.2 Services Test Suite
 * 
 * Purpose: Verifies that all Galileo V2.2 core services are properly implemented
 * and can be imported and instantiated without errors.
 * 
 * Procedure: Tests basic service instantiation and core functionality
 * 
 * Conclusion: Ensures the foundation services are ready for Sprint 2 integration
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Test basic service imports
describe('Galileo V2.2 Core Services', () => {
  
  it('should import TaxService without errors', async () => {
    const TaxService = await import('../TaxService.js');
    expect(TaxService.default).toBeDefined();
    
    const taxService = new TaxService.default();
    expect(taxService).toBeInstanceOf(TaxService.default);
    expect(taxService.federalTaxBrackets).toBeDefined();
    expect(taxService.federalTaxBrackets.length).toBeGreaterThan(0);
  });

  it('should import DebtService without errors', async () => {
    const DebtService = await import('../DebtService.js');
    expect(DebtService.default).toBeDefined();
    
    const debtService = new DebtService.default();
    expect(debtService).toBeInstanceOf(DebtService.default);
    expect(debtService.debtTypes).toBeDefined();
    expect(debtService.debtTypes.creditCard).toBeDefined();
  });

  it('should import RetirementService without errors', async () => {
    const RetirementService = await import('../RetirementService.js');
    expect(RetirementService.default).toBeDefined();
    
    const retirementService = new RetirementService.default();
    expect(retirementService).toBeInstanceOf(RetirementService.default);
    expect(retirementService.marketAssumptions).toBeDefined();
    expect(retirementService.retirementConstants).toBeDefined();
  });

  it('should import MonteCarloRunner without errors', async () => {
    const MonteCarloRunner = await import('../MonteCarloRunner.js');
    expect(MonteCarloRunner.default).toBeDefined();
    
    const monteCarlo = new MonteCarloRunner.default();
    expect(monteCarlo).toBeInstanceOf(MonteCarloRunner.default);
    expect(monteCarlo.config).toBeDefined();
    expect(monteCarlo.marketParams).toBeDefined();
  });

  it('should import ExplainabilityEngine without errors', async () => {
    const ExplainabilityEngine = await import('../ExplainabilityEngine.js');
    expect(ExplainabilityEngine.default).toBeDefined();
    
    const explainabilityEngine = new ExplainabilityEngine.default();
    expect(explainabilityEngine).toBeInstanceOf(ExplainabilityEngine.default);
    expect(explainabilityEngine.explanationTemplates).toBeDefined();
    expect(explainabilityEngine.educationalContent).toBeDefined();
  });

  it('should import InsightFeedSchema without errors', async () => {
    const InsightFeedSchema = await import('../InsightFeedSchema.js');
    expect(InsightFeedSchema.default).toBeDefined();
    
    const schemaManager = new InsightFeedSchema.default();
    expect(schemaManager).toBeInstanceOf(InsightFeedSchema.default);
    expect(schemaManager.schemas).toBeDefined();
    expect(schemaManager.schemaVersion).toBe('2.2.0');
  });
});

// Test basic functionality
describe('Galileo V2.2 Basic Functionality', () => {
  
  it('should calculate basic tax liability', async () => {
    const TaxService = await import('../TaxService.js');
    const taxService = new TaxService.default();
    
    const financialData = {
      income: 50000,
      filingStatus: 'single'
    };
    
    const result = await taxService.calculateTaxLiability(financialData);
    expect(result).toBeDefined();
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.recommendations).toBeDefined();
  });

  it('should analyze basic debt portfolio', async () => {
    const DebtService = await import('../DebtService.js');
    const debtService = new DebtService.default();
    
    const debtData = {
      debts: [
        { name: 'Test Card', balance: 1000, rate: 0.20, minimumPayment: 50 }
      ],
      totalDebt: 1000
    };
    
    const financialData = { monthlyPayment: 200 };
    
    const result = await debtService.analyzeDebtPortfolio(debtData, financialData);
    expect(result).toBeDefined();
    expect(result.portfolioMetrics).toBeDefined();
    expect(result.strategies).toBeDefined();
    expect(result.recommendations).toBeDefined();
  });

  it('should calculate retirement readiness', async () => {
    const RetirementService = await import('../RetirementService.js');
    const retirementService = new RetirementService.default();
    
    const retirementData = {
      currentAge: 30,
      targetRetirementAge: 65,
      currentSavings: 10000,
      monthlyContribution: 500,
      expectedSocialSecurity: 20000,
      targetIncome: 60000
    };
    
    const financialData = { income: 50000 };
    
    const result = await retirementService.calculateRetirementReadiness(retirementData, financialData);
    expect(result).toBeDefined();
    expect(result.deterministicForecast).toBeDefined();
    expect(result.readinessScore).toBeDefined();
    expect(result.recommendations).toBeDefined();
  });

  it('should run basic Monte Carlo simulation', async () => {
    const MonteCarloRunner = await import('../MonteCarloRunner.js');
    const monteCarlo = new MonteCarloRunner.default();
    
    const simulationConfig = {
      simulationCount: 10, // Small number for quick test
      timeHorizon: 5,
      assetAllocation: { stocks: 0.7, bonds: 0.3 },
      rebalancing: 'annual'
    };
    
    const financialData = {
      initialBalance: 10000,
      monthlyContribution: 500,
      timeHorizon: 5
    };
    
    const result = await monteCarlo.runSimulation(simulationConfig, financialData);
    expect(result).toBeDefined();
    expect(result.simulationResults).toBeDefined();
    expect(result.statisticalAnalysis).toBeDefined();
    expect(result.confidenceIntervals).toBeDefined();
  });

  it('should generate basic explanation', async () => {
    const ExplainabilityEngine = await import('../ExplainabilityEngine.js');
    const explainabilityEngine = new ExplainabilityEngine.default();
    
    const analysisData = {
      totalTax: 8000,
      effectiveTaxRate: 0.16,
      breakdown: {
        income: 50000,
        taxableIncome: 35000,
        marginalRate: 0.22,
        averageRate: 0.16
      },
      recommendations: [
        {
          title: 'Test Recommendation',
          description: 'Test description',
          priority: 'medium'
        }
      ]
    };
    
    const userContext = { age: 30, income: 50000 };
    
    const result = await explainabilityEngine.generateExplanation(analysisData, 'tax', userContext);
    expect(result).toBeDefined();
    expect(result.primary).toBeDefined();
    expect(result.stepByStep).toBeDefined();
    expect(result.educational).toBeDefined();
  });

  it('should validate insight data', async () => {
    const InsightFeedSchema = await import('../InsightFeedSchema.js');
    const schemaManager = new InsightFeedSchema.default();
    
    const insightData = {
      income: 50000,
      deductions: { standard: 14600, itemized: 0, total: 14600 },
      credits: { total: 0 },
      totalTax: 8000,
      breakdown: {
        income: 50000,
        taxableIncome: 35400,
        marginalRate: 0.22,
        averageRate: 0.16
      }
    };
    
    const result = await schemaManager.validateInsightData(insightData, 'tax');
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.type).toBe('tax');
    expect(result.version).toBe('2.2.0');
  });
}); 