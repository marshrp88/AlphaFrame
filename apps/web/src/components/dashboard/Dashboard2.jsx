import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFinancialState } from '../../core/store/financialStateStore';
import { useUserContext } from '../../core/hooks/useUserContext';
import CompositeCard from '../ui/CompositeCard';
import StyledButton from '../ui/StyledButton';
import { useToast } from '../ui/use-toast.jsx';
import { Loader2, RefreshCw, AlertCircle, TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';
import './Dashboard2.css';

/**
 * Dashboard 2.0 - Next Generation Financial Dashboard
 * 
 * Purpose: Provides users with a modern, grid-based dashboard layout
 * featuring the WhatsNext hero component and improved visual hierarchy.
 * 
 * Procedure:
 * 1. Uses CSS Grid for responsive layout
 * 2. Implements WhatsNext hero component for primary actions
 * 3. Organizes financial data in clear, actionable sections
 * 4. Applies motion animations for enhanced user experience
 * 
 * Conclusion: Delivers a cohesive, intuitive dashboard that guides
 * users toward their next financial actions with clear visual hierarchy.
 */

// WhatsNext Hero Component
const WhatsNext = ({ financialState, userContext }) => {
  const { toast } = useToast();
  
  // Determine the most important next action based on financial state
  const getNextAction = () => {
    if (!financialState) return null;
    
    const { cashflow, netWorth, insights } = financialState;
    
    // Priority-based action determination
    if (cashflow?.netFlow < 0) {
      return {
        title: "Address Cash Flow",
        description: "Your expenses exceed income. Let's review your spending.",
        priority: "high",
        action: "Review Budget",
        icon: AlertCircle,
        color: "var(--color-border-error)"
      };
    }
    
    if (netWorth?.current < 10000) {
      return {
        title: "Build Emergency Fund",
        description: "Focus on building your emergency savings first.",
        priority: "high",
        action: "Set Savings Goal",
        icon: Target,
        color: "var(--color-accent-500)"
      };
    }
    
    if (insights?.currentTrajectory?.retirementAge > 65) {
      return {
        title: "Optimize Retirement",
        description: "Your retirement age can be improved with better planning.",
        priority: "medium",
        action: "Review Strategy",
        icon: TrendingUp,
        color: "var(--color-primary-500)"
      };
    }
    
    return {
      title: "Stay on Track",
      description: "You're doing great! Keep up the good financial habits.",
      priority: "low",
      action: "View Progress",
      icon: CheckCircle,
      color: "var(--color-accent-500)"
    };
  };

  const nextAction = getNextAction();
  const IconComponent = nextAction?.icon || CheckCircle;

  return (
    <motion.div 
      className="whats-next-hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CompositeCard className="hero-card">
        <div className="hero-content">
          <div className="hero-icon" style={{ color: nextAction?.color }}>
            <IconComponent size={32} />
          </div>
          <div className="hero-text">
            <h2 className="hero-title">{nextAction?.title}</h2>
            <p className="hero-description">{nextAction?.description}</p>
          </div>
          <StyledButton 
            onClick={() => toast({
              title: "Action Initiated",
              description: `Starting: ${nextAction?.action}`,
              variant: "default"
            })}
            className="hero-action-button"
          >
            {nextAction?.action}
          </StyledButton>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

// Financial Summary Card
const FinancialSummary = ({ data }) => {
  if (!data) return null;

  return (
    <motion.div 
      className="financial-summary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CompositeCard>
        <h3 className="section-title">Financial Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Net Worth</span>
            <span className="summary-value">${data.netWorth?.current?.toLocaleString() || '0'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Monthly Cash Flow</span>
            <span className={`summary-value ${data.cashflow?.netFlow >= 0 ? 'positive' : 'negative'}`}>
              ${data.cashflow?.netFlow?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Savings Rate</span>
            <span className="summary-value">
              {data.cashflow?.income ? Math.round((data.cashflow.netFlow / data.cashflow.income) * 100) : 0}%
            </span>
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

// Quick Actions Card
const QuickActions = () => {
  const { toast } = useToast();
  
  const actions = [
    { title: "Add Transaction", icon: "➕", action: "add-transaction" },
    { title: "Set Goal", icon: "🎯", action: "set-goal" },
    { title: "Review Budget", icon: "📊", action: "review-budget" },
    { title: "Invest", icon: "📈", action: "invest" }
  ];

  return (
    <motion.div 
      className="quick-actions"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CompositeCard>
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          {actions.map((action, index) => (
            <motion.button
              key={action.action}
              className="action-button"
              onClick={() => toast({
                title: "Action Selected",
                description: `Starting: ${action.title}`,
                variant: "default"
              })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </CompositeCard>
    </motion.div>
  );
};

// Recent Activity Card
const RecentActivity = ({ data }) => {
  if (!data?.recentChanges?.changes) return null;

  return (
    <motion.div 
      className="recent-activity"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <CompositeCard>
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {data.recentChanges.changes.slice(0, 3).map((change, index) => (
            <motion.div 
              key={index}
              className="activity-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="activity-icon">
                {change.type === 'income' && <TrendingUp size={16} />}
                {change.type === 'expense' && <AlertCircle size={16} />}
                {change.type === 'savings' && <Target size={16} />}
              </div>
              <div className="activity-content">
                <span className="activity-title">{change.title}</span>
                <span className="activity-time">{change.timestamp}</span>
              </div>
              <span className={`activity-amount ${change.amount >= 0 ? 'positive' : 'negative'}`}>
                ${Math.abs(change.amount).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </CompositeCard>
    </motion.div>
  );
};

// Main Dashboard 2.0 Component
const Dashboard2 = () => {
  const { financialState, loading, error } = useFinancialState();
  const { userContext } = useUserContext();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="dashboard-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <h2>Loading Your Financial Dashboard</h2>
          <p>We're gathering your latest financial insights...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="dashboard-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Unable to Load Dashboard</h3>
          <p>{error.message}</p>
          <StyledButton onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </StyledButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="dashboard-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <header className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p>Your financial clarity and next steps</p>
      </header>

      {/* WhatsNext Hero Section */}
      <WhatsNext financialState={financialState} userContext={userContext} />

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        <FinancialSummary data={financialState} />
        <QuickActions />
        <RecentActivity data={financialState} />
      </div>
    </motion.div>
  );
};

export default Dashboard2; 