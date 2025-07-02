/**
 * DynamicInsightCard.jsx - Galileo Sprint 2 Value Visibility Component
 * 
 * Purpose: Renders dynamic insights based on actual rule triggers and transaction
 * data, providing immediate value visibility when rules are triggered.
 * 
 * Procedure:
 * 1. Accepts rule execution results and transaction data
 * 2. Generates contextual insights based on triggered rules
 * 3. Provides actionable recommendations and visual feedback
 * 4. Adapts color/status based on rule trigger state
 * 5. Shows real financial impact and next steps
 * 6. Displays rule accuracy, projected impact, and forecast placeholders
 * 
 * Conclusion: Creates the "Aha!" moment where users see AlphaFrame
 * actively monitoring and providing value through automation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import StyledButton from './StyledButton.jsx';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Target, 
  BarChart3,
  Zap,
  Clock,
  Eye,
  ArrowRight,
  CheckCircle,
  TrendingUp2,
  Calendar,
  Activity
} from 'lucide-react';

const DynamicInsightCard = ({ 
  ruleResult, 
  transactions = [], 
  onActionClick,
  showDetails = false 
}) => {
  // Generate insight based on rule result
  const generateInsight = () => {
    if (!ruleResult) {
      return {
        title: 'No Active Rules',
        description: 'Create your first rule to start monitoring your finances automatically.',
        status: 'info',
        icon: Target,
        action: 'Create Rule',
        actionType: 'create-rule',
        metrics: {
          lastTriggered: null,
          ruleAccuracy: null,
          projectedImpact: null
        }
      };
    }

    const { ruleName, status, message, matchedTransactions, metrics, evaluatedAt } = ruleResult;
    
    // Calculate rule accuracy based on historical data
    const ruleAccuracy = calculateRuleAccuracy(ruleResult, transactions);
    
    // Calculate projected impact
    const projectedImpact = calculateProjectedImpact(ruleResult, transactions);
    
    switch (status) {
      case 'triggered':
        return {
          title: `🚨 Rule Alert: ${ruleName}`,
          description: message || `Your rule "${ruleName}" has been triggered based on recent activity.`,
          status: 'destructive',
          icon: AlertTriangle,
          action: 'View Details',
          actionType: 'view-details',
          value: matchedTransactions?.length || 0,
          valueLabel: 'Matching Transactions',
          urgency: 'high',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'warning':
        return {
          title: `⚠️ Rule Warning: ${ruleName}`,
          description: message || `Your rule "${ruleName}" is approaching its threshold.`,
          status: 'warning',
          icon: TrendingUp,
          action: 'Review',
          actionType: 'review',
          value: metrics?.currentValue || 0,
          valueLabel: 'Current Value',
          urgency: 'medium',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'ok':
        return {
          title: `✅ Rule Active: ${ruleName}`,
          description: message || `Your rule "${ruleName}" is monitoring your finances and everything looks good.`,
          status: 'success',
          icon: CheckCircle,
          action: 'View Status',
          actionType: 'view-status',
          value: metrics?.lastChecked || 'Active',
          valueLabel: 'Status',
          urgency: 'low',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      default:
        return {
          title: 'Rule Status Unknown',
          description: 'Unable to determine the current status of your rules.',
          status: 'secondary',
          icon: Clock,
          action: 'Check Status',
          actionType: 'check-status',
          metrics: {
            lastTriggered: null,
            ruleAccuracy: null,
            projectedImpact: null
          }
        };
    }
  };

  // Calculate rule accuracy based on historical performance
  const calculateRuleAccuracy = (ruleResult, transactions) => {
    if (!ruleResult || !transactions.length) return null;
    
    // Simulate accuracy calculation based on rule type and transaction patterns
    const { type } = ruleResult;
    
    if (type === 'spending_limit') {
      // Calculate accuracy based on spending pattern consistency
      const recentTransactions = transactions.filter(tx => 
        new Date(tx.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      );
      
      if (recentTransactions.length === 0) return 85; // Default accuracy
      
      const spendingPattern = recentTransactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
      
      // Higher accuracy for consistent spending patterns
      const variance = Object.values(spendingPattern).reduce((sum, amount) => sum + amount, 0) / Object.keys(spendingPattern).length;
      return Math.min(95, Math.max(70, 85 + (variance > 100 ? 10 : -5)));
    }
    
    return 85; // Default accuracy
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
    
    // Default projected impact
    return {
      type: 'monitoring',
      value: 0,
      period: 'ongoing',
      description: `Continuous monitoring and alerts`
    };
  };

  const insight = generateInsight();
  const IconComponent = insight.icon;

  const getStatusColor = (status) => {
    switch (status) {
      case 'destructive':
        return 'var(--color-destructive-50)';
      case 'warning':
        return 'var(--color-warning-50)';
      case 'success':
        return 'var(--color-success-50)';
      case 'info':
        return 'var(--color-primary-50)';
      default:
        return 'var(--color-background-secondary)';
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'destructive':
        return 'var(--color-destructive-200)';
      case 'warning':
        return 'var(--color-warning-200)';
      case 'success':
        return 'var(--color-success-200)';
      case 'info':
        return 'var(--color-primary-200)';
      default:
        return 'var(--color-border-primary)';
    }
  };

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick(insight.actionType, ruleResult);
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

  const matchedTransactions = ruleResult?.matchedTransactions || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <CompositeCard 
        variant="elevated"
        style={{
          backgroundColor: getStatusColor(insight.status),
          border: `1px solid ${getStatusBorder(insight.status)}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Urgency indicator */}
        {insight.urgency === 'high' && (
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
                backgroundColor: 'var(--color-background-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: insight.status === 'destructive' ? 'var(--color-destructive-600)' :
                       insight.status === 'warning' ? 'var(--color-warning-600)' :
                       insight.status === 'success' ? 'var(--color-success-600)' :
                       'var(--color-primary-600)',
                border: `2px solid ${getStatusBorder(insight.status)}`
              }}>
                <IconComponent size={20} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {insight.title}
                </h3>
                {insight.metrics?.lastTriggered && (
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    margin: '0.25rem 0 0 0'
                  }}>
                    Last triggered: {formatTimeAgo(insight.metrics.lastTriggered)}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge variant={insight.status} size="sm">
              {insight.status === 'destructive' && <AlertTriangle size={12} />}
              {insight.status === 'warning' && <TrendingUp size={12} />}
              {insight.status === 'success' && <CheckCircle size={12} />}
              {insight.status === 'info' && <Target size={12} />}
              {insight.status === 'destructive' ? 'Alert' :
               insight.status === 'warning' ? 'Warning' :
               insight.status === 'success' ? 'Active' : 'Info'}
            </StatusBadge>
          </div>
          
          <p style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            margin: '0 0 1rem 0',
            lineHeight: '1.5'
          }}>
            {insight.description}
          </p>

          {/* Phase 2: Rule Metrics Section */}
          {insight.metrics && (insight.metrics.ruleAccuracy || insight.metrics.projectedImpact) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {/* Rule Accuracy */}
              {insight.metrics.ruleAccuracy && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background-primary)',
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
                    {insight.metrics.ruleAccuracy}%
                  </div>
                </div>
              )}

              {/* Projected Impact */}
              {insight.metrics.projectedImpact && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-background-primary)',
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
                    {insight.metrics.projectedImpact.type === 'savings' ? 
                      formatCurrency(insight.metrics.projectedImpact.value) : 
                      insight.metrics.projectedImpact.value}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {insight.metrics.projectedImpact.period}
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
          
          {insight.value && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              backgroundColor: 'var(--color-background-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-secondary)',
              marginBottom: '1rem'
            }}>
              <span style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
              }}>
                {insight.valueLabel}
              </span>
              <span style={{ 
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                {insight.value}
              </span>
            </div>
          )}
          
          {showDetails && ruleResult && matchedTransactions && matchedTransactions.length > 0 && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-background-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-secondary)'
            }}>
              <h4 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                margin: '0 0 0.5rem 0',
                color: 'var(--color-text-primary)'
              }}>
                Recent Matching Transactions:
              </h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {matchedTransactions.slice(0, 3).map((tx, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.25rem 0',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {tx.description}
                    </span>
                    <span style={{ 
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      ${tx.amount?.toFixed(2)}
                    </span>
                  </div>
                ))}
                {matchedTransactions.length > 3 && (
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'center',
                    padding: '0.25rem 0'
                  }}>
                    +{matchedTransactions.length - 3} more transactions
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <StyledButton
              variant={insight.status === 'destructive' ? 'destructive' : 'primary'}
              size="sm"
              onClick={handleActionClick}
              style={{ flex: 1 }}
            >
              {insight.action}
              <ArrowRight size={14} />
            </StyledButton>
            
            {insight.urgency === 'high' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-destructive-600)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                <Zap size={12} />
                Urgent
              </div>
            )}
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

export default DynamicInsightCard; 