/**
 * PortfolioAnalyzer.test.js
 * 
 * Purpose: Comprehensive unit tests for the PortfolioAnalyzer service to ensure
 * all portfolio analysis functionality works correctly including allocation
 * calculations, diversification scoring, and recommendation generation.
 * 
 * Procedure:
 * 1. Test portfolio analysis with various holdings configurations
 * 2. Test allocation percentage calculations
 * 3. Test deviation calculations from targets
 * 4. Test diversification scoring algorithms
 * 5. Test recommendation generation logic
 * 6. Test validation and error handling
 * 
 * Conclusion: These tests validate that the PortfolioAnalyzer properly
 * analyzes portfolios, calculates metrics, and generates actionable insights.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the module at the top level
vi.mock('../../../core/services/ExecutionLogService.js');

// Import after mocks are set up
import { PortfolioAnalyzer } from '../services/PortfolioAnalyzer.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Set up the mock implementation after import
const mockLog = vi.fn().mockResolvedValue({ id: 'test-log-id' });
const mockLogError = vi.fn().mockResolvedValue({ id: 'test-error-id' });

// Mock the default export
executionLogService.log = mockLog;
executionLogService.logError = mockLogError;
executionLogService.logPortfolioAnalysis = vi.fn().mockResolvedValue({ id: 'test-portfolio-log-id' });
executionLogService.logSimulationRun = vi.fn().mockResolvedValue({ id: 'test-simulation-log-id' });
executionLogService.logBudgetForecast = vi.fn().mockResolvedValue({ id: 'test-budget-log-id' });
executionLogService.logRuleTriggered = vi.fn().mockResolvedValue({ id: 'test-rule-log-id' });
executionLogService.queryLogs = vi.fn().mockResolvedValue([]);
executionLogService.getSessionLogs = vi.fn().mockResolvedValue([]);
executionLogService.getComponentLogs = vi.fn().mockResolvedValue([]);
executionLogService.getPerformanceLogs = vi.fn().mockResolvedValue([]);
executionLogService.clearOldLogs = vi.fn().mockResolvedValue(0);
executionLogService.exportLogs = vi.fn().mockResolvedValue({ logs: [] });
executionLogService.decryptPayload = vi.fn().mockResolvedValue({});
executionLogService.generateId = vi.fn(() => 'test-id');
executionLogService.generateSessionId = vi.fn(() => 'test-session');
executionLogService.getUserId = vi.fn(() => 'test-user');
executionLogService.initDatabase = vi.fn().mockResolvedValue();
executionLogService.initEncryption = vi.fn().mockResolvedValue();
executionLogService.encryptPayload = vi.fn().mockResolvedValue('encrypted-data');
executionLogService.storeLog = vi.fn().mockResolvedValue();

describe('PortfolioAnalyzer', () => {
  let portfolioAnalyzer;

  beforeEach(() => {
    portfolioAnalyzer = new PortfolioAnalyzer();
    
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Re-setup the mock functions with default resolved values
    executionLogService.log.mockResolvedValue({ id: 'test-log-id' });
    executionLogService.logError.mockResolvedValue({ id: 'test-error-id' });
    executionLogService.logPortfolioAnalysis.mockResolvedValue({ id: 'test-portfolio-log-id' });
    executionLogService.logSimulationRun.mockResolvedValue({ id: 'test-simulation-log-id' });
    executionLogService.logBudgetForecast.mockResolvedValue({ id: 'test-budget-log-id' });
    executionLogService.logRuleTriggered.mockResolvedValue({ id: 'test-rule-log-id' });
    executionLogService.queryLogs.mockResolvedValue([]);
    executionLogService.getSessionLogs.mockResolvedValue([]);
    executionLogService.getComponentLogs.mockResolvedValue([]);
    executionLogService.getPerformanceLogs.mockResolvedValue([]);
    executionLogService.clearOldLogs.mockResolvedValue(0);
    executionLogService.exportLogs.mockResolvedValue({ logs: [] });
    executionLogService.decryptPayload.mockResolvedValue({});
    executionLogService.generateId.mockReturnValue('test-id');
    executionLogService.generateSessionId.mockReturnValue('test-session');
    executionLogService.getUserId.mockReturnValue('test-user');
    executionLogService.initDatabase.mockResolvedValue();
    executionLogService.initEncryption.mockResolvedValue();
    executionLogService.encryptPayload.mockResolvedValue('encrypted-data');
    executionLogService.storeLog.mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(portfolioAnalyzer.assetClassifications).toBeDefined();
      expect(portfolioAnalyzer.defaultTargets).toBeDefined();
      expect(typeof portfolioAnalyzer.assetClassifications).toBe('object');
      expect(typeof portfolioAnalyzer.defaultTargets).toBe('object');
    });

    it('should have supported assets', () => {
      const assets = portfolioAnalyzer.getSupportedAssets();
      expect(assets).toBeDefined();
      expect(assets.AAPL).toBeDefined();
      expect(assets.BND).toBeDefined();
      expect(assets.AAPL.type).toBe('stock');
      expect(assets.BND.type).toBe('bond');
    });

    it('should have default targets', () => {
      const targets = portfolioAnalyzer.getDefaultTargets();
      expect(targets).toBeDefined();
      expect(targets.equity).toBe(60);
      expect(targets.bonds).toBe(30);
      expect(targets.cash).toBe(5);
    });
  });

  describe('Portfolio Analysis', () => {
    it('should analyze a simple portfolio correctly', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150, costBasis: 140 },
        { ticker: 'BND', quantity: 50, currentPrice: 80, costBasis: 80 }
      ];

      const analysis = await portfolioAnalyzer.analyzePortfolio(holdings);

      expect(analysis.totalValue).toBe(19000); // 100*150 + 50*80
      expect(analysis.currentAllocation.equity).toBeCloseTo(78.95, 1); // 15000/19000 * 100
      expect(analysis.currentAllocation.bonds).toBeCloseTo(21.05, 1); // 4000/19000 * 100
      expect(analysis.deviations.equity).toBeCloseTo(18.95, 1); // 78.95 - 60
      expect(analysis.deviations.bonds).toBeCloseTo(-8.95, 1); // 21.05 - 30
      expect(analysis.timestamp).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
    });

    it('should handle empty portfolio', async () => {
      const holdings = [];
      await expect(portfolioAnalyzer.analyzePortfolio(holdings)).rejects.toThrow('Portfolio has no value to analyze');
    });

    it('should handle custom targets', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 }
      ];
      const customTargets = { equity: 50, bonds: 50 };

      const analysis = await portfolioAnalyzer.analyzePortfolio(holdings, customTargets);

      expect(analysis.targetAllocation).toEqual(customTargets);
      expect(analysis.deviations.equity).toBeCloseTo(28.95, 1); // 78.95 - 50
      expect(analysis.deviations.bonds).toBeCloseTo(-28.95, 1); // 21.05 - 50
    });

    it('should calculate sector allocations correctly', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }, // $15,000
        { ticker: 'MSFT', quantity: 50, currentPrice: 300 }   // $15,000
      ];
      const analysis = await portfolioAnalyzer.analyzePortfolio(holdings);

      // Both AAPL and MSFT are technology sector, so 100% tech
      expect(analysis.currentAllocation.bySector.technology).toBeCloseTo(100, 1);
    });

    it('should handle unknown tickers gracefully', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }, // $15,000
        { ticker: 'UNKNOWN', quantity: 50, currentPrice: 100 } // $5,000
      ];
      const analysis = await portfolioAnalyzer.analyzePortfolio(holdings);

      expect(analysis.currentAllocation.equity).toBeCloseTo(75, 1); // 15000/20000 * 100
      expect(analysis.currentAllocation.unknown).toBeCloseTo(25, 1); // 5000/20000 * 100
    });

    it('should log portfolio analysis', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 }
      ];

      await portfolioAnalyzer.analyzePortfolio(holdings);

      expect(executionLogService.logPortfolioAnalysis).toHaveBeenCalledWith(
        expect.stringMatching(/^portfolio-/), // portfolioId
        expect.any(Number), // durationMs
        {
          totalValue: 19000,
          holdingsCount: 2,
          deviations: expect.any(Array),
          diversificationScore: expect.any(Number)
        }
      );
    });

    it('should handle analysis errors and log them', async () => {
      // Mock logPortfolioAnalysis to throw an error
      executionLogService.logPortfolioAnalysis.mockRejectedValue(new Error('Logging failed'));
      
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }
      ];

      await expect(portfolioAnalyzer.analyzePortfolio(holdings)).rejects.toThrow('Logging failed');
      expect(executionLogService.logError).toHaveBeenCalledWith(
        expect.any(Error), // error
        'PortfolioAnalyzer', // component
        'analyzePortfolio', // action
        { holdings, targets: portfolioAnalyzer.defaultTargets } // meta
      );
    });
  });

  describe('Allocation Calculations', () => {
    it('should calculate current allocation correctly', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 },
        { ticker: 'CASH', quantity: 1, currentPrice: 1000 }
      ];

      const allocation = portfolioAnalyzer.calculateCurrentAllocation(holdings);

      expect(allocation.equity).toBe(15000);
      expect(allocation.bonds).toBe(4000);
      expect(allocation.cash).toBe(1000);
      expect(allocation.totalValue).toBe(20000);
      expect(allocation.byTicker.AAPL).toBe(15000);
      expect(allocation.byTicker.BND).toBe(4000);
      expect(allocation.byTicker.CASH).toBe(1000);
      expect(allocation.bySector.technology).toBe(15000);
      expect(allocation.bySector.fixed_income).toBe(4000);
      expect(allocation.bySector.cash_equivalents).toBe(1000);
    });

    it('should calculate allocation percentages correctly', () => {
      const allocation = {
        equity: 15000,
        bonds: 4000,
        cash: 1000,
        totalValue: 20000,
        bySector: {
          technology: 15000,
          fixed_income: 4000,
          cash_equivalents: 1000
        }
      };

      const percentages = portfolioAnalyzer.calculateAllocationPercentages(allocation, 20000);

      expect(percentages.equity).toBe(75);
      expect(percentages.bonds).toBe(20);
      expect(percentages.cash).toBe(5);
      expect(percentages.bySector.technology).toBe(75);
      expect(percentages.bySector.fixed_income).toBe(20);
      expect(percentages.bySector.cash_equivalents).toBe(5);
    });

    it('should handle zero total value', () => {
      const allocation = {
        equity: 0,
        bonds: 0,
        totalValue: 0,
        bySector: {}
      };

      const percentages = portfolioAnalyzer.calculateAllocationPercentages(allocation, 0);

      expect(percentages.equity).toBe(0);
      expect(percentages.bonds).toBe(0);
      expect(percentages.bySector).toEqual({});
    });

    it('should handle missing bySector property', () => {
      const allocation = {
        equity: 15000,
        bonds: 5000,
        totalValue: 20000
      };

      const percentages = portfolioAnalyzer.calculateAllocationPercentages(allocation, 20000);

      expect(percentages.equity).toBe(75);
      expect(percentages.bonds).toBe(25);
      expect(percentages.bySector).toEqual({});
    });
  });

  describe('Deviation Calculations', () => {
    it('should calculate deviations correctly', () => {
      const current = { equity: 75, bonds: 20, cash: 5 };
      const targets = { equity: 60, bonds: 30, cash: 10 };

      const deviations = portfolioAnalyzer.calculateDeviations(current, targets);

      expect(deviations.equity).toBe(15); // 75 - 60
      expect(deviations.bonds).toBe(-10); // 20 - 30
      expect(deviations.cash).toBe(-5); // 5 - 10
    });

    it('should handle missing asset classes', () => {
      const current = { equity: 100 };
      const targets = { equity: 60, bonds: 40 };

      const deviations = portfolioAnalyzer.calculateDeviations(current, targets);

      expect(deviations.equity).toBe(40);
      expect(deviations.bonds).toBe(-40); // 0 - 40
    });

    it('should handle zero targets', () => {
      const current = { equity: 50, bonds: 50 };
      const targets = { equity: 0, bonds: 0 };

      const deviations = portfolioAnalyzer.calculateDeviations(current, targets);

      expect(deviations.equity).toBe(50);
      expect(deviations.bonds).toBe(50);
    });
  });

  describe('Diversification Scoring', () => {
    it('should calculate diversification scores correctly', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'MSFT', quantity: 50, currentPrice: 300 },
        { ticker: 'BND', quantity: 100, currentPrice: 80 }
      ];

      const allocation = {
        equity: 75,
        bonds: 25,
        bySector: {
          technology: 75,
          fixed_income: 25
        }
      };

      const scores = portfolioAnalyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(2);
      expect(scores.assetClassCount).toBe(2);
      expect(scores.overall).toBeGreaterThan(0);
      expect(scores.overall).toBeLessThanOrEqual(100);
      expect(scores.sectorScore).toBeGreaterThanOrEqual(0); // Can be 0 for high concentration
      expect(scores.assetClassScore).toBe(40); // 2 * 20
    });

    it('should handle concentrated portfolios', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'MSFT', quantity: 50, currentPrice: 300 }
      ];

      const allocation = {
        equity: 100,
        bySector: {
          technology: 100
        }
      };

      const scores = portfolioAnalyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(1);
      expect(scores.assetClassCount).toBe(1);
      expect(scores.overall).toBeLessThan(50); // Should be low for concentrated portfolio
      expect(scores.assetClassScore).toBe(20); // 1 * 20
    });

    it('should handle portfolios with unknown tickers', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'UNKNOWN', quantity: 50, currentPrice: 100 }
      ];

      const allocation = {
        equity: 60,
        unknown: 40,
        bySector: {
          technology: 60
        }
      };

      const scores = portfolioAnalyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(1); // Only known ticker contributes to sector count
      expect(scores.assetClassCount).toBe(1); // Only equity, unknown doesn't count
    });

    it('should handle empty holdings', () => {
      const holdings = [];
      const allocation = {
        equity: 0,
        bySector: {}
      };

      const scores = portfolioAnalyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(0);
      expect(scores.assetClassCount).toBe(0);
      expect(scores.overall).toBe(50); // (0 + 100) / 2 = 50 for empty holdings
    });
  });

  describe('Recommendation Generation', () => {
    it('should generate rebalancing recommendations for significant deviations', () => {
      const deviations = {
        equity: 15, // Over-allocated
        bonds: -10, // Under-allocated
        cash: -2    // Minor deviation
      };
      const diversificationScores = {
        overall: 70,
        sectorCount: 4
      };

      const recommendations = portfolioAnalyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations).toHaveLength(2); // Only equity and bonds exceed 5%
      expect(recommendations[0].type).toBe('rebalancing');
      expect(recommendations[0].priority).toBe('high'); // 15% > 10%
      expect(recommendations[1].priority).toBe('medium'); // 10% = 10%
    });

    it('should generate diversification recommendations for low scores', () => {
      const deviations = { equity: 0, bonds: 0 };
      const diversificationScores = {
        overall: 30, // Low score
        sectorCount: 2 // Few sectors
      };

      const recommendations = portfolioAnalyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations).toHaveLength(2);
      expect(recommendations[0].type).toBe('diversification');
      expect(recommendations[0].priority).toBe('high');
      expect(recommendations[1].type).toBe('diversification');
      expect(recommendations[1].priority).toBe('medium');
    });

    it('should handle no significant deviations', () => {
      const deviations = {
        equity: 2, // Minor deviation
        bonds: -1  // Minor deviation
      };
      const diversificationScores = {
        overall: 80,
        sectorCount: 5
      };

      const recommendations = portfolioAnalyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations).toHaveLength(0); // No significant issues
    });

    it('should handle edge case deviations', () => {
      const deviations = {
        equity: 5.1, // Just over 5%
        bonds: -5.1  // Just over 5%
      };
      const diversificationScores = {
        overall: 50,
        sectorCount: 3
      };

      const recommendations = portfolioAnalyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations).toHaveLength(2);
      expect(recommendations[0].priority).toBe('medium'); // 5.1% < 10%
      expect(recommendations[1].priority).toBe('medium');
    });
  });

  describe('Validation', () => {
    it('should validate valid holdings', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 }
      ];

      const validation = portfolioAnalyzer.validateHoldings(holdings);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100 }, // Missing currentPrice
        { ticker: 'BND', currentPrice: 80 } // Missing quantity
      ];

      const validation = portfolioAnalyzer.validateHoldings(holdings);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(2);
      expect(validation.errors[0]).toContain('Missing required fields');
    });

    it('should detect negative values', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: -100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: -80 }
      ];

      const validation = portfolioAnalyzer.validateHoldings(holdings);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(2);
      expect(validation.errors[0]).toContain('must be positive');
    });

    it('should warn about unsupported tickers', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'UNSUPPORTED', quantity: 50, currentPrice: 100 }
      ];

      const validation = portfolioAnalyzer.validateHoldings(holdings);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(1);
      expect(validation.warnings[0]).toContain('UNSUPPORTED');
    });

    it('should handle empty holdings array', () => {
      const holdings = [];

      const validation = portfolioAnalyzer.validateHoldings(holdings);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle holdings with zero values', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 0, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 0 }
      ];

      const allocation = portfolioAnalyzer.calculateCurrentAllocation(holdings);

      expect(allocation.totalValue).toBe(0);
      expect(allocation.equity).toBe(0);
      expect(allocation.bonds).toBe(0);
    });

    it('should handle very large numbers', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 1000000, currentPrice: 1000000 }
      ];

      const allocation = portfolioAnalyzer.calculateCurrentAllocation(holdings);

      expect(allocation.totalValue).toBe(1000000000000);
      expect(allocation.equity).toBe(1000000000000);
    });

    it('should handle decimal quantities and prices', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100.5, currentPrice: 150.75 }
      ];

      const allocation = portfolioAnalyzer.calculateCurrentAllocation(holdings);

      expect(allocation.totalValue).toBe(15150.375); // 100.5 * 150.75
      expect(allocation.equity).toBe(15150.375);
    });

    it('should handle missing asset classifications gracefully', () => {
      const holdings = [
        { ticker: 'UNKNOWN_TICKER', quantity: 100, currentPrice: 100 }
      ];

      const allocation = portfolioAnalyzer.calculateCurrentAllocation(holdings);

      expect(allocation.unknown).toBe(10000);
      expect(allocation.totalValue).toBe(10000);
    });
  });
}); 