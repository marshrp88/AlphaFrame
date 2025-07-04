/**
 * RuleStatusCard.jsx - Enhanced for Phase 3 Automation Feedback
 * 
 * Purpose: Displays real-time rule execution status with enhanced automation
 * feedback, hover states, tooltips, and micro-interactions for Phase 3.
 * 
 * Procedure:
 * 1. Display rule execution status with real-time updates
 * 2. Add hover states and tooltips for automation events
 * 3. Include micro-interactions for status changes
 * 4. Provide actionable feedback and next steps
 * 5. Show automation event history and guidance
 * 
 * Conclusion: Enhanced rule status display with comprehensive automation
 * feedback and user guidance for optimal automation setup.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  Info,
  Zap,
  Activity,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';

const RuleStatusCard = ({ 
  rule, 
  executionResult = { 
    status: 'unknown', 
    lastChecked: null,
    matchedTransactions: [],
    totalTransactions: 0,
    percentage: 0
  }, 
  onRuleAction,
  showDetails = false,
  isRealTime = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastStatus, setLastStatus] = useState(executionResult.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Phase 3: Real-time status change detection
  useEffect(() => {
    if (lastStatus !== executionResult.status) {
      setIsUpdating(true);
      setLastStatus(executionResult.status);
      
      // Show status change animation
      setTimeout(() => setIsUpdating(false), 1000);
    }
  }, [executionResult.status, lastStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'triggered':
        return <AlertTriangle size={20} style={{ color: 'var(--color-destructive-600)' }} />;
      case 'warning':
        return <TrendingUp size={20} style={{ color: 'var(--color-warning-600)' }} />;
      case 'ok':
        return <CheckCircle size={20} style={{ color: 'var(--color-success-600)' }} />;
      default:
        return <Clock size={20} style={{ color: 'var(--color-text-secondary)' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'triggered':
        return 'var(--color-destructive-50)';
      case 'warning':
        return 'var(--color-warning-50)';
      case 'ok':
        return 'var(--color-success-50)';
      default:
        return 'var(--color-background-secondary)';
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'triggered':
        return 'var(--color-destructive-200)';
      case 'warning':
        return 'var(--color-warning-200)';
      case 'ok':
        return 'var(--color-success-200)';
      default:
        return 'var(--color-border-primary)';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'triggered':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'ok':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'triggered':
        return 'Alert';
      case 'warning':
        return 'Warning';
      case 'ok':
        return 'All Clear';
      default:
        return 'Unknown';
    }
  };

  // Phase 3: Get automation guidance based on status
  const getAutomationGuidance = (status, rule) => {
    switch (status) {
      case 'triggered':
        return {
          title: 'Rule Triggered',
          message: `Your rule "${rule.name}" has been triggered. Review the transactions and consider adjusting your threshold if needed.`,
          action: 'Review Transactions',
          actionType: 'review-transactions'
        };
      case 'warning':
        return {
          title: 'Approaching Limit',
          message: `You're getting close to your spending limit. Consider reducing spending in this category.`,
          action: 'View Details',
          actionType: 'view-details'
        };
      case 'ok':
        return {
          title: 'Rule Active',
          message: `Your rule "${rule.name}" is working well. Consider creating additional rules for other categories.`,
          action: 'Create Another Rule',
          actionType: 'create-rule'
        };
      default:
        return {
          title: 'Rule Status Unknown',
          message: 'Unable to determine rule status. Check your rule configuration.',
          action: 'Check Settings',
          actionType: 'check-settings'
        };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
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

  const handleRuleAction = (actionType) => {
    if (onRuleAction) {
      onRuleAction(actionType, rule, executionResult);
    }
  };

  const guidance = getAutomationGuidance(executionResult.status, rule);

  return (
    <motion.div
      data-testid={`rule-item-${rule.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <CompositeCard variant="elevated">
        <div style={{ 
          padding: '1.25rem',
          backgroundColor: getStatusColor(executionResult.status),
          border: `2px solid ${getStatusBorder(executionResult.status)}`,
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Phase 3: Real-time update indicator */}
          {isUpdating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <RefreshCw size={12} style={{ color: 'white', animation: 'spin 1s linear infinite' }} />
            </motion.div>
          )}

          {/* Phase 3: Urgency pulse for triggered rules */}
          {executionResult.status === 'triggered' && (
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

          {/* Header */}
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
              <motion.div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${getStatusBorder(executionResult.status)}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                {getStatusIcon(executionResult.status)}
              </motion.div>
              <div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 0.25rem 0',
                  lineHeight: '1.3'
                }}>
                  {rule.name}
                </h3>
                <p style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {rule.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {isRealTime && (
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-primary-600)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      • Live
                    </span>
                  )}
                </p>
              </div>
            </div>
            <StatusBadge variant={getStatusVariant(executionResult.status)} size="sm">
              {getStatusLabel(executionResult.status)}
            </StatusBadge>
          </div>

          {/* Phase 3: Automation guidance tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  marginTop: '0.5rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <Info size={14} style={{ color: 'var(--color-primary-600)' }} />
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {guidance.title}
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.4'
                }}>
                  {guidance.message}
                </p>
                <button
                  onClick={() => {
                    handleRuleAction(guidance.actionType);
                    setShowTooltip(false);
                  }}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--color-primary-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {guidance.action}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Message */}
          <div style={{ 
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-primary)',
            transition: 'all 0.2s ease'
          }}>
            <p style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: '1.5',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {executionResult.message}
            </p>
          </div>

          {/* Metrics */}
          {executionResult.metrics && Object.keys(executionResult.metrics).length > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {executionResult.metrics.totalSpent !== undefined && (
                <motion.div 
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-secondary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRuleAction('view-spending')}
                >
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.25rem'
                  }}>
                    Total Spent
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {formatCurrency(executionResult.metrics.totalSpent)}
                  </div>
                </motion.div>
              )}

              {executionResult.metrics.threshold !== undefined && (
                <motion.div 
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-secondary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRuleAction('edit-rule')}
                >
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.25rem'
                  }}>
                    Limit
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {formatCurrency(executionResult.metrics.threshold)}
                  </div>
                </motion.div>
              )}

              {executionResult.metrics.percentageUsed !== undefined && (
                <motion.div 
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-secondary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRuleAction('view-progress')}
                >
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.25rem'
                  }}>
                    Used
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: executionResult.status === 'triggered' ? 'var(--color-destructive-600)' : 'var(--color-text-primary)'
                  }}>
                    {formatPercentage(executionResult.metrics.percentageUsed)}
                  </div>
                </motion.div>
              )}

              {executionResult.metrics.remaining !== undefined && (
                <motion.div 
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-secondary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRuleAction('view-remaining')}
                >
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.25rem'
                  }}>
                    Remaining
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-success-600)'
                  }}>
                    {formatCurrency(executionResult.metrics.remaining)}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Phase 3: Automation action buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => handleRuleAction('view-details')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: 'var(--font-size-xs)',
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <Eye size={12} />
              View Details
            </button>
            <button
              onClick={() => handleRuleAction('edit-rule')}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: 'var(--font-size-xs)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem'
              }}
            >
              <Settings size={12} />
              Edit Rule
            </button>
          </div>

          {/* Last Evaluated */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)'
          }}>
            <span>
              Last evaluated: {formatTimeAgo(executionResult.lastEvaluated)}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Activity size={10} />
              {executionResult.matchedTransactions.length} transactions
            </span>
          </div>
        </div>
      </CompositeCard>

      {/* Phase 3: CSS animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default RuleStatusCard; 