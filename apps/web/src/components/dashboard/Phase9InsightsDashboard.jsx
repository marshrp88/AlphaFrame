/**
 * Phase9InsightsDashboard.jsx - Real-Time Insights Dashboard
 * 
 * Purpose: Displays real-time insights from Phase 9 rule execution
 * and provides actionable next steps for users to complete their
 * automation journey.
 * 
 * Procedure:
 * 1. Connect to Phase9RuleIntegration for real insights
 * 2. Display insights in real-time with actionable buttons
 * 3. Track user interactions and journey completion
 * 4. Provide clear next steps for each insight
 * 5. Show user journey progress and success metrics
 * 
 * Conclusion: Enables users to see immediate value from their
 * automation rules and guides them toward complete success.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CompositeCard from '../ui/CompositeCard.jsx';
import StyledButton from '../ui/StyledButton.jsx';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Clock,
  Zap,
  Eye,
  BarChart3
} from 'lucide-react';
import { useToast } from '../ui/use-toast.jsx';
import Phase9RuleIntegration from '../../lib/services/Phase9RuleIntegration.js';
import './Phase9InsightsDashboard.css';

/**
 * Insight Card Component
 */
const InsightCard = ({ insight, onAction, onDismiss }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (insight.type) {
      case 'alert':
        return <AlertTriangle className="insight-icon alert" />;
      case 'success':
        return <CheckCircle className="insight-icon success" />;
      case 'info':
        return <Info className="insight-icon info" />;
      default:
        return <Info className="insight-icon" />;
    }
  };

  const handleAction = () => {
    if (insight.action?.url) {
      navigate(insight.action.url);
    }
    
    onAction(insight);
    
    toast({
      title: "Action Taken",
      description: insight.action?.description || "Processing your request...",
      variant: "default"
    });
  };

  const handleDismiss = () => {
    onDismiss(insight);
    
    toast({
      title: "Insight Dismissed",
      description: "We'll show you new insights as they come in.",
      variant: "default"
    });
  };

  return (
    <motion.div
      className={`insight-card ${insight.type}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CompositeCard>
        <div className="insight-header">
          <div className="insight-icon-container">
            {getIcon()}
          </div>
          <div className="insight-content">
            <h3 className="insight-title">{insight.title}</h3>
            <p className="insight-message">{insight.message}</p>
            <div className="insight-meta">
              <span className="insight-timestamp">
                <Clock size={14} />
                {new Date(insight.timestamp).toLocaleTimeString()}
              </span>
              {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                <span className="insight-metrics">
                  <BarChart3 size={14} />
                  {Object.entries(insight.metrics).map(([key, value]) => 
                    `${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`
                  ).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="insight-actions">
          {insight.action && (
            <StyledButton
              onClick={handleAction}
              className="insight-action-button"
              variant={insight.type === 'alert' ? 'destructive' : 'default'}
            >
              {insight.action.label}
              <ArrowRight size={16} />
            </StyledButton>
          )}
          <StyledButton
            onClick={handleDismiss}
            variant="outline"
            className="insight-dismiss-button"
          >
            Dismiss
          </StyledButton>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

/**
 * User Journey Progress Component
 */
const UserJourneyProgress = ({ journeyStatus }) => {
  const steps = [
    { key: 'onboardingComplete', label: 'Onboarding', icon: CheckCircle },
    { key: 'bankConnected', label: 'Bank Connected', icon: Zap },
    { key: 'ruleCreated', label: 'Rule Created', icon: Target },
    { key: 'ruleTriggered', label: 'Rule Triggered', icon: AlertTriangle },
    { key: 'insightGenerated', label: 'Insight Generated', icon: Eye },
    { key: 'dashboardAccessed', label: 'Dashboard Accessed', icon: TrendingUp }
  ];

  return (
    <CompositeCard className="journey-progress-card">
      <h3 className="section-title">Your Automation Journey</h3>
      <div className="journey-steps">
        {steps.map((step, index) => {
          const isCompleted = journeyStatus[step.key];
          const IconComponent = step.icon;
          
          return (
            <motion.div
              key={step.key}
              className={`journey-step ${isCompleted ? 'completed' : 'pending'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="step-icon">
                <IconComponent 
                  size={20} 
                  className={isCompleted ? 'completed-icon' : 'pending-icon'} 
                />
              </div>
              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-status">
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="journey-summary">
        <div className="completion-rate">
          <span className="rate-label">Completion Rate:</span>
          <span className="rate-value">{journeyStatus.completionRate.toFixed(0)}%</span>
        </div>
        <div className="steps-completed">
          <span className="steps-label">Steps Completed:</span>
          <span className="steps-value">{journeyStatus.completedSteps}/{journeyStatus.totalSteps}</span>
        </div>
      </div>
    </CompositeCard>
  );
};

/**
 * Success Metrics Component
 */
const SuccessMetrics = ({ metrics }) => {
  return (
    <CompositeCard className="success-metrics-card">
      <h3 className="section-title">Automation Performance</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-value">{metrics.activeRules}</div>
          <div className="metric-label">Active Rules</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics.triggeredRules}</div>
          <div className="metric-label">Rules Triggered</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics.insightsGenerated}</div>
          <div className="metric-label">Insights Generated</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics.ruleEffectiveness.toFixed(0)}%</div>
          <div className="metric-label">Effectiveness</div>
        </div>
      </div>
    </CompositeCard>
  );
};

/**
 * Main Phase 9 Insights Dashboard Component
 */
const Phase9InsightsDashboard = () => {
  const [ruleIntegration, setRuleIntegration] = useState(null);
  const [insights, setInsights] = useState([]);
  const [journeyStatus, setJourneyStatus] = useState({});
  const [successMetrics, setSuccessMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize Phase 9 integration
  useEffect(() => {
    const initializeIntegration = async () => {
      try {
        setIsLoading(true);
        
        const integration = new Phase9RuleIntegration();
        await integration.initialize('user_' + Date.now());
        
        // Start real-time evaluation
        await integration.startRealTimeEvaluation(30000);
        
        // Mark dashboard as accessed
        integration.markJourneyStepComplete('dashboardAccessed');
        
        setRuleIntegration(integration);
        
        // Initial data load
        setInsights(integration.getInsights());
        setJourneyStatus(integration.getUserJourneyStatus());
        setSuccessMetrics(integration.getSuccessMetrics());
        
        toast({
          title: "Automation Active",
          description: "Your rules are now monitoring your finances in real-time.",
          variant: "default"
        });
        
      } catch (error) {
        setError(error.message);
        toast({
          title: "Integration Error",
          description: "Failed to initialize automation. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeIntegration();

    // Cleanup on unmount
    return () => {
      if (ruleIntegration) {
        ruleIntegration.stopRealTimeEvaluation();
      }
    };
  }, []);

  // Update data periodically
  useEffect(() => {
    if (!ruleIntegration) return;

    const updateData = () => {
      setInsights(ruleIntegration.getInsights());
      setJourneyStatus(ruleIntegration.getUserJourneyStatus());
      setSuccessMetrics(ruleIntegration.getSuccessMetrics());
    };

    const interval = setInterval(updateData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [ruleIntegration]);

  const handleInsightAction = (insight) => {
    // Track user action
    if (ruleIntegration) {
      ruleIntegration.successMetrics.userActions++;
    }
  };

  const handleInsightDismiss = (insight) => {
    // Remove insight from list
    setInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  const handleCreateRule = () => {
    navigate('/onboarding?step=5');
  };

  if (isLoading) {
    return (
      <div className="phase9-loading">
        <CompositeCard>
          <div className="loading-content">
            <div className="loading-spinner" />
            <h3>Initializing Your Automation</h3>
            <p>Setting up real-time monitoring of your finances...</p>
          </div>
        </CompositeCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="phase9-error">
        <CompositeCard>
          <div className="error-content">
            <AlertTriangle className="error-icon" />
            <h3>Integration Error</h3>
            <p>{error}</p>
            <StyledButton onClick={() => window.location.reload()}>
              Retry
            </StyledButton>
          </div>
        </CompositeCard>
      </div>
    );
  }

  return (
    <div className="phase9-insights-dashboard">
      <div className="dashboard-header">
        <h1>Your Automation Insights</h1>
        <p>Real-time monitoring and actionable insights from your financial rules</p>
      </div>

      <div className="dashboard-grid">
        {/* User Journey Progress */}
        <div className="journey-section">
          <UserJourneyProgress journeyStatus={journeyStatus} />
        </div>

        {/* Success Metrics */}
        <div className="metrics-section">
          <SuccessMetrics metrics={successMetrics} />
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <div className="insights-header">
            <h2>Recent Insights</h2>
            <StyledButton onClick={handleCreateRule} variant="outline">
              Create New Rule
            </StyledButton>
          </div>

          <AnimatePresence>
            {insights.length > 0 ? (
              <div className="insights-list">
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onAction={handleInsightAction}
                    onDismiss={handleInsightDismiss}
                  />
                ))}
              </div>
            ) : (
              <CompositeCard className="no-insights">
                <div className="no-insights-content">
                  <Target className="no-insights-icon" />
                  <h3>No Insights Yet</h3>
                  <p>Create your first rule to start receiving automated insights about your finances.</p>
                  <StyledButton onClick={handleCreateRule}>
                    Create Your First Rule
                  </StyledButton>
                </div>
              </CompositeCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Phase9InsightsDashboard; 