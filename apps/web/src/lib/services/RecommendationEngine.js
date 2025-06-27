/**
 * RecommendationEngine - Intelligent financial recommendation system
 * 
 * Purpose: Analyzes user's financial state and context to generate
 * personalized, actionable recommendations for improving financial health.
 * 
 * Procedure:
 * 1. Analyzes financial data patterns and user behavior
 * 2. Evaluates user context and goals
 * 3. Generates prioritized recommendations
 * 4. Tracks engagement and effectiveness
 * 
 * Conclusion: Provides users with specific, actionable guidance
 * to improve their financial situation.
 */
class RecommendationEngine {
  constructor() {
    this.recommendationTypes = {
      EMERGENCY_FUND: 'emergency-fund',
      DEBT_PAYOFF: 'debt-payoff',
      BUDGET_OPTIMIZATION: 'budget-optimization',
      SAVINGS_GOAL: 'savings-goal',
      INVESTMENT_START: 'investment-start',
      SPENDING_REVIEW: 'spending-review',
      INCOME_OPTIMIZATION: 'income-optimization',
      TAX_OPTIMIZATION: 'tax-optimization',
      INSURANCE_REVIEW: 'insurance-review',
      RETIREMENT_PLANNING: 'retirement-planning',
      BEHAVIORAL_INSIGHT: 'behavioral-insight',
      PREDICTIVE_ALERT: 'predictive-alert'
    };
    
    // AI-powered behavioral patterns
    this.behavioralPatterns = {
      SPENDING_SPIKES: 'spending-spikes',
      INCOME_VOLATILITY: 'income-volatility',
      SAVINGS_INCONSISTENCY: 'savings-inconsistency',
      DEBT_ACCUMULATION: 'debt-accumulation',
      INVESTMENT_TIMING: 'investment-timing',
      BUDGET_OVERRUNS: 'budget-overruns'
    };
  }

  /**
   * Generate personalized recommendations based on financial state and user context
   */
  async generateRecommendations(financialState) {
    try {
      const recommendations = [];
      
      // AI-Powered Behavioral Analysis
      const behavioralInsights = this.analyzeBehavioralPatterns(financialState);
      recommendations.push(...behavioralInsights);

      // Predictive Analytics
      const predictiveAlerts = this.generatePredictiveAlerts(financialState);
      recommendations.push(...predictiveAlerts);

      // Traditional Financial Analysis
      const emergencyFundRec = this.analyzeEmergencyFund(financialState);
      if (emergencyFundRec) recommendations.push(emergencyFundRec);

      const debtRec = this.analyzeDebtSituation(financialState);
      if (debtRec) recommendations.push(debtRec);

      const spendingRec = this.analyzeSpendingPatterns(financialState);
      if (spendingRec) recommendations.push(spendingRec);

      const savingsRec = this.analyzeSavingsGoals(financialState);
      if (savingsRec) recommendations.push(savingsRec);

      const investmentRec = this.analyzeInvestmentOpportunities(financialState);
      if (investmentRec) recommendations.push(investmentRec);

      // Advanced Financial Planning
      const taxRec = this.analyzeTaxOptimization(financialState);
      if (taxRec) recommendations.push(taxRec);

      const insuranceRec = this.analyzeInsuranceNeeds(financialState);
      if (insuranceRec) recommendations.push(insuranceRec);

      const retirementRec = this.analyzeRetirementPlanning(financialState);
      if (retirementRec) recommendations.push(retirementRec);

      // Sort by priority and impact
      return this.prioritizeRecommendations(recommendations);
    } catch (error) {
      return this.getFallbackRecommendations();
    }
  }

  /**
   * AI-Powered Behavioral Pattern Analysis
   */
  analyzeBehavioralPatterns(financialState) {
    const insights = [];
    const historicalData = financialState?.historicalData || [];
    
    if (historicalData.length < 3) return insights;

    // Analyze spending spikes
    const spendingSpikes = this.detectSpendingSpikes(historicalData);
    if (spendingSpikes.length > 0) {
      insights.push({
        id: this.recommendationTypes.BEHAVIORAL_INSIGHT,
        title: 'Spending Pattern Detected',
        description: `You tend to overspend by ${spendingSpikes[0].averageIncrease}% on ${spendingSpikes[0].category} during ${spendingSpikes[0].trigger}. Consider setting up alerts.`,
        priority: 'medium',
        impact: 'medium',
        action: 'setup-spending-alerts',
        icon: '🎯',
        type: 'behavioral',
        confidence: spendingSpikes[0].confidence,
        completed: false,
        progress: 0
      });
    }

    // Analyze savings consistency
    const savingsPattern = this.analyzeSavingsConsistency(historicalData);
    if (savingsPattern.inconsistency > 0.3) {
      insights.push({
        id: this.recommendationTypes.BEHAVIORAL_INSIGHT,
        title: 'Savings Inconsistency',
        description: `Your savings vary by ${(savingsPattern.inconsistency * 100).toFixed(1)}% monthly. Consider automated savings transfers.`,
        priority: 'medium',
        impact: 'high',
        action: 'setup-automated-savings',
        icon: '🔄',
        type: 'behavioral',
        confidence: savingsPattern.confidence,
        completed: false,
        progress: 0
      });
    }

    return insights;
  }

  /**
   * Predictive Analytics - Future Financial Alerts
   */
  generatePredictiveAlerts(financialState) {
    const alerts = [];
    const projections = this.generateFinancialProjections(financialState);

    // Predict cash flow issues
    if (projections.cashFlowRisk > 0.7) {
      alerts.push({
        id: this.recommendationTypes.PREDICTIVE_ALERT,
        title: 'Cash Flow Risk Alert',
        description: `Based on current patterns, you may face cash flow issues in ${projections.riskTimeframe} months. Consider reducing discretionary spending.`,
        priority: 'high',
        impact: 'high',
        action: 'review-cash-flow',
        icon: '⚠️',
        type: 'predictive',
        confidence: projections.cashFlowRisk,
        timeframe: projections.riskTimeframe,
        completed: false,
        progress: 0
      });
    }

    // Predict debt accumulation
    if (projections.debtRisk > 0.6) {
      alerts.push({
        id: this.recommendationTypes.PREDICTIVE_ALERT,
        title: 'Debt Accumulation Risk',
        description: `At current rates, your debt may increase by ${projections.debtIncrease}% in 6 months. Consider debt consolidation.`,
        priority: 'high',
        impact: 'high',
        action: 'debt-consolidation',
        icon: '📈',
        type: 'predictive',
        confidence: projections.debtRisk,
        completed: false,
        progress: 0
      });
    }

    return alerts;
  }

  /**
   * Detect spending spikes using pattern recognition
   */
  detectSpendingSpikes(historicalData) {
    const spikes = [];
    const categories = ['dining', 'entertainment', 'shopping', 'transportation'];
    
    categories.forEach(category => {
      const categoryData = historicalData.map(month => month.spending?.[category] || 0);
      const avg = categoryData.reduce((sum, val) => sum + val, 0) / categoryData.length;
      const variance = categoryData.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / categoryData.length;
      const stdDev = Math.sqrt(variance);
      
      // Detect spikes (spending > 2 standard deviations above mean)
      const spikesInCategory = categoryData.filter(spending => spending > avg + 2 * stdDev);
      
      if (spikesInCategory.length > 0) {
        spikes.push({
          category,
          averageIncrease: ((spikesInCategory[0] - avg) / avg * 100).toFixed(1),
          trigger: this.identifySpikeTrigger(historicalData, category),
          confidence: Math.min(0.9, spikesInCategory.length / categoryData.length + 0.5)
        });
      }
    });
    
    return spikes;
  }

  /**
   * Analyze savings consistency
   */
  analyzeSavingsConsistency(historicalData) {
    const savingsData = historicalData.map(month => month.savings || 0);
    const avg = savingsData.reduce((sum, val) => sum + val, 0) / savingsData.length;
    const variance = savingsData.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / savingsData.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      inconsistency: stdDev / avg,
      confidence: Math.min(0.9, 1 - (stdDev / avg))
    };
  }

  /**
   * Generate financial projections
   */
  generateFinancialProjections(financialState) {
    const currentCashFlow = financialState?.monthlyIncome - financialState?.monthlyExpenses || 0;
    const currentDebt = financialState?.debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;
    
    // Simple linear projection (in a real system, this would use ML models)
    const cashFlowRisk = currentCashFlow < 0 ? 0.8 : Math.max(0, 0.3 - (currentCashFlow / 1000));
    const debtRisk = currentDebt > 0 ? Math.min(0.9, currentDebt / 10000) : 0;
    
    return {
      cashFlowRisk,
      debtRisk,
      riskTimeframe: Math.max(1, Math.ceil(12 * cashFlowRisk)),
      debtIncrease: Math.round(debtRisk * 100)
    };
  }

  /**
   * Analyze tax optimization opportunities
   */
  analyzeTaxOptimization(financialState) {
    const income = financialState?.monthlyIncome * 12 || 0;
    const savings = financialState?.savings || 0;
    
    if (income > 50000 && savings < 19500) {
      return {
        id: this.recommendationTypes.TAX_OPTIMIZATION,
        title: 'Maximize 401(k) Contributions',
        description: `You could save $${Math.round((19500 - savings) * 0.22)} annually in taxes by maxing out your 401(k).`,
        priority: 'medium',
        impact: 'high',
        action: 'increase-401k',
        icon: '💰',
        completed: false,
        progress: (savings / 19500) * 100
      };
    }
    
    return null;
  }

  /**
   * Analyze insurance needs
   */
  analyzeInsuranceNeeds(financialState) {
    const income = financialState?.monthlyIncome * 12 || 0;
    const dependents = 0;
    
    if (income > 60000 && dependents > 0) {
      return {
        id: this.recommendationTypes.INSURANCE_REVIEW,
        title: 'Review Life Insurance',
        description: `With ${dependents} dependents, consider life insurance coverage of $${Math.round(income * 10).toLocaleString()}.`,
        priority: 'medium',
        impact: 'high',
        action: 'review-insurance',
        icon: '🛡️',
        completed: false,
        progress: 0
      };
    }
    
    return null;
  }

  /**
   * Analyze retirement planning
   */
  analyzeRetirementPlanning(financialState) {
    const age = 30;
    const retirementSavings = financialState?.retirementSavings || 0;
    const income = financialState?.monthlyIncome * 12 || 0;
    
    const targetRetirementSavings = income * (65 - age) * 0.15;
    
    if (retirementSavings < targetRetirementSavings * 0.5) {
      return {
        id: this.recommendationTypes.RETIREMENT_PLANNING,
        title: 'Boost Retirement Savings',
        description: `You're ${Math.round((retirementSavings / targetRetirementSavings) * 100)}% toward your retirement goal. Consider increasing contributions.`,
        priority: 'medium',
        impact: 'high',
        action: 'increase-retirement',
        icon: '🏖️',
        completed: false,
        progress: (retirementSavings / targetRetirementSavings) * 100
      };
    }
    
    return null;
  }

  /**
   * Analyze emergency fund status and generate recommendations
   */
  analyzeEmergencyFund(financialState) {
    const monthlyExpenses = financialState?.monthlyExpenses || 0;
    const targetEmergencyFund = monthlyExpenses * 3; // 3 months of expenses

    if (financialState?.savings < targetEmergencyFund) {
      const shortfall = targetEmergencyFund - (financialState?.savings || 0);
      const monthlyContribution = Math.min(monthlyExpenses * 0.1, shortfall / 6); // 10% of expenses or 6-month plan

      return {
        id: this.recommendationTypes.EMERGENCY_FUND,
        title: 'Build Emergency Fund',
        description: `You need $${shortfall.toLocaleString()} more to reach a 3-month emergency fund. Start by saving $${monthlyContribution.toLocaleString()} monthly.`,
        priority: 'high',
        action: {
          type: 'increase_savings',
          amount: monthlyContribution,
          category: 'savings'
        }
      };
    }

    return null;
  }

  /**
   * Analyze debt situation and generate recommendations
   */
  analyzeDebtSituation(financialState) {
    const debts = financialState?.debts || [];
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const monthlyIncome = financialState?.monthlyIncome || 0;

    if (totalDebt > 0) {
      const debtToIncomeRatio = totalDebt / (monthlyIncome * 12);
      
      if (debtToIncomeRatio > 0.4) { // High debt-to-income ratio
        return {
          id: this.recommendationTypes.DEBT_PAYOFF,
          title: 'Prioritize Debt Payoff',
          description: `Your debt-to-income ratio is ${(debtToIncomeRatio * 100).toFixed(1)}%. Focus on high-interest debt first.`,
          priority: 'high',
          impact: 'high',
          action: 'debt-payoff',
          icon: '💳',
          completed: false,
          progress: 0
        };
      } else if (debtToIncomeRatio > 0.2) { // Moderate debt
        return {
          id: this.recommendationTypes.DEBT_PAYOFF,
          title: 'Accelerate Debt Payoff',
          description: `Consider increasing debt payments by $${(monthlyIncome * 0.05).toLocaleString()} monthly to pay off faster.`,
          priority: 'medium',
          impact: 'medium',
          action: 'debt-payoff',
          icon: '📉',
          completed: false,
          progress: 0
        };
      }
    }

    return null;
  }

  /**
   * Analyze spending patterns and generate recommendations
   */
  analyzeSpendingPatterns(financialState) {
    const spending = financialState?.spending || {};
    const categories = Object.keys(spending);
    
    if (categories.length > 0) {
      const topSpendingCategory = categories.reduce((max, category) => 
        spending[category] > spending[max] ? category : max
      );
      
      const topSpendingAmount = spending[topSpendingCategory];
      const monthlyIncome = financialState?.monthlyIncome || 0;
      const spendingRatio = topSpendingAmount / monthlyIncome;

      if (spendingRatio > 0.3) { // More than 30% on one category
        return {
          id: this.recommendationTypes.SPENDING_REVIEW,
          title: 'Review High Spending',
          description: `${topSpendingCategory} accounts for ${(spendingRatio * 100).toFixed(1)}% of your income. Consider optimization.`,
          priority: 'medium',
          impact: 'medium',
          action: 'review-spending',
          icon: '📊',
          completed: false,
          progress: 0
        };
      }
    }

    return null;
  }

  /**
   * Analyze savings goals and generate recommendations
   */
  analyzeSavingsGoals(financialState) {
    // const savings = financialState?.savings || 0;
    const monthlyIncome = financialState?.monthlyIncome || 0;
    const savingsRate = financialState?.savingsRate || 0;

    if (savingsRate < 0.2) { // Less than 20% savings rate
      const targetSavings = monthlyIncome * 0.2;
      const currentSavings = monthlyIncome * savingsRate;
      const increase = targetSavings - currentSavings;

      return {
        id: this.recommendationTypes.SAVINGS_GOAL,
        title: 'Increase Savings Rate',
        description: `Aim to save ${(savingsRate * 100).toFixed(1)}% of income. Try increasing by $${increase.toLocaleString()} monthly.`,
        priority: 'medium',
        impact: 'high',
        action: 'optimize-budget',
        icon: '💰',
        completed: false,
        progress: (savingsRate / 0.2) * 100
      };
    }

    return null;
  }

  /**
   * Analyze investment opportunities
   */
  analyzeInvestmentOpportunities(financialState) {
    const savings = financialState?.savings || 0;
    const emergencyFund = financialState?.monthlyExpenses * 3 || 0;
    const excessSavings = savings - emergencyFund;

    if (excessSavings > 5000) { // More than $5k beyond emergency fund
      return {
        id: this.recommendationTypes.INVESTMENT_START,
        title: 'Start Investing',
        description: `You have $${excessSavings.toLocaleString()} available for investment. Consider a diversified portfolio.`,
        priority: 'low',
        impact: 'high',
        action: 'start-investing',
        icon: '📈',
        completed: false,
        progress: 0
      };
    }

    return null;
  }

  /**
   * Identify what triggers spending spikes
   */
  identifySpikeTrigger(historicalData, category) {
    // Simple pattern matching - in a real system, this would use ML
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyAverages = months.map((month, index) => {
      const monthData = historicalData.filter(data => 
        new Date(data.timestamp).getMonth() === index
      );
      return {
        month,
        average: monthData.reduce((sum, data) => sum + (data.spending?.[category] || 0), 0) / monthData.length
      };
    });
    
    const highestMonth = monthlyAverages.reduce((max, current) => 
      current.average > max.average ? current : max
    );
    
    return highestMonth.month;
  }

  /**
   * Prioritize recommendations based on AI confidence and user impact
   */
  prioritizeRecommendations(recommendations) {
    return recommendations.sort((a, b) => {
      // Priority order: predictive > behavioral > traditional
      const typeOrder = { 
        'predictive': 3, 
        'behavioral': 2, 
        'traditional': 1 
      };
      
      const aType = a.type || 'traditional';
      const bType = b.type || 'traditional';
      
      if (typeOrder[aType] !== typeOrder[bType]) {
        return typeOrder[bType] - typeOrder[aType];
      }
      
      // Then by priority
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Then by confidence (for AI-powered insights)
      if (a.confidence && b.confidence) {
        return b.confidence - a.confidence;
      }
      
      // Then by impact
      const impactOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  /**
   * Track user engagement with recommendations
   */
  static async trackEngagement(recommendationId, action) {
    try {
      // Store locally for now
      const engagement = JSON.parse(localStorage.getItem('recommendation_engagement') || '{}');
      engagement[recommendationId] = {
        ...engagement[recommendationId],
        [action]: (engagement[recommendationId]?.[action] || 0) + 1,
        lastEngagement: new Date().toISOString()
      };
      localStorage.setItem('recommendation_engagement', JSON.stringify(engagement));
    } catch (error) {
      // In a real app, this would send to analytics service
    }
  }

  /**
   * Get fallback recommendations when analysis fails
   */
  getFallbackRecommendations() {
    return [
      {
        id: this.recommendationTypes.EMERGENCY_FUND,
        title: 'Build Emergency Fund',
        description: 'Start with $1,000 emergency fund for financial security',
        priority: 'high',
        impact: 'high',
        action: 'setup-automated-savings',
        icon: '🛡️',
        completed: false,
        progress: 0
      },
      {
        id: this.recommendationTypes.SPENDING_REVIEW,
        title: 'Review Your Spending',
        description: 'Track your expenses to identify optimization opportunities',
        priority: 'medium',
        impact: 'medium',
        action: 'review-spending',
        icon: '📊',
        completed: false,
        progress: 0
      }
    ];
  }
}

export { RecommendationEngine }; 