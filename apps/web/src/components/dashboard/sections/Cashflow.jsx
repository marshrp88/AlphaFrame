import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { entranceAnimations, listAnimations } from '../../../lib/animations/animationPresets';
import './Cashflow.css';

/**
 * Cashflow - Displays income, expenses, and cash flow analysis
 * 
 * Purpose: Shows users their monthly cash flow with visual indicators
 * and actionable insights about their spending patterns.
 * 
 * Procedure:
 * 1. Displays income vs expenses breakdown
 * 2. Shows cash flow trends over time
 * 3. Highlights areas for optimization
 * 4. Provides actionable insights
 * 
 * Conclusion: Users understand their cash flow and can identify
 * opportunities to improve their financial situation.
 */
const Cashflow = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Animate in when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="cashflow-section">
        <h3>Cash Flow</h3>
        <p>Loading cash flow data...</p>
      </div>
    );
  }

  const {
    income = 0,
    expenses = 0,
    netFlow = 0,
    categories = {},
    trend = 'stable'
  } = data;

  const cashFlowRatio = income > 0 ? (expenses / income) * 100 : 0;
  const isHealthy = cashFlowRatio < 80; // Less than 80% expenses to income
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'var(--color-success)';
      case 'declining': return 'var(--color-error)';
      case 'stable': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <motion.div className={`cashflow-section ${isVisible ? 'visible' : ''}`} {...entranceAnimations.slideUp}>
      <header className="section-header">
        <h3>Cash Flow</h3>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button
            className={selectedPeriod === 'quarter' ? 'active' : ''}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarter
          </button>
        </div>
      </header>

      {/* Cash Flow Overview */}
      <motion.div className="cashflow-overview" {...listAnimations.staggerContainer}>
        <div className="flow-metrics">
          <motion.div className="metric income" {...listAnimations.staggerItem}>
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h4>Income</h4>
              <p className="amount">${income.toLocaleString()}</p>
            </div>
          </motion.div>
          <motion.div className="metric expenses" {...listAnimations.staggerItem}>
            <div className="metric-icon">💸</div>
            <div className="metric-content">
              <h4>Expenses</h4>
              <p className="amount">${expenses.toLocaleString()}</p>
            </div>
          </motion.div>
          <motion.div className="metric net-flow" {...listAnimations.staggerItem}>
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h4>Net Flow</h4>
              <p className={`amount ${netFlow >= 0 ? 'positive' : 'negative'}`}>
                {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Cash Flow Health Indicator */}
        <div className="health-indicator">
          <div className="health-bar">
            <div 
              className="health-fill"
              style={{ 
                width: `${Math.min(cashFlowRatio, 100)}%`,
                backgroundColor: isHealthy ? 'var(--color-success)' : 'var(--color-error)'
              }}
            ></div>
          </div>
          <p className="health-text">
            {isHealthy ? 'Healthy' : 'Needs Attention'} • {cashFlowRatio.toFixed(1)}% expenses
          </p>
        </div>
      </motion.div>

      {/* Savings Rate */}
      <div className="savings-rate">
        <h4>Savings Rate</h4>
        <div className="savings-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            ></div>
          </div>
          <span className="savings-percentage">{savingsRate.toFixed(1)}%</span>
        </div>
        <p className="savings-insight">
          {savingsRate >= 20 ? 'Excellent savings rate!' : 
           savingsRate >= 10 ? 'Good start, aim for 20%' : 
           'Consider increasing savings'}
        </p>
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div className="spending-categories">
          <h4>Top Spending Categories</h4>
          <div className="category-list">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">${amount.toLocaleString()}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ 
                      width: `${(amount / topCategories[0][1]) * 100}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Analysis */}
      <div className="trend-analysis">
        <div className="trend-header">
          <h4>Cash Flow Trend</h4>
          <span 
            className="trend-icon"
            style={{ color: getTrendColor(trend) }}
          >
            {getTrendIcon(trend)}
          </span>
        </div>
        <p className="trend-description">
          {trend === 'improving' && 'Your cash flow is improving! Keep up the good work.'}
          {trend === 'declining' && 'Your cash flow has declined. Review your spending patterns.'}
          {trend === 'stable' && 'Your cash flow is stable. Consider ways to increase savings.'}
        </p>
      </div>

      {/* Actionable Insights */}
      <div className="cashflow-insights">
        <h4>Insights</h4>
        <ul className="insights-list">
          {!isHealthy && (
            <li className="insight-item warning">
              ⚠️ Your expenses are high relative to income. Consider reducing non-essential spending.
            </li>
          )}
          {savingsRate < 10 && (
            <li className="insight-item warning">
              💡 Aim to save at least 10% of your income for financial security.
            </li>
          )}
          {savingsRate >= 20 && (
            <li className="insight-item success">
              🎉 Excellent savings rate! Consider investing excess funds.
            </li>
          )}
          {topCategories.length > 0 && topCategories[0][1] > income * 0.3 && (
            <li className="insight-item info">
              📊 {topCategories[0][0]} accounts for a large portion of your spending.
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default Cashflow; 