/**
 * PortfolioAnalyzer.js
 * 
 * Purpose: Analyzes portfolio allocations, calculates diversification scores,
 * and tracks deviation from user-defined targets for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Accepts portfolio data (ticker, quantity, cost basis)
 * 2. Calculates current allocation percentages
 * 3. Compares against user targets (e.g., 60/40 stocks/bonds)
 * 4. Generates diversification scores by sector and asset class
 * 5. Logs analysis results via ExecutionLogService
 * 
 * Conclusion: Provides comprehensive portfolio insights and rebalancing
 * recommendations while maintaining zero-knowledge compliance.
 */

import executionLogService from './ExecutionLogService.js';

// Asset classification data (simplified for MVP)
const ASSET_CLASSIFICATIONS = {
  // Stocks
  'AAPL': { type: 'stock', sector: 'technology', assetClass: 'equity' },
  'MSFT': { type: 'stock', sector: 'technology', assetClass: 'equity' },
  'GOOGL': { type: 'stock', sector: 'technology', assetClass: 'equity' },
  'AMZN': { type: 'stock', sector: 'consumer_discretionary', assetClass: 'equity' },
  'TSLA': { type: 'stock', sector: 'consumer_discretionary', assetClass: 'equity' },
  'NVDA': { type: 'stock', sector: 'technology', assetClass: 'equity' },
  'META': { type: 'stock', sector: 'technology', assetClass: 'equity' },
  'NFLX': { type: 'stock', sector: 'communication_services', assetClass: 'equity' },
  'JPM': { type: 'stock', sector: 'financials', assetClass: 'equity' },
  'JNJ': { type: 'stock', sector: 'healthcare', assetClass: 'equity' },
  'PG': { type: 'stock', sector: 'consumer_staples', assetClass: 'equity' },
  'V': { type: 'stock', sector: 'financials', assetClass: 'equity' },
  'WMT': { type: 'stock', sector: 'consumer_staples', assetClass: 'equity' },
  'UNH': { type: 'stock', sector: 'healthcare', assetClass: 'equity' },
  'HD': { type: 'stock', sector: 'consumer_discretionary', assetClass: 'equity' },
  
  // Bonds
  'BND': { type: 'bond', sector: 'fixed_income', assetClass: 'bonds' },
  'AGG': { type: 'bond', sector: 'fixed_income', assetClass: 'bonds' },
  'TLT': { type: 'bond', sector: 'fixed_income', assetClass: 'bonds' },
  'IEF': { type: 'bond', sector: 'fixed_income', assetClass: 'bonds' },
  'SHY': { type: 'bond', sector: 'fixed_income', assetClass: 'bonds' },
  
  // Cash equivalents
  'CASH': { type: 'cash', sector: 'cash_equivalents', assetClass: 'cash' },
  'MONEY_MARKET': { type: 'cash', sector: 'cash_equivalents', assetClass: 'cash' },
  
  // International
  'VXUS': { type: 'stock', sector: 'international', assetClass: 'international' },
  'EFA': { type: 'stock', sector: 'international', assetClass: 'international' },
  'EEM': { type: 'stock', sector: 'international', assetClass: 'international' },
  
  // Real Estate
  'VNQ': { type: 'reit', sector: 'real_estate', assetClass: 'real_estate' },
  'IYR': { type: 'reit', sector: 'real_estate', assetClass: 'real_estate' },
  
  // Commodities
  'GLD': { type: 'commodity', sector: 'commodities', assetClass: 'commodities' },
  'SLV': { type: 'commodity', sector: 'commodities', assetClass: 'commodities' },
  'USO': { type: 'commodity', sector: 'commodities', assetClass: 'commodities' }
};

// Default target allocations
const DEFAULT_TARGETS = {
  equity: 60,
  bonds: 30,
  cash: 5,
  international: 3,
  real_estate: 1,
  commodities: 1
};

class PortfolioAnalyzer {
  constructor() {
    this.assetClassifications = ASSET_CLASSIFICATIONS;
    this.defaultTargets = DEFAULT_TARGETS;
  }

  /**
   * Analyze a portfolio and return comprehensive insights
   * @param {Array} holdings - Array of portfolio holdings
   * @param {Object} targets - Target allocation percentages
   * @returns {Object} Analysis results
   */
  async analyzePortfolio(holdings = [], targets = this.defaultTargets) {
    try {
      // Calculate current values and allocations
      const currentAllocation = this.calculateCurrentAllocation(holdings);
      const totalValue = currentAllocation.totalValue;
      
      if (totalValue === 0) {
        throw new Error('Portfolio has no value to analyze');
      }

      // Calculate allocation percentages
      const allocationPercentages = this.calculateAllocationPercentages(currentAllocation, totalValue);
      
      // Calculate deviation from targets
      const deviations = this.calculateDeviations(allocationPercentages, targets);
      
      // Calculate diversification scores
      const diversificationScores = this.calculateDiversificationScores(holdings, allocationPercentages);
      
      // Generate analysis results
      const analysis = {
        totalValue,
        currentAllocation: allocationPercentages,
        targetAllocation: targets,
        deviations,
        diversificationScores,
        recommendations: this.generateRecommendations(deviations, diversificationScores),
        timestamp: Date.now()
      };

      // Log the analysis
      await executionLogService.logPortfolioAnalysis({
        totalValue,
        holdingsCount: holdings.length,
        deviations: Object.keys(deviations).filter(key => Math.abs(deviations[key]) > 5),
        diversificationScore: diversificationScores.overall
      });

      return analysis;
    } catch (error) {
      await executionLogService.logError('portfolio.analysis.failed', error, { holdings, targets });
      throw error;
    }
  }

  /**
   * Calculate current allocation by asset class
   * @param {Array} holdings - Portfolio holdings
   * @returns {Object} Current allocation breakdown
   */
  calculateCurrentAllocation(holdings) {
    const allocation = {
      equity: 0,
      bonds: 0,
      cash: 0,
      international: 0,
      real_estate: 0,
      commodities: 0,
      unknown: 0,
      totalValue: 0,
      bySector: {},
      byTicker: {}
    };

    holdings.forEach(holding => {
      const { ticker, quantity, currentPrice } = holding;
      const value = quantity * currentPrice;
      
      allocation.totalValue += value;
      allocation.byTicker[ticker] = value;

      const classification = this.assetClassifications[ticker];
      if (classification) {
        const assetClass = classification.assetClass;
        allocation[assetClass] = (allocation[assetClass] || 0) + value;
        
        // Track by sector
        const sector = classification.sector;
        allocation.bySector[sector] = (allocation.bySector[sector] || 0) + value;
      } else {
        allocation.unknown += value;
      }
    });

    return allocation;
  }

  /**
   * Calculate allocation percentages
   * @param {Object} allocation - Current allocation
   * @param {number} totalValue - Total portfolio value
   * @returns {Object} Allocation percentages
   */
  calculateAllocationPercentages(allocation, totalValue) {
    const percentages = {};
    
    Object.keys(allocation).forEach(key => {
      if (key !== 'totalValue' && key !== 'bySector' && key !== 'byTicker') {
        percentages[key] = totalValue > 0 ? (allocation[key] / totalValue) * 100 : 0;
      }
    });

    // Add sector percentages
    percentages.bySector = {};
    if (allocation.bySector && typeof allocation.bySector === 'object') {
      Object.keys(allocation.bySector).forEach(sector => {
        percentages.bySector[sector] = totalValue > 0 ? (allocation.bySector[sector] / totalValue) * 100 : 0;
      });
    }

    return percentages;
  }

  /**
   * Calculate deviation from target allocations
   * @param {Object} current - Current allocation percentages
   * @param {Object} targets - Target allocation percentages
   * @returns {Object} Deviation percentages
   */
  calculateDeviations(current, targets) {
    const deviations = {};
    
    Object.keys(targets).forEach(assetClass => {
      const currentValue = current[assetClass] || 0;
      const targetValue = targets[assetClass] || 0;
      deviations[assetClass] = currentValue - targetValue;
    });

    return deviations;
  }

  /**
   * Calculate diversification scores
   * @param {Array} holdings - Portfolio holdings
   * @param {Object} allocation - Current allocation percentages
   * @returns {Object} Diversification scores
   */
  calculateDiversificationScores(holdings, allocation) {
    // Count unique sectors
    const sectors = new Set();
    holdings.forEach(holding => {
      const classification = this.assetClassifications[holding.ticker];
      if (classification) {
        sectors.add(classification.sector);
      }
    });

    // Calculate sector concentration (lower is better)
    const sectorConcentration = Object.values(allocation.bySector || {})
      .reduce((sum, percentage) => sum + Math.pow(percentage, 2), 0);

    // Calculate asset class diversity (higher is better)
    const assetClassCount = Object.keys(allocation)
      .filter(key => key !== 'bySector' && key !== 'unknown' && allocation[key] > 0).length;

    // Overall diversification score (0-100, higher is better)
    const sectorScore = Math.max(0, 100 - sectorConcentration);
    const assetClassScore = Math.min(100, assetClassCount * 20);
    const overallScore = Math.round((sectorScore + assetClassScore) / 2);

    return {
      sectorCount: sectors.size,
      sectorConcentration,
      assetClassCount,
      sectorScore: Math.round(sectorScore),
      assetClassScore: Math.round(assetClassScore),
      overall: overallScore
    };
  }

  /**
   * Generate rebalancing recommendations
   * @param {Object} deviations - Deviation from targets
   * @param {Object} diversificationScores - Diversification scores
   * @returns {Array} Recommendations
   */
  generateRecommendations(deviations, diversificationScores) {
    const recommendations = [];

    // Check for significant deviations (>5%)
    Object.entries(deviations).forEach(([assetClass, deviation]) => {
      if (Math.abs(deviation) > 5) {
        const action = deviation > 0 ? 'reduce' : 'increase';
        const percentage = Math.abs(deviation);
        recommendations.push({
          type: 'rebalancing',
          priority: Math.abs(deviation) > 10 ? 'high' : 'medium',
          message: `Consider ${action}ing ${assetClass} allocation by ${percentage.toFixed(1)}%`,
          assetClass,
          deviation
        });
      }
    });

    // Check diversification
    if (diversificationScores.overall < 50) {
      recommendations.push({
        type: 'diversification',
        priority: 'high',
        message: 'Portfolio lacks diversification. Consider adding more asset classes or sectors.',
        score: diversificationScores.overall
      });
    }

    if (diversificationScores.sectorCount < 3) {
      recommendations.push({
        type: 'diversification',
        priority: 'medium',
        message: `Portfolio is concentrated in ${diversificationScores.sectorCount} sectors. Consider diversifying across more sectors.`,
        sectorCount: diversificationScores.sectorCount
      });
    }

    return recommendations;
  }

  /**
   * Get supported tickers and their classifications
   * @returns {Object} Asset classifications
   */
  getSupportedAssets() {
    return this.assetClassifications;
  }

  /**
   * Get default target allocations
   * @returns {Object} Default targets
   */
  getDefaultTargets() {
    return { ...this.defaultTargets };
  }

  /**
   * Validate portfolio holdings
   * @param {Array} holdings - Portfolio holdings to validate
   * @returns {Object} Validation results
   */
  validateHoldings(holdings) {
    const errors = [];
    const warnings = [];

    holdings.forEach((holding, index) => {
      const { ticker, quantity, currentPrice } = holding;

      // Check required fields
      if (!ticker || !quantity || !currentPrice) {
        errors.push(`Holding ${index + 1}: Missing required fields (ticker, quantity, currentPrice)`);
        return;
      }

      // Check for negative values
      if (quantity <= 0 || currentPrice <= 0) {
        errors.push(`Holding ${index + 1}: Quantity and current price must be positive`);
        return;
      }

      // Check if ticker is supported
      if (!this.assetClassifications[ticker]) {
        warnings.push(`Holding ${index + 1}: Ticker '${ticker}' not in supported assets list`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
const portfolioAnalyzer = new PortfolioAnalyzer();
export default portfolioAnalyzer;

// Also export the class for testing
export { PortfolioAnalyzer }; 