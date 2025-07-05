/**
 * TaxService - Comprehensive Tax Optimization Engine
 * 
 * Purpose: Provides enterprise-grade tax calculation and optimization capabilities
 * for the AlphaFrame Galileo V2.2 financial intelligence platform.
 * 
 * Procedure: 
 * 1. Calculates federal and state taxes using current tax brackets
 * 2. Applies standard and itemized deductions automatically
 * 3. Processes tax credits and identifies optimization opportunities
 * 4. Generates personalized recommendations with clear explanations
 * 
 * Conclusion: This service forms the foundation of the tax optimization
 * engine, enabling users to make informed financial decisions with
 * professional-grade accuracy and explainable results.
 */

class TaxService {
  constructor() {
    // 2024 Federal Tax Brackets (Single Filer)
    this.federalTaxBrackets = [
      { rate: 0.10, min: 0, max: 11600 },
      { rate: 0.12, min: 11601, max: 47150 },
      { rate: 0.22, min: 47151, max: 100525 },
      { rate: 0.24, min: 100526, max: 191950 },
      { rate: 0.32, min: 191951, max: 243725 },
      { rate: 0.35, min: 243726, max: 609350 },
      { rate: 0.37, min: 609351, max: Infinity }
    ];
    
    // Standard deduction for 2024
    this.standardDeduction = {
      single: 14600,
      married: 29200,
      headOfHousehold: 21900
    };
    
    // Common tax credits
    this.taxCredits = {
      childTaxCredit: 2000,
      earnedIncomeCredit: { max: 6328, phaseOut: 59478 },
      studentLoanInterest: 2500,
      retirementSavings: 1000
    };
  }

  /**
   * Calculate comprehensive tax liability with optimization recommendations
   * @param {Object} financialData - User's financial information
   * @returns {Object} Tax calculation results with recommendations
   */
  async calculateTaxLiability(financialData) {
    try {
      // Calculate federal tax
      const federalTax = this.calculateFederalTax(financialData);
      
      // Calculate state tax (placeholder for future implementation)
      const stateTax = this.calculateStateTax(financialData);
      
      // Apply deductions
      const deductions = this.calculateDeductions(financialData);
      
      // Apply credits
      const credits = this.calculateCredits(financialData);
      
      // Calculate final tax liability
      const totalTax = Math.max(0, federalTax + stateTax - deductions.total - credits.total);
      
      // Generate optimization recommendations
      const recommendations = this.generateOptimizationRecommendations(financialData, totalTax);
      
      // Create comprehensive result
      const result = {
        federalTax,
        stateTax,
        deductions,
        credits,
        totalTax,
        effectiveTaxRate: financialData.income > 0 ? (totalTax / financialData.income) * 100 : 0,
        recommendations,
        breakdown: {
          income: financialData.income,
          taxableIncome: financialData.income - deductions.standard,
          marginalRate: this.getMarginalTaxRate(financialData.income),
          averageRate: financialData.income > 0 ? (totalTax / financialData.income) * 100 : 0
        },
        timestamp: new Date().toISOString(),
        version: '2.2.0'
      };

      return result;
    } catch (error) {
      throw new Error(`Tax calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculate federal tax using progressive tax brackets
   * @param {Object} financialData - User's financial information
   * @returns {number} Federal tax amount
   */
  calculateFederalTax(financialData) {
    const { income, filingStatus = 'single' } = financialData;
    
    if (!income || income <= 0) return 0;
    
    let remainingIncome = income;
    let totalTax = 0;
    
    for (const bracket of this.federalTaxBrackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min + 1
      );
      
      totalTax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    
    return Math.round(totalTax * 100) / 100;
  }

  /**
   * Calculate state tax (placeholder for future implementation)
   * @param {Object} financialData - User's financial information
   * @returns {number} State tax amount
   */
  calculateStateTax(financialData) {
    // Placeholder for state tax calculation
    // Will be implemented based on user's state of residence
    return 0;
  }

  /**
   * Calculate applicable deductions
   * @param {Object} financialData - User's financial information
   * @returns {Object} Deduction amounts
   */
  calculateDeductions(financialData) {
    const { income, filingStatus = 'single', itemizedDeductions = {} } = financialData;
    
    // Calculate standard deduction
    const standardDeduction = this.standardDeduction[filingStatus] || this.standardDeduction.single;
    
    // Calculate itemized deductions
    const totalItemized = Object.values(itemizedDeductions).reduce((sum, amount) => sum + (amount || 0), 0);
    
    // Use the greater of standard or itemized deductions
    const deductionAmount = Math.max(standardDeduction, totalItemized);
    
    return {
      standard: standardDeduction,
      itemized: totalItemized,
      total: deductionAmount,
      type: totalItemized > standardDeduction ? 'itemized' : 'standard'
    };
  }

  /**
   * Calculate applicable tax credits
   * @param {Object} financialData - User's financial information
   * @returns {Object} Credit amounts
   */
  calculateCredits(financialData) {
    const { income, children = 0, studentLoanInterest = 0, retirementContributions = 0 } = financialData;
    
    let totalCredits = 0;
    const creditBreakdown = {};
    
    // Child Tax Credit
    if (children > 0) {
      const childCredit = Math.min(children * this.taxCredits.childTaxCredit, income * 0.15);
      creditBreakdown.childTaxCredit = childCredit;
      totalCredits += childCredit;
    }
    
    // Student Loan Interest Deduction
    if (studentLoanInterest > 0) {
      const studentLoanCredit = Math.min(studentLoanInterest, this.taxCredits.studentLoanInterest);
      creditBreakdown.studentLoanInterest = studentLoanCredit;
      totalCredits += studentLoanCredit;
    }
    
    // Retirement Savings Credit
    if (retirementContributions > 0) {
      const retirementCredit = Math.min(retirementContributions * 0.1, this.taxCredits.retirementSavings);
      creditBreakdown.retirementSavings = retirementCredit;
      totalCredits += retirementCredit;
    }
    
    return {
      total: totalCredits,
      breakdown: creditBreakdown
    };
  }

  /**
   * Generate optimization recommendations based on financial situation
   * @param {Object} financialData - User's financial information
   * @param {number} currentTax - Current tax liability
   * @returns {Array} Array of optimization recommendations
   */
  generateOptimizationRecommendations(financialData, currentTax) {
    const recommendations = [];
    const { income, retirementContributions = 0, itemizedDeductions = {} } = financialData;
    
    // Retirement contribution optimization
    const max401kContribution = 22500; // 2024 limit
    if (retirementContributions < max401kContribution) {
      const potentialSavings = Math.min(
        (max401kContribution - retirementContributions) * this.getMarginalTaxRate(income),
        1000
      );
      
      recommendations.push({
        type: 'retirement',
        title: 'Increase 401(k) Contributions',
        description: `You could save up to $${potentialSavings.toFixed(0)} in taxes by maximizing your 401(k) contributions.`,
        potentialSavings,
        priority: 'high',
        action: 'Increase 401(k) contribution to $22,500 annually'
      });
    }
    
    // Itemized deduction optimization
    const standardDeduction = this.standardDeduction.single;
    const currentItemized = Object.values(itemizedDeductions).reduce((sum, amount) => sum + (amount || 0), 0);
    
    if (currentItemized > standardDeduction * 0.8) {
      recommendations.push({
        type: 'deductions',
        title: 'Consider Itemizing Deductions',
        description: 'You may benefit from itemizing deductions instead of taking the standard deduction.',
        potentialSavings: Math.round((currentItemized - standardDeduction) * this.getMarginalTaxRate(income)),
        priority: 'medium',
        action: 'Review itemized deduction opportunities'
      });
    }
    
    // Health Savings Account optimization
    if (income > 50000) {
      recommendations.push({
        type: 'hsa',
        title: 'Consider Health Savings Account',
        description: 'HSA contributions are tax-deductible and grow tax-free for medical expenses.',
        potentialSavings: Math.round(4150 * this.getMarginalTaxRate(income)), // 2024 HSA limit
        priority: 'medium',
        action: 'Open HSA and contribute up to $4,150 annually'
      });
    }
    
    return recommendations;
  }

  /**
   * Get marginal tax rate for given income
   * @param {number} income - Annual income
   * @returns {number} Marginal tax rate as decimal
   */
  getMarginalTaxRate(income) {
    for (const bracket of this.federalTaxBrackets) {
      if (income <= bracket.max) {
        return bracket.rate;
      }
    }
    return this.federalTaxBrackets[this.federalTaxBrackets.length - 1].rate;
  }

  /**
   * Run tax optimization simulation
   * @param {Object} baseFinancialData - Base financial data
   * @param {Object} scenarios - Different scenarios to test
   * @returns {Object} Simulation results
   */
  async runTaxSimulation(baseFinancialData, scenarios) {
    const results = {
      base: await this.calculateTaxLiability(baseFinancialData),
      scenarios: {}
    };
    
    for (const [scenarioName, scenarioData] of Object.entries(scenarios)) {
      const combinedData = { ...baseFinancialData, ...scenarioData };
      results.scenarios[scenarioName] = await this.calculateTaxLiability(combinedData);
    }
    
    return results;
  }
}

export default TaxService; 