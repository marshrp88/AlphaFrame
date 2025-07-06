/**
 * DebtService - Advanced Debt Management Engine
 * 
 * Purpose: Provides comprehensive debt management capabilities including
 * multiple payoff strategies, interest calculations, and optimization
 * recommendations for the AlphaFrame Galileo V2.2 platform.
 * 
 * Procedure:
 * 1. Analyzes user's debt portfolio and calculates total obligations
 * 2. Implements multiple payoff strategies (avalanche, snowball, hybrid)
 * 3. Calculates payoff timelines and total interest costs
 * 4. Generates personalized recommendations and clear explanations
 * 
 * Conclusion: This service enables users to make informed decisions about
 * debt payoff strategies with professional-grade analysis and clear
 * explanations of the financial impact of each approach.
 */

class DebtService {
  constructor() {
    // Common debt types and their characteristics
    this.debtTypes = {
      creditCard: { priority: 'high', riskLevel: 'high' },
      personalLoan: { priority: 'medium', riskLevel: 'medium' },
      studentLoan: { priority: 'low', riskLevel: 'low' },
      mortgage: { priority: 'low', riskLevel: 'low' },
      autoLoan: { priority: 'medium', riskLevel: 'medium' }
    };
  }

  /**
   * Analyze debt portfolio and generate comprehensive payoff strategies
   * @param {Object} debtData - User's debt information
   * @param {Object} financialData - User's financial situation
   * @returns {Object} Comprehensive debt analysis and strategies
   */
  async analyzeDebtPortfolio(debtData, financialData) {
    try {
      // Calculate portfolio metrics
      const portfolioMetrics = this.calculatePortfolioMetrics(debtData);
      
      // Generate payoff strategies
      const strategies = {
        avalanche: this.calculateAvalancheStrategy(debtData, financialData),
        snowball: this.calculateSnowballStrategy(debtData, financialData),
        hybrid: this.calculateHybridStrategy(debtData, financialData),
        minimum: this.calculateMinimumPayments(debtData)
      };
      
      // Generate recommendations
      const recommendations = this.generateDebtRecommendations(debtData, financialData, strategies);
      
      // Create comprehensive result
      const result = {
        portfolioMetrics,
        strategies,
        recommendations,
        summary: {
          totalDebt: portfolioMetrics.totalDebt,
          totalInterest: portfolioMetrics.totalInterest,
          averageRate: portfolioMetrics.averageRate,
          payoffTime: strategies.avalanche.totalTime,
          potentialSavings: strategies.minimum.totalInterest - strategies.avalanche.totalInterest
        },
        timestamp: new Date().toISOString(),
        version: '2.2.0'
      };

      return result;
    } catch (error) {
      throw new Error(`Debt analysis failed: ${error.message}`);
    }
  }

  /**
   * Calculate portfolio-level metrics
   * @param {Object} debtData - User's debt information
   * @returns {Object} Portfolio metrics
   */
  calculatePortfolioMetrics(debtData) {
    const { debts = [] } = debtData;
    
    if (debts.length === 0) {
      return {
        totalDebt: 0,
        totalInterest: 0,
        averageRate: 0,
        debtCount: 0,
        highInterestDebt: 0,
        lowInterestDebt: 0
      };
    }
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalInterest = debts.reduce((sum, debt) => sum + debt.balance * debt.rate, 0);
    const averageRate = totalDebt > 0 ? totalInterest / totalDebt : 0;
    
    const highInterestDebt = debts
      .filter(debt => debt.rate > 0.15)
      .reduce((sum, debt) => sum + debt.balance, 0);
    
    const lowInterestDebt = debts
      .filter(debt => debt.rate <= 0.15)
      .reduce((sum, debt) => sum + debt.balance, 0);
    
    return {
      totalDebt,
      totalInterest,
      averageRate,
      debtCount: debts.length,
      highInterestDebt,
      lowInterestDebt
    };
  }

  /**
   * Calculate avalanche strategy (highest interest rate first)
   * @param {Object} debtData - User's debt information
   * @param {Object} financialData - User's financial situation
   * @returns {Object} Avalanche strategy details
   */
  calculateAvalancheStrategy(debtData, financialData) {
    const { debts = [] } = debtData;
    const { monthlyPayment = 0 } = financialData;
    
    if (debts.length === 0) return { totalTime: 0, totalInterest: 0, payoffOrder: [] };
    
    // Sort debts by interest rate (highest first)
    const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate);
    
    return this.calculatePayoffStrategy(sortedDebts, monthlyPayment, 'avalanche');
  }

  /**
   * Calculate snowball strategy (lowest balance first)
   * @param {Object} debtData - User's debt information
   * @param {Object} financialData - User's financial situation
   * @returns {Object} Snowball strategy details
   */
  calculateSnowballStrategy(debtData, financialData) {
    const { debts = [] } = debtData;
    const { monthlyPayment = 0 } = financialData;
    
    if (debts.length === 0) return { totalTime: 0, totalInterest: 0, payoffOrder: [] };
    
    // Sort debts by balance (lowest first)
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
    
    return this.calculatePayoffStrategy(sortedDebts, monthlyPayment, 'snowball');
  }

  /**
   * Calculate hybrid strategy (balance of psychological and financial benefits)
   * @param {Object} debtData - User's debt information
   * @param {Object} financialData - User's financial situation
   * @returns {Object} Hybrid strategy details
   */
  calculateHybridStrategy(debtData, financialData) {
    const { debts = [] } = debtData;
    const { monthlyPayment = 0 } = financialData;
    
    if (debts.length === 0) return { totalTime: 0, totalInterest: 0, payoffOrder: [] };
    
    // Hybrid approach: Pay off small debts first, then highest interest
    const sortedDebts = [...debts].sort((a, b) => {
      // If balance is small (< $1000), prioritize by balance
      if (a.balance < 1000 && b.balance >= 1000) return -1;
      if (b.balance < 1000 && a.balance >= 1000) return 1;
      // Otherwise, prioritize by interest rate
      return b.rate - a.rate;
    });
    
    return this.calculatePayoffStrategy(sortedDebts, monthlyPayment, 'hybrid');
  }

  /**
   * Calculate minimum payments scenario
   * @param {Object} debtData - User's debt information
   * @returns {Object} Minimum payments scenario
   */
  calculateMinimumPayments(debtData) {
    const { debts = [] } = debtData;
    
    if (debts.length === 0) return { totalTime: 0, totalInterest: 0, monthlyPayment: 0 };
    
    const totalMonthlyPayment = debts.reduce((sum, debt) => sum + (debt.minimumPayment || 0), 0);
    const totalInterest = debts.reduce((sum, debt) => {
      const monthlyRate = debt.rate / 12;
      const months = Math.log(1 + (debt.balance * monthlyRate) / (debt.minimumPayment || 0)) / Math.log(1 + monthlyRate);
      return sum + (debt.minimumPayment || 0) * months - debt.balance;
    }, 0);
    
    return {
      totalTime: Math.max(...debts.map(debt => {
        const monthlyRate = debt.rate / 12;
        return Math.log(1 + (debt.balance * monthlyRate) / (debt.minimumPayment || 0)) / Math.log(1 + monthlyRate);
      })),
      totalInterest,
      monthlyPayment: totalMonthlyPayment
    };
  }

  /**
   * Calculate payoff strategy for given debt order
   * @param {Array} sortedDebts - Debts sorted by strategy
   * @param {number} monthlyPayment - Available monthly payment
   * @param {string} strategyName - Name of the strategy
   * @returns {Object} Strategy calculation results
   */
  calculatePayoffStrategy(sortedDebts, monthlyPayment, strategyName) {
    const debts = sortedDebts.map(debt => ({ ...debt, remainingBalance: debt.balance }));
    const payoffOrder = [];
    let totalInterest = 0;
    let currentMonth = 0;
    
    while (debts.some(debt => debt.remainingBalance > 0)) {
      currentMonth++;
      let availablePayment = monthlyPayment;
      
      // Pay minimum payments on all debts first
      for (const debt of debts) {
        if (debt.remainingBalance <= 0) continue;
        
        const minimumPayment = debt.minimumPayment || debt.remainingBalance * 0.02;
        const payment = Math.min(minimumPayment, debt.remainingBalance);
        
        debt.remainingBalance -= payment;
        availablePayment -= payment;
        
        // Calculate interest for this month
        const monthlyInterest = debt.remainingBalance * (debt.rate / 12);
        debt.remainingBalance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
      
      // Apply remaining payment to highest priority debt
      for (const debt of debts) {
        if (debt.remainingBalance <= 0 || availablePayment <= 0) continue;
        
        const payment = Math.min(availablePayment, debt.remainingBalance);
        debt.remainingBalance -= payment;
        availablePayment -= payment;
        
        if (debt.remainingBalance <= 0) {
          payoffOrder.push({
            debt: debt.name,
            month: currentMonth,
            balance: debt.balance
          });
        }
      }
    }
    
    return {
      totalTime: currentMonth,
      totalInterest,
      payoffOrder,
      strategy: strategyName
    };
  }

  /**
   * Generate debt optimization recommendations
   * @param {Object} debtData - User's debt information
   * @param {Object} financialData - User's financial situation
   * @param {Object} strategies - Calculated strategies
   * @returns {Array} Array of recommendations
   */
  generateDebtRecommendations(debtData, financialData, strategies) {
    const recommendations = [];
    const { debts = [] } = debtData;
    const { monthlyPayment = 0, emergencyFund = 0 } = financialData;
    
    // High-interest debt warning
    const highInterestDebts = debts.filter(debt => debt.rate > 0.20);
    if (highInterestDebts.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'High-Interest Debt Alert',
        description: `You have ${highInterestDebts.length} debt(s) with interest rates above 20%. These should be your top priority.`,
        priority: 'critical',
        action: 'Focus all extra payments on high-interest debts first'
      });
    }
    
    // Emergency fund recommendation
    if (emergencyFund < 1000) {
      recommendations.push({
        type: 'emergency-fund',
        title: 'Build Emergency Fund',
        description: 'Consider building a $1,000 emergency fund before aggressively paying off debt.',
        priority: 'high',
        action: 'Set aside $1,000 for emergencies before debt payoff'
      });
    }
    
    // Strategy comparison
    const avalancheSavings = strategies.minimum.totalInterest - strategies.avalanche.totalInterest;
    const snowballSavings = strategies.minimum.totalInterest - strategies.snowball.totalInterest;
    
    if (avalancheSavings > snowballSavings * 1.2) {
      recommendations.push({
        type: 'strategy',
        title: 'Avalanche Strategy Recommended',
        description: `The avalanche method will save you $${avalancheSavings.toFixed(0)} more than the snowball method.`,
        priority: 'high',
        action: 'Use avalanche method: pay highest interest debts first'
      });
    } else {
      recommendations.push({
        type: 'strategy',
        title: 'Consider Snowball Strategy',
        description: 'The snowball method provides faster psychological wins and may help you stay motivated.',
        priority: 'medium',
        action: 'Consider snowball method for motivation'
      });
    }
    
    // Debt consolidation opportunity
    const averageRate = debts.reduce((sum, debt) => sum + debt.rate, 0) / debts.length;
    if (averageRate > 0.15 && debts.length > 2) {
      recommendations.push({
        type: 'consolidation',
        title: 'Consider Debt Consolidation',
        description: 'You may benefit from consolidating your debts at a lower interest rate.',
        priority: 'medium',
        action: 'Research debt consolidation options'
      });
    }
    
    return recommendations;
  }

  /**
   * Run debt payoff simulation with different scenarios
   * @param {Object} baseDebtData - Base debt data
   * @param {Object} scenarios - Different scenarios to test
   * @returns {Object} Simulation results
   */
  async runDebtSimulation(baseDebtData, scenarios) {
    const results = {
      base: await this.analyzeDebtPortfolio(baseDebtData, { monthlyPayment: 500 }),
      scenarios: {}
    };
    
    for (const [scenarioName, scenarioData] of Object.entries(scenarios)) {
      const combinedData = { ...baseDebtData, ...scenarioData };
      results.scenarios[scenarioName] = await this.analyzeDebtPortfolio(combinedData, { monthlyPayment: 500 });
    }
    
    return results;
  }
}

export default DebtService;
export { DebtService }; 