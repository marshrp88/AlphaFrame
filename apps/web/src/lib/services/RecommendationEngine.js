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
      INCOME_OPTIMIZATION: 'income-optimization'
    };
  }

  /**
   * Generate personalized recommendations based on financial state and user context
   */
  async generateRecommendations(financialState, userContext) {
    try {
      const recommendations = [];
      
      // Analyze emergency fund status
      const emergencyFundRec = this.analyzeEmergencyFund(financialState);
      if (emergencyFundRec) recommendations.push(emergencyFundRec);

      // Analyze debt situation
      const debtRec = this.analyzeDebtSituation(financialState);
      if (debtRec) recommendations.push(debtRec);

      // Analyze spending patterns
      const spendingRec = this.analyzeSpendingPatterns(financialState);
      if (spendingRec) recommendations.push(spendingRec);

      // Analyze savings goals
      const savingsRec = this.analyzeSavingsGoals(financialState);
      if (savingsRec) recommendations.push(savingsRec);

      // Analyze investment opportunities
      const investmentRec = this.analyzeInvestmentOpportunities(financialState);
      if (investmentRec) recommendations.push(investmentRec);

      // Sort by priority and impact
      return this.prioritizeRecommendations(recommendations);
    } catch (error) {
      return this.getFallbackRecommendations();
    }
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
    const savings = financialState?.savings || 0;
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
   * Prioritize recommendations by importance and impact
   */
  prioritizeRecommendations(recommendations) {
    const priorityScores = {
      high: 3,
      medium: 2,
      low: 1
    };

    const impactScores = {
      high: 3,
      medium: 2,
      low: 1
    };

    return recommendations.sort((a, b) => {
      const aScore = priorityScores[a.priority] + impactScores[a.impact];
      const bScore = priorityScores[b.priority] + impactScores[b.impact];
      return bScore - aScore; // Higher scores first
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