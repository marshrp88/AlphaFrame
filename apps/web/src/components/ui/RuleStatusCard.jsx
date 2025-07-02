import React from 'react';
import { motion } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';

const RuleStatusCard = ({ rule, executionResult }) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CompositeCard variant="elevated">
        <div style={{ 
          padding: '1.25rem',
          backgroundColor: getStatusColor(executionResult.status),
          border: `2px solid ${getStatusBorder(executionResult.status)}`,
          borderRadius: 'var(--radius-lg)'
        }}>
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
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${getStatusBorder(executionResult.status)}`
              }}>
                {getStatusIcon(executionResult.status)}
              </div>
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
                </p>
              </div>
            </div>
            <StatusBadge variant={getStatusVariant(executionResult.status)} size="sm">
              {getStatusLabel(executionResult.status)}
            </StatusBadge>
          </div>

          {/* Status Message */}
          <div style={{ 
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-primary)'
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
                <div style={{ 
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
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
                </div>
              )}

              {executionResult.metrics.threshold !== undefined && (
                <div style={{ 
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
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
                </div>
              )}

              {executionResult.metrics.percentageUsed !== undefined && (
                <div style={{ 
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
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
                </div>
              )}

              {executionResult.metrics.remaining !== undefined && (
                <div style={{ 
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-secondary)',
                  textAlign: 'center'
                }}>
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
                </div>
              )}
            </div>
          )}

          {/* Last Evaluated */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)'
          }}>
            <span>
              Last evaluated: {executionResult.lastEvaluated.toLocaleString()}
            </span>
            <span>
              {executionResult.matchedTransactions.length} transactions
            </span>
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

export default RuleStatusCard; 