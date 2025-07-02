import React from 'react';
import { motion } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StatusBadge from './StatusBadge.jsx';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target, BarChart3 } from 'lucide-react';

const InsightCard = ({ insight }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CompositeCard variant="elevated">
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
                {getIcon(insight.type)}
              </div>
              <h3 style={{ 
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                {insight.title}
              </h3>
            </div>
            <StatusBadge variant={getStatusVariant(insight.status)} size="sm">
              {insight.status === 'positive' && <TrendingUp size={12} />}
              {insight.status === 'warning' && <AlertTriangle size={12} />}
              {insight.status === 'negative' && <TrendingDown size={12} />}
              {insight.statusLabel}
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
          
          {insight.value && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-secondary)'
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
          
          {insight.action && (
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
                💡 {insight.action}
              </p>
            </div>
          )}
        </div>
      </CompositeCard>
    </motion.div>
  );
};

export default InsightCard; 