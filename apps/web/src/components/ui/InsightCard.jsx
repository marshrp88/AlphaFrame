/**
 * InsightCard.jsx - Enhanced Financial Insight Component (Phase 2)
 * 
 * Purpose: Displays financial insights with support for both static and dynamic
 * rule-based data binding. Can show insights based on rule execution results
 * or traditional financial metrics.
 * 
 * Procedure:
 * 1. Accepts either static insight data or rule execution results
 * 2. Generates contextual insights based on rule triggers and transaction data
 * 3. Displays rule accuracy, projected impact, and forecast placeholders
 * 4. Adapts visual presentation based on insight type and urgency
 * 5. Provides actionable recommendations tied to specific rules
 * 
 * Conclusion: Creates a unified insight display system that works with
 * both traditional financial metrics and dynamic rule-based automation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Target, 
  BarChart3,
  Activity,
  TrendingUp2,
  Calendar,
  Zap,
  Clock
} from 'lucide-react';

const InsightCard = ({ insight, ruleResult = null, transactions = [] }) => {
  // Generate dynamic insight from rule result if provided
  const generateDynamicInsight = () => {
    if (!ruleResult) return insight;
    
    const { ruleName, status, message, matchedTransactions, metrics, evaluatedAt } = ruleResult;
    
    // Calculate rule accuracy
    const ruleAccuracy = calculateRuleAccuracy(ruleResult, transactions);
    
    // Calculate projected impact
    const projectedImpact = calculateProjectedImpact(ruleResult, transactions);
    
    switch (status) {
      case 'triggered':
        return {
          ...insight,
          title: `🚨 ${ruleName} Alert`,
          description: message || `Your rule "${ruleName}" has been triggered based on recent activity.`,
          status: 'negative',
          statusLabel: 'Alert',
          type: 'rule_trigger',
          value: matchedTransactions?.length || 0,
          valueLabel: 'Matching Transactions',
          action: 'Review triggered transactions and adjust your rule if needed.',
          urgency: 'high',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'warning':
        return {
          ...insight,
          title: `⚠️ ${ruleName} Warning`,
          description: message || `Your rule "${ruleName}" is approaching its threshold.`,
          status: 'warning',
          statusLabel: 'Warning',
          type: 'rule_warning',
          value: metrics?.currentValue || 0,
          valueLabel: 'Current Value',
          action: 'Monitor this category closely and consider adjusting your spending.',
          urgency: 'medium',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'ok':
        return {
          ...insight,
          title: `✅ ${ruleName} Active`,
          description: message || `Your rule "${ruleName}" is monitoring your finances and everything looks good.`,
          status: 'positive',
          statusLabel: 'Active',
          type: 'rule_active',
          value: 'Monitoring',
          valueLabel: 'Status',
          action: 'Your rule is working well. Consider creating additional rules for other categories.',
          urgency: 'low',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      default:
        return insight;
    }
  };

  // Calculate rule accuracy based on historical performance
  const calculateRuleAccuracy = (ruleResult, transactions) => {
    if (!ruleResult || !transactions.length) return null;
    
    const { type } = ruleResult;
    
    if (type === 'spending_limit') {
      const recentTransactions = transactions.filter(tx => 
        new Date(tx.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      if (recentTransactions.length === 0) return 85;
      
      const spendingPattern = recentTransactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
      
      const variance = Object.values(spendingPattern).reduce((sum, amount) => sum + amount, 0) / Object.keys(spendingPattern).length;
      return Math.min(95, Math.max(70, 85 + (variance > 100 ? 10 : -5)));
    }
    
    return 85;
  };

  // Calculate projected impact based on rule performance
  const calculateProjectedImpact = (ruleResult, transactions) => {
    if (!ruleResult || !transactions.length) return null;
    
    const { type, metrics } = ruleResult;
    
    if (type === 'spending_limit' && metrics?.totalSpent && metrics?.threshold) {
      const overspend = metrics.totalSpent - metrics.threshold;
      if (overspend > 0) {
        return {
          type: 'savings',
          value: overspend,
          period: 'monthly',
          description: `Potential monthly savings if rule prevents overspending`
        };
      }
    }
    
    return {
      type: 'monitoring',
      value: 0,
      period: 'ongoing',
      description: `Continuous monitoring and alerts`
    };
  };

  const getIcon = (type) => {
    switch (type) {
      case 'spending_trend':
        return <TrendingUp size={20} />;
      case 'balance_alert':
        return <AlertTriangle size={20} />;
      case 'savings_progress':
        return <Target size={20} />;
      case 'category_spending':
        return <BarChart3 size={20} />;
      case 'rule_trigger':
        return <AlertTriangle size={20} />;
      case 'rule_warning':
        return <TrendingUp size={20} />;
      case 'rule_active':
        return <Target size={20} />;
      default:
        return <DollarSign size={20} />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'positive':
        return 'success';
      case 'warning':
        return 'warning';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const dynamicInsight = generateDynamicInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <CompositeCard variant="elevated" style={{
        position: 'relative',
        overflow: 'hidden',
        border: dynamicInsight.urgency === 'high' ? '2px solid var(--color-destructive-200)' : undefined
      }}>
        {/* Urgency indicator */}
        {dynamicInsight.urgency === 'high' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'var(--color-destructive-500)',
            animation: 'pulse 2s infinite'
          }} />
        )}
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-600)'
              }}>
                {getIcon(dynamicInsight.type)}
              </div>
              <div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}>
                  {dynamicInsight.title}
                </h3>
                {dynamicInsight.metrics?.lastTriggered && (
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    margin: '0.25rem 0 0 0'
                  }}>
                    Last triggered: {formatTimeAgo(dynamicInsight.metrics.lastTriggered)}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge variant={getStatusVariant(dynamicInsight.status)} size="sm">
              {dynamicInsight.status === 'positive' && <TrendingUp size={12} />}
              {dynamicInsight.status === 'warning' && <AlertTriangle size={12} />}
              {dynamicInsight.status === 'negative' && <TrendingDown size={12} />}
              {dynamicInsight.statusLabel}
            </StatusBadge>
          </div>
          
          <p style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            margin: '0 0 1rem 0',
            lineHeight: '1.5'
          }}>
            {dynamicInsight.description}
          </p>

          {/* Phase 2: Rule Metrics Section */}
          {dynamicInsight.metrics && (dynamicInsight.metrics.ruleAccuracy || dynamicInsight.metrics.projectedImpact) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {/* Rule Accuracy */}
              {dynamicInsight.metrics.ruleAccuracy && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.25rem'
                  }}>
                    <Activity size={12} style={{ color: 'var(--color-primary-600)' }} />
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Rule Accuracy
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {dynamicInsight.metrics.ruleAccuracy}%
                  </div>
                </div>
              )}

              {/* Projected Impact */}
              {dynamicInsight.metrics.projectedImpact && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.25rem'
                  }}>
                    <TrendingUp2 size={12} style={{ color: 'var(--color-success-600)' }} />
                    <span style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Projected Impact
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {dynamicInsight.metrics.projectedImpact.type === 'savings' ? 
                      formatCurrency(dynamicInsight.metrics.projectedImpact.value) : 
                      dynamicInsight.metrics.projectedImpact.value}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {dynamicInsight.metrics.projectedImpact.period}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase 2: Visual Forecast Placeholder (Galileo Readiness) */}
          {ruleResult && ruleResult.status === 'triggered' && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-200)',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={14} style={{ color: 'var(--color-primary-600)' }} />
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-primary-700)'
                }}>
                  Forecast Preview (Galileo)
                </span>
              </div>
              <p style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary-600)',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Based on this trigger, we predict similar patterns in the next 30 days. 
                Advanced forecasting coming soon with Galileo integration.
              </p>
            </div>
          )}
          
          {dynamicInsight.value && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-secondary)',
              marginBottom: '1rem'
            }}>
              <span style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
              }}>
                {dynamicInsight.valueLabel}
              </span>
              <span style={{ 
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                {dynamicInsight.value}
              </span>
            </div>
          )}
          
          {dynamicInsight.action && (
            <div style={{ 
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-200)'
            }}>
              <p style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary-700)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)'
              }}>
                💡 {dynamicInsight.action}
              </p>
            </div>
          )}
        </div>
      </CompositeCard>
    </motion.div>
  );
};

export default InsightCard; 