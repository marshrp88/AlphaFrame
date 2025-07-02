/**
 * DashboardPage.jsx - Phoenix Initiative V3.1
 * 
 * Purpose: Main dashboard with onboarding success handling and first rule display
 * to create the "Aha!" moment for new users.
 * 
 * Procedure:
 * 1. Check for onboarding completion state from navigation
 * 2. Display success banner for new users
 * 3. Show first rule creation if available
 * 4. Provide clear next steps and value demonstration
 * 5. Use consistent PageLayout and design system components
 * 
 * Conclusion: Creates immediate value visibility and user delight
 * for first-time users completing onboarding.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import PageLayout from '../components/PageLayout.jsx';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import StyledButton from '../components/ui/StyledButton.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import RuleCreationModal from '../components/ui/RuleCreationModal.jsx';
import RuleStatusCard from '../components/ui/RuleStatusCard.jsx';
import InsightCard from '../components/ui/InsightCard.jsx';
import DynamicInsightCard from '../components/ui/DynamicInsightCard.jsx';
import { CheckCircle, Sparkles, TrendingUp, Zap, ArrowRight, X, Plus, BarChart3, Target, AlertTriangle, Crown } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import storageService from '../lib/services/StorageService';
import ruleExecutionEngine from '../lib/services/RuleExecutionEngine.js';
import { getMockTransactions } from '../lib/mock/transactions.js';

import { DollarSign, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { toast } = useToast();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [firstRule, setFirstRule] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [userRules, setUserRules] = useState([]);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);
  const [mockInsights, setMockInsights] = useState([]);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [ruleExecutionResults, setRuleExecutionResults] = useState([]);
  const [ruleSummary, setRuleSummary] = useState(null);
  const [engineStatus, setEngineStatus] = useState({});
  const [recentTriggers, setRecentTriggers] = useState([]);

  // Check for onboarding completion and first rule creation
  useEffect(() => {
    if (location.state?.onboardingComplete) {
      setShowSuccessBanner(true);
      
      // Show welcome toast
      toast({
        title: "🎉 Welcome to AlphaFrame!",
        description: "Your account is set up and ready to go!",
        variant: "default"
      });
    }
    
    if (location.state?.firstRuleCreated) {
      setFirstRule(location.state.firstRuleCreated);
    }

    // Check if user is returning (has completed onboarding but no state passed)
    const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete');
    if (onboardingComplete === 'true' && !location.state?.onboardingComplete) {
      setShowWelcomeBack(true);
      
      // Show welcome back toast
      toast({
        title: "👋 Welcome Back!",
        description: "Great to see you again. Your dashboard is ready.",
        variant: "default"
      });
      
      // Hide welcome back banner after 5 seconds
      setTimeout(() => setShowWelcomeBack(false), 5000);
    }
  }, [location.state, toast]);

  // Check if user has any data (rules, transactions, etc.)
  useEffect(() => {
    if (user?.sub) {
      // Set user ID for storage isolation
      storageService.setUserId(user.sub);
      
      // Check for user data using enhanced service
      const rules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
      const hasTransactions = storageService.getItem('alphaframe_user_transactions');
      
      setUserRules(rules);
      setHasData(rules.length > 0 || hasTransactions);
      
      // Load mock transactions for rule evaluation
      const mockTransactions = getMockTransactions();
      setTransactions(mockTransactions);
      
      // Initialize and start rule execution engine
      const initializeEngine = async () => {
        try {
          // Initialize the engine with user rules and transactions
          await ruleExecutionEngine.initialize(rules, mockTransactions);
          
          // Start periodic evaluation
          await ruleExecutionEngine.startPeriodicEvaluation(30000); // 30 seconds
          
          // Get initial evaluation results
          const evaluation = await ruleExecutionEngine.evaluateAllRules();
          setRuleExecutionResults(evaluation.results);
          setRuleSummary(evaluation.summary);
          setEngineStatus(ruleExecutionEngine.getStatus());
          setRecentTriggers(ruleExecutionEngine.getRecentTriggers(24));
          
          // Show alerts for new triggers
          if (evaluation.newTriggers.length > 0) {
            evaluation.newTriggers.forEach(trigger => {
              toast({
                title: `🚨 Rule Alert: ${trigger.ruleName}`,
                description: trigger.message,
                variant: "destructive"
              });
            });
          }
        } catch (error) {
          console.error('Failed to initialize rule engine:', error);
          toast({
            title: "⚠️ Rule Engine Error",
            description: "Unable to start automated monitoring. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      };
      
      if (rules.length > 0) {
        initializeEngine();
      }
      
      // ALWAYS show insights - NEVER EMPTY DASHBOARD
      const insights = [
        {
          id: 1,
          type: 'spending_trend',
          title: 'Spending Trend',
          description: 'Your spending is 15% lower this month compared to last month. Great job staying on budget!',
          status: 'positive',
          statusLabel: 'Improving',
          value: '$2,450',
          valueLabel: 'This Month',
          action: 'Keep up the good work! Consider setting a savings goal.'
        },
        {
          id: 2,
          type: 'balance_alert',
          title: 'Account Balance',
          description: 'Your checking account balance is healthy. You have sufficient funds for upcoming expenses.',
          status: 'positive',
          statusLabel: 'Good',
          value: '$8,750',
          valueLabel: 'Current Balance',
          action: 'Consider moving excess funds to savings for better returns.'
        },
        {
          id: 3,
          type: 'category_spending',
          title: 'Top Spending Category',
          description: 'Food & Dining is your highest spending category this month.',
          status: 'warning',
          statusLabel: 'Monitor',
          value: '$650',
          valueLabel: 'Food & Dining',
          action: 'Review your dining out habits and consider cooking more at home.'
        },
        {
          id: 4,
          type: 'savings_progress',
          title: 'Savings Progress',
          description: 'You\'re on track to reach your emergency fund goal by the end of the year.',
          status: 'positive',
          statusLabel: 'On Track',
          value: '75%',
          valueLabel: 'Goal Progress',
          action: 'Continue your current savings rate to reach your target.'
        }
      ];
      setMockInsights(insights);
    }
  }, [user, toast]);

  // Cleanup rule engine on unmount
  useEffect(() => {
    return () => {
      ruleExecutionEngine.stopPeriodicEvaluation();
    };
  }, []);

  const handleDismissBanner = () => {
    setShowOnboardingBanner(false);
    localStorage.setItem('alphaframe_onboarding_banner_dismissed', 'true');
  };

  const handleDismissWelcomeBack = () => {
    setShowWelcomeBack(false);
    localStorage.setItem('alphaframe_welcome_back_dismissed', 'true');
  };

  const handleCreateFirstRule = () => {
    console.log('Opening rule creation modal...');
    setShowRuleModal(true);
    console.log('Modal state set to:', true);
    
    // Show immediate feedback
    toast({
      title: "Creating Your First Rule",
      description: "Let's set up automated financial monitoring for you.",
      variant: "default"
    });
  };

  const handleRuleCreated = async (newRule) => {
    setUserRules(prev => [...prev, newRule]);
    setHasData(true);
    setFirstRule(newRule);
    
    // Add rule to execution engine
    try {
      const evaluation = await ruleExecutionEngine.addRule(newRule);
      setRuleExecutionResults(evaluation.results);
      setRuleSummary(evaluation.summary);
      setEngineStatus(ruleExecutionEngine.getStatus());
      setRecentTriggers(ruleExecutionEngine.getRecentTriggers(24));
      
      // Show success banner
      setShowSuccessBanner(true);
      
      // Show success toast
      toast({
        title: "✅ Rule Created Successfully!",
        description: "Your rule is now active and monitoring your finances.",
        variant: "default"
      });
      
      // Hide success banner after 5 seconds
      setTimeout(() => setShowSuccessBanner(false), 5000);
    } catch (error) {
      console.error('Failed to add rule to engine:', error);
      toast({
        title: "⚠️ Rule Creation Error",
        description: "Rule was created but there was an issue with the monitoring system.",
        variant: "destructive"
      });
    }
  };

  const handleConnectAccounts = () => {
    setIsLoading(true);
    // Navigate to onboarding using SPA navigation
    navigate('/onboarding');
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleGoToRules = () => {
    setIsLoading(true);
    // Navigate to rules using SPA navigation
    navigate('/rules');
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleGoToProfile = () => {
    setIsLoading(true);
    // Navigate to profile using SPA navigation
    navigate('/profile');
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleGoToSettings = () => {
    setIsLoading(true);
    // Navigate to settings using SPA navigation
    navigate('/settings');
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleEditRule = (rule) => {
    // Navigate to rules page with edit mode
    navigate('/rules', { state: { editRule: rule } });
  };

  const handleDeleteRule = async (ruleId) => {
    const updatedRules = userRules.filter(rule => rule.id !== ruleId);
    setUserRules(updatedRules);
    localStorage.setItem('alphaframe_user_rules', JSON.stringify(updatedRules));
    
    // Remove rule from execution engine
    try {
      await ruleExecutionEngine.removeRule(ruleId);
      setEngineStatus(ruleExecutionEngine.getStatus());
      setRecentTriggers(ruleExecutionEngine.getRecentTriggers(24));
    } catch (error) {
      console.error('Failed to remove rule from engine:', error);
    }
    
    toast({
      title: "Rule Deleted",
      description: "Your rule has been successfully removed.",
      variant: "default"
    });
  };

  const handleInsightAction = (actionType, ruleResult) => {
    switch (actionType) {
      case 'create-rule':
        setShowRuleModal(true);
        break;
      case 'view-details':
        // Navigate to rules page with rule details
        navigate('/rules', { state: { selectedRule: ruleResult } });
        break;
      case 'review':
        // Show rule review modal or navigate to rules
        navigate('/rules', { state: { reviewRule: ruleResult } });
        break;
      case 'view-status':
        // Show detailed rule status
        toast({
          title: "Rule Status",
          description: `Rule "${ruleResult.ruleName}" is actively monitoring your finances.`,
          variant: "default"
        });
        break;
      case 'check-status':
        // Refresh rule evaluation
        ruleExecutionEngine.evaluateAllRules().then(evaluation => {
          setRuleExecutionResults(evaluation.results);
          setRuleSummary(evaluation.summary);
          toast({
            title: "Status Updated",
            description: "Rule evaluation completed successfully.",
            variant: "default"
        });
        });
        break;
      default:
        console.log('Unknown insight action:', actionType);
    }
  };

  // Empty state component for when user has no data
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ marginTop: '1rem' }}
    >
      <CompositeCard variant="elevated">
        <div style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          {/* Empty State Illustration */}
          <div style={{ 
            width: '100px', 
            height: '100px', 
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-secondary-100))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--color-primary-200)'
          }}>
            <BarChart3 size={40} style={{ color: 'var(--color-primary-600)' }} />
          </div>
          
          <h2 style={{ 
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
            lineHeight: '1.2'
          }}>
            Welcome to Your Financial Dashboard
          </h2>
          
          <p style={{ 
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Your dashboard will show your financial insights, automated rules, and spending patterns. 
            Let's get started by creating your first rule or connecting your accounts.
          </p>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center', 
            maxWidth: '500px', 
            margin: '0 auto' 
          }}>
            <StyledButton 
              onClick={() => { 
                console.log('CTA: Create First Rule clicked');
                handleCreateFirstRule();
              }}
              style={{ 
                background: 'var(--color-primary-600)',
                color: 'white',
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              <Zap size={16} />
              Create First Rule
            </StyledButton>
            
            <StyledButton 
              variant="outline"
              onClick={() => { 
                console.log('CTA: Connect Accounts clicked');
                handleConnectAccounts();
              }}
              style={{ 
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              <Target size={16} />
              Connect Accounts
            </StyledButton>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-secondary)',
            maxWidth: '400px',
            margin: '1.5rem auto 0'
          }}>
            <p style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              💡 <strong>Tip:</strong> Start with a simple spending limit rule to see how AlphaFrame monitors your finances automatically.
            </p>
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );

  // Rules display component for when user has rules
  const RulesDisplay = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ marginTop: '1rem' }}
    >
              {/* Financial Insights Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: '1.2'
            }}>
              Your Financial Insights
            </h2>
            {engineStatus.isRunning && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-success-50)',
                color: 'var(--color-success-700)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                border: '1px solid var(--color-success-200)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success-500)',
                  animation: 'pulse 2s infinite'
                }} />
                Auto-monitoring Active
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                border: '1px solid var(--color-primary-200)'
              }}>
                <Crown size={12} />
                Pro Features
              </div>
              <StyledButton
                variant="primary"
                size="sm"
                onClick={() => navigate('/upgrade')}
                style={{ 
                  fontSize: 'var(--font-size-xs)',
                  padding: '0.25rem 0.75rem'
                }}
              >
                Upgrade
                <ArrowRight size={12} />
              </StyledButton>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* Generate insights array - always show at least 3 insights */}
            {(() => {
              const insights = [];
              
              // 1. Show dynamic insights based on rule execution results
              if (ruleExecutionResults.length > 0) {
                ruleExecutionResults.forEach((result) => {
                  insights.push(
                    <DynamicInsightCard
                      key={result.ruleId}
                      ruleResult={result}
                      transactions={transactions}
                      onActionClick={handleInsightAction}
                      showDetails={result.status === 'triggered'}
                    />
                  );
                });
              }
              
              // 2. Show default insight when no rules are active
              if (insights.length === 0) {
                insights.push(
                  <DynamicInsightCard
                    key="no-rules"
                    ruleResult={null}
                    transactions={transactions}
                    onActionClick={handleInsightAction}
                  />
                );
              }
              
              // 3. Add system insights to ensure at least 3 cards
              if (insights.length < 3) {
                // Add spending overview insight
                const totalSpent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
                insights.push(
                  <CompositeCard key="spending-overview" variant="elevated">
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <BarChart3 size={24} style={{ color: 'var(--color-primary-600)' }} />
                        <h3 style={{ 
                          fontSize: 'var(--font-size-base)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                          margin: 0
                        }}>
                          Spending Overview
                        </h3>
                      </div>
                      <p style={{ 
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '1rem'
                      }}>
                        You've spent ${totalSpent.toFixed(2)} this month across {transactions.length} transactions.
                      </p>
                      <StyledButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleInsightAction('view-spending', { type: 'spending-overview' })}
                      >
                        View Details
                        <ArrowRight size={14} />
                      </StyledButton>
                    </div>
                  </CompositeCard>
                );
              }
              
              // 4. Add account balance insight if we still need more
              if (insights.length < 3) {
                const checkingBalance = 5000; // Mock data
                insights.push(
                  <CompositeCard key="account-balance" variant="elevated">
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <DollarSign size={24} style={{ color: 'var(--color-success-600)' }} />
                        <h3 style={{ 
                          fontSize: 'var(--font-size-base)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                          margin: 0
                        }}>
                          Account Balance
                        </h3>
                      </div>
                      <p style={{ 
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '1rem'
                      }}>
                        Your checking account balance is ${checkingBalance.toFixed(2)}.
                      </p>
                      <StyledButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleInsightAction('view-balance', { type: 'account-balance' })}
                      >
                        View Details
                        <ArrowRight size={14} />
                      </StyledButton>
                    </div>
                  </CompositeCard>
                );
              }
              
              return insights;
            })()}
            
            {/* Show recent triggers if any */}
            {recentTriggers.length > 0 && (
              <CompositeCard variant="elevated" style={{
                backgroundColor: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border-secondary)'
              }}>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    margin: '0 0 0.5rem 0',
                    color: 'var(--color-text-primary)'
                  }}>
                    Recent Activity
                  </h3>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {recentTriggers.slice(0, 3).map((trigger, index) => (
                      <div key={index} style={{ marginBottom: '0.25rem' }}>
                        {trigger.ruleName}: {trigger.message}
                      </div>
                    ))}
                  </div>
                </div>
              </CompositeCard>
            )}
          </div>
        </div>

      {/* Rules Section */}
      <CompositeCard variant="elevated">
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: '1.2'
            }}>
              Your Active Rules ({userRules.length})
            </h2>
            <StyledButton
              onClick={handleCreateFirstRule}
              size="sm"
              style={{
                background: 'var(--color-primary-600)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              <Plus size={16} />
              Add Rule
            </StyledButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {userRules.map((rule) => {
              const executionResult = ruleExecutionResults.find(r => r.ruleId === rule.id);
              return (
                <RuleStatusCard
                  key={rule.id}
                  rule={rule}
                  executionResult={executionResult}
                  onEdit={() => handleEditRule(rule)}
                  onDelete={() => handleDeleteRule(rule.id)}
                />
              );
            })}
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );

  return (
    <PageLayout title="Dashboard" description="Your main financial overview and insights">
      {/* Rule Creation Modal - Render at top level */}
      <RuleCreationModal
        isOpen={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        onRuleCreated={handleRuleCreated}
      />
      
      <AnimatePresence>
        {/* Success Banner for New Users */}
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '2rem' }}
          >
            <CompositeCard variant="elevated" style={{ 
              background: 'linear-gradient(135deg, var(--color-success-50), var(--color-primary-50))',
              border: '2px solid var(--color-success-200)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={24} style={{ color: 'var(--color-success-600)' }} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-success-800)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      🎉 Welcome to AlphaFrame!
                    </h3>
                    <p style={{ 
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-success-700)',
                      margin: 0
                    }}>
                      Your account is set up and ready to go! Start by creating your first rule.
                    </p>
                  </div>
                </div>
                <StyledButton
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissBanner}
                  style={{ color: 'var(--color-success-600)' }}
                >
                  <X size={20} />
                </StyledButton>
              </div>
            </CompositeCard>
          </motion.div>
        )}

        {/* Welcome Back Banner for Returning Users */}
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '2rem' }}
          >
            <CompositeCard variant="elevated" style={{ 
              background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-secondary-50))',
              border: '2px solid var(--color-primary-200)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={24} style={{ color: 'var(--color-primary-600)' }} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-primary-800)',
                      margin: '0 0 0.25rem 0'
                    }}>
                      👋 Welcome Back!
                    </h3>
                    <p style={{ 
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-primary-700)',
                      margin: 0
                    }}>
                      Great to see you again. Your dashboard is ready with your latest insights.
                    </p>
                  </div>
                </div>
                <StyledButton
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissWelcomeBack}
                  style={{ color: 'var(--color-primary-600)' }}
                >
                  <X size={20} />
                </StyledButton>
              </div>
            </CompositeCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem'
            }}>
              Financial Dashboard
            </h1>
            <p style={{ 
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem'
            }}>
              Your intelligent financial overview and insights
            </p>
          </div>
        </CompositeCard>

        {/* Main Content */}
        {hasData ? (
          <RulesDisplay />
        ) : (
          <EmptyState />
        )}

        {/* First Rule Creation Section for New Users */}
        {showSuccessBanner && !firstRule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: '2rem' }}
          >
            <CompositeCard variant="elevated">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Zap size={48} style={{ 
                  color: 'var(--color-primary-600)', 
                  marginBottom: '1rem' 
                }} />
                <h2 style={{ 
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem'
                }}>
                  Create Your First Rule
                </h2>
                <p style={{ 
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem'
                }}>
                  Start automating your finances by creating your first FrameSync rule. 
                  Monitor your accounts and get intelligent insights automatically.
                </p>
                <StyledButton 
                  onClick={handleCreateFirstRule}
                  style={{ 
                    background: 'var(--color-primary-600)',
                    color: 'white',
                    padding: '0.75rem 2rem'
                  }}
                >
                  <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
                  Create First Rule
                  <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </StyledButton>
              </div>
            </CompositeCard>
          </motion.div>
        )}

        {/* First Rule Display (if created) */}
        {firstRule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ marginTop: '2rem' }}
          >
            <CompositeCard variant="elevated">
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <TrendingUp size={24} style={{ color: 'var(--color-success-600)' }} />
                  <h3 style={{ 
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}>
                    Your First Rule is Active!
                  </h3>
                  <StatusBadge variant="success" size="sm">
                    Active
                  </StatusBadge>
                </div>
                <p style={{ 
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '1rem'
                }}>
                  {firstRule.description || "Your automated financial rule is now monitoring your accounts and will provide insights based on your preferences."}
                </p>
                <StyledButton 
                  variant="secondary"
                  onClick={handleGoToRules}
                >
                  View All Rules
                </StyledButton>
              </div>
            </CompositeCard>
          </motion.div>
        )}

        {/* Quick Actions for All Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ marginTop: '2rem' }}
        >
          <CompositeCard>
            <h3 style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: '1.5rem'
            }}>
              Quick Actions
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <StyledButton 
                variant="outline"
                onClick={handleGoToRules}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <Zap size={20} style={{ marginBottom: '0.5rem' }} />
                <div>Manage Rules</div>
              </StyledButton>
              <StyledButton 
                variant="outline"
                onClick={handleGoToProfile}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <TrendingUp size={20} style={{ marginBottom: '0.5rem' }} />
                <div>View Profile</div>
              </StyledButton>
              <StyledButton 
                variant="outline"
                onClick={handleGoToSettings}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <Sparkles size={20} style={{ marginBottom: '0.5rem' }} />
                <div>Settings</div>
              </StyledButton>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Rule Summary */}
        {ruleSummary && (
          <div className="rule-summary" style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              margin: '0 0 1rem 0'
            }}>
              Rule Execution Summary
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--color-primary-50)',
                border: '1px solid var(--color-primary-200)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary-600)',
                  marginBottom: '0.5rem'
                }}>
                  {ruleSummary.totalRules}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Total Rules
                </div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: ruleSummary.hasAlerts ? 'var(--color-destructive-50)' : 'var(--color-success-50)',
                border: `1px solid ${ruleSummary.hasAlerts ? 'var(--color-destructive-200)' : 'var(--color-success-200)'}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: ruleSummary.hasAlerts ? 'var(--color-destructive-600)' : 'var(--color-success-600)',
                  marginBottom: '0.5rem'
                }}>
                  {ruleSummary.triggeredRules}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Rules Triggered
                </div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--color-muted-50)',
                border: '1px solid var(--color-muted-200)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-muted-600)',
                  marginBottom: '0.5rem'
                }}>
                  {ruleSummary.totalTransactions}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  Transactions Analyzed
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
};

export default DashboardPage; 