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
        description: "Your expenses exceed income. Let's review your spending patterns and identify areas for improvement.",
        priority: "high",
        action: "Review Budget",
        icon: AlertCircle,
        color: "var(--color-error-600)"
      };
    }
    
    if (netWorth?.current < 10000) {
      return {
        title: "Build Emergency Fund",
        description: "Focus on building your emergency savings to protect against unexpected expenses.",
        priority: "high",
        action: "Set Savings Goal",
        icon: Target,
        color: "var(--color-success-600)"
      };
    }
    
    if (insights?.currentTrajectory?.retirementAge > 65) {
      return {
        title: "Optimize Retirement",
        description: "Your retirement age can be improved with better planning and investment strategies.",
        priority: "medium",
        action: "Review Strategy",
        icon: TrendingUp,
        color: "var(--color-primary-600)"
      };
    }
    
    return {
      title: "Stay on Track",
      description: "You're doing great! Keep up the good financial habits and continue building wealth.",
      priority: "low",
      action: "View Progress",
      icon: CheckCircle,
      color: "var(--color-success-600)"
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

  const activities = data.recentChanges.changes.slice(0, 5);

  return (
    <motion.div 
      className="recent-activity"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <CompositeCard>
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id || index}
              className="activity-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <div className="activity-icon">
                {activity.type === 'income' ? '💰' : 
                 activity.type === 'expense' ? '💸' : 
                 activity.type === 'investment' ? '📈' : '📊'}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.description}</div>
                <div className="activity-description">{activity.category}</div>
              </div>
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </CompositeCard>
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard2 = () => {
  const { financialState, loading, error } = useFinancialState();
  const { userContext } = useUserContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh
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
      <div className="dashboard2-container">
        <div className="dashboard2-header">
          <h1 className="dashboard2-title">Financial Dashboard</h1>
          <p className="dashboard2-subtitle">Loading your financial data...</p>
        </div>
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <Loader2 className="animate-spin" size={48} />
            <p style={{ marginTop: 'var(--spacing-4)' }}>Loading your financial dashboard...</p>
          </div>
        </CompositeCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard2-container">
        <div className="dashboard2-header">
          <h1 className="dashboard2-title">Financial Dashboard</h1>
          <p className="dashboard2-subtitle">Unable to load your data</p>
        </div>
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <AlertCircle size={48} color="var(--color-error-600)" />
            <p style={{ marginTop: 'var(--spacing-4)' }}>Error loading dashboard data</p>
            <StyledButton onClick={handleRefresh} style={{ marginTop: 'var(--spacing-4)' }}>
              Try Again
            </StyledButton>
          </div>
        </CompositeCard>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard2-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard2-header">
        <h1 className="dashboard2-title">Financial Dashboard</h1>
        <p className="dashboard2-subtitle">
          Your financial clarity and next steps
        </p>
      </div>

      {/* WhatsNext Hero Section */}
      <WhatsNext 
        financialState={financialState}
        userContext={userContext}
      />

      {/* Main Dashboard Grid */}
      <div className="dashboard2-grid">
        <FinancialSummary data={financialState} />
        <QuickActions />
        <RecentActivity data={financialState} />
      </div>

      {/* Dashboard Footer */}
      <footer className="dashboard2-footer">
        <div className="footer-info">
          Last updated: {new Date().toLocaleString()}
        </div>
        <button 
          className="refresh-button"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </footer>
    </motion.div>
  );
};

export default Dashboard2; 