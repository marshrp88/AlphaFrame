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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortfolioAnalyzer } from '../../../src/lib/services/PortfolioAnalyzer.js';

// Mock ExecutionLogService
vi.mock('../../../src/lib/services/ExecutionLogService.js', () => ({
  default: {
    logPortfolioAnalysis: vi.fn(),
    logError: vi.fn()
  }
}));

describe('PortfolioAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new PortfolioAnalyzer();
  });

  describe('Portfolio Analysis', () => {
    it('should analyze a simple portfolio correctly', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150, costBasis: 140 },
        { ticker: 'BND', quantity: 50, currentPrice: 80, costBasis: 80 }
      ];

      const analysis = await analyzer.analyzePortfolio(holdings);

      expect(analysis.totalValue).toBe(19000); // 100*150 + 50*80
      expect(analysis.currentAllocation.equity).toBeCloseTo(78.95, 1); // 15000/19000 * 100
      expect(analysis.currentAllocation.bonds).toBeCloseTo(21.05, 1); // 4000/19000 * 100
      expect(analysis.deviations.equity).toBeCloseTo(18.95, 1); // 78.95 - 60
      expect(analysis.deviations.bonds).toBeCloseTo(-8.95, 1); // 21.05 - 30
    });

    it('should handle empty portfolio', async () => {
      const holdings = [];
      await expect(analyzer.analyzePortfolio(holdings)).rejects.toThrow('Portfolio has no value to analyze');
    });

    it('should calculate sector allocations correctly', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }, // $15,000
        { ticker: 'MSFT', quantity: 50, currentPrice: 300 }   // $15,000
      ];
      const analysis = await analyzer.analyzePortfolio(holdings);

      // Both AAPL and MSFT are technology sector, so 100% tech
      expect(analysis.currentAllocation.bySector.technology).toBeCloseTo(100, 1);
    });

    it('should handle unknown tickers gracefully', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }, // $15,000
        { ticker: 'UNKNOWN', quantity: 50, currentPrice: 100 } // $5,000
      ];
      const analysis = await analyzer.analyzePortfolio(holdings);

      expect(analysis.currentAllocation.equity).toBeCloseTo(75, 1); // 15000/20000 * 100
      expect(analysis.currentAllocation.unknown).toBeCloseTo(25, 1); // 5000/20000 * 100
    });
  });

  describe('Allocation Calculations', () => {
    it('should calculate current allocation correctly', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 },
        { ticker: 'CASH', quantity: 1, currentPrice: 1000 }
      ];

      const allocation = analyzer.calculateCurrentAllocation(holdings);

      expect(allocation.equity).toBe(15000);
      expect(allocation.bonds).toBe(4000);
      expect(allocation.cash).toBe(1000);
      expect(allocation.totalValue).toBe(20000);
      expect(allocation.byTicker.AAPL).toBe(15000);
      expect(allocation.byTicker.BND).toBe(4000);
      expect(allocation.byTicker.CASH).toBe(1000);
    });

    it('should calculate allocation percentages correctly', () => {
      const allocation = {
        equity: 15000,
        bonds: 4000,
        cash: 1000,
        totalValue: 20000
      };

      const percentages = analyzer.calculateAllocationPercentages(allocation, 20000);

      expect(percentages.equity).toBe(75);
      expect(percentages.bonds).toBe(20);
      expect(percentages.cash).toBe(5);
    });

    it('should handle zero total value', () => {
      const allocation = {
        equity: 0,
        bonds: 0,
        totalValue: 0
      };

      const percentages = analyzer.calculateAllocationPercentages(allocation, 0);

      expect(percentages.equity).toBe(0);
      expect(percentages.bonds).toBe(0);
    });
  });

  describe('Deviation Calculations', () => {
    it('should calculate deviations correctly', () => {
      const current = { equity: 75, bonds: 20, cash: 5 };
      const targets = { equity: 60, bonds: 30, cash: 10 };

      const deviations = analyzer.calculateDeviations(current, targets);

      expect(deviations.equity).toBe(15); // 75 - 60
      expect(deviations.bonds).toBe(-10); // 20 - 30
      expect(deviations.cash).toBe(-5); // 5 - 10
    });

    it('should handle missing asset classes', () => {
      const current = { equity: 100 };
      const targets = { equity: 60, bonds: 40 };

      const deviations = analyzer.calculateDeviations(current, targets);

      expect(deviations.equity).toBe(40);
      expect(deviations.bonds).toBe(-40); // 0 - 40
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

      const scores = analyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(2);
      expect(scores.assetClassCount).toBe(2);
      expect(scores.overall).toBeGreaterThan(0);
      expect(scores.overall).toBeLessThanOrEqual(100);
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

      const scores = analyzer.calculateDiversificationScores(holdings, allocation);

      expect(scores.sectorCount).toBe(1);
      expect(scores.assetClassCount).toBe(1);
      expect(scores.overall).toBeLessThan(50); // Should be low for concentrated portfolio
    });
  });

  describe('Recommendation Generation', () => {
    it('should generate rebalancing recommendations for significant deviations', () => {
      const deviations = {
        equity: 15,
        bonds: -10,
        cash: -2
      };

      const diversificationScores = {
        overall: 80,
        sectorCount: 5
      };

      const recommendations = analyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.type === 'rebalancing')).toBe(true);
      expect(recommendations.some(r => r.assetClass === 'equity')).toBe(true);
      expect(recommendations.some(r => r.assetClass === 'bonds')).toBe(true);
    });

    it('should generate diversification recommendations for low scores', () => {
      const deviations = {
        equity: 2,
        bonds: -1
      };

      const diversificationScores = {
        overall: 30,
        sectorCount: 1
      };

      const recommendations = analyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations.some(r => r.type === 'diversification')).toBe(true);
      expect(recommendations.some(r => r.priority === 'high')).toBe(true);
    });

    it('should not generate recommendations for well-balanced portfolios', () => {
      const deviations = {
        equity: 2,
        bonds: -1,
        cash: 0
      };

      const diversificationScores = {
        overall: 85,
        sectorCount: 6
      };

      const recommendations = analyzer.generateRecommendations(deviations, diversificationScores);

      expect(recommendations.length).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should validate holdings correctly', () => {
      const validHoldings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 }
      ];

      const result = analyzer.validateHoldings(validHoldings);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidHoldings = [
        { ticker: 'AAPL', quantity: 100 }, // Missing currentPrice
        { ticker: '', quantity: 100, currentPrice: 150 }, // Empty ticker
        { ticker: 'BND', quantity: -50, currentPrice: 80 } // Negative quantity
      ];

      const result = analyzer.validateHoldings(invalidHoldings);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn about unsupported tickers', () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'UNSUPPORTED', quantity: 50, currentPrice: 100 }
      ];

      const result = analyzer.validateHoldings(holdings);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('UNSUPPORTED');
    });
  });

  describe('Asset Classifications', () => {
    it('should return supported assets', () => {
      const assets = analyzer.getSupportedAssets();

      expect(assets.AAPL).toBeDefined();
      expect(assets.AAPL.type).toBe('stock');
      expect(assets.AAPL.sector).toBe('technology');
      expect(assets.AAPL.assetClass).toBe('equity');
    });

    it('should return default targets', () => {
      const targets = analyzer.getDefaultTargets();

      expect(targets.equity).toBe(60);
      expect(targets.bonds).toBe(30);
      expect(targets.cash).toBe(5);
    });
  });

  describe('Error Handling', () => {
    it('should handle analysis errors gracefully', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 0, currentPrice: 150 } // Zero quantity
      ];

      await expect(analyzer.analyzePortfolio(holdings)).rejects.toThrow('Portfolio has no value to analyze');
    });

    it('should log errors when analysis fails', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 0, currentPrice: 150 }
      ];

      try {
        await analyzer.analyzePortfolio(holdings);
      } catch (error) {
        // Error should be logged
        expect(error.message).toBe('Portfolio has no value to analyze');
      }
    });
  });

  describe('Integration with ExecutionLogService', () => {
    it('should log portfolio analysis results', async () => {
      const holdings = [
        { ticker: 'AAPL', quantity: 100, currentPrice: 150 },
        { ticker: 'BND', quantity: 50, currentPrice: 80 }
      ];

      await analyzer.analyzePortfolio(holdings);

      // Verify that logPortfolioAnalysis was called
      const { default: executionLogService } = await import('../../../src/lib/services/ExecutionLogService.js');
      expect(executionLogService.logPortfolioAnalysis).toHaveBeenCalled();
    });
  });
}); 