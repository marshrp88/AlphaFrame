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
import InsightCard from '../components/ui/InsightCard.jsx';
import { CheckCircle, Sparkles, TrendingUp, Zap, ArrowRight, X, Plus, BarChart3, Target } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import storageService from '../lib/services/StorageService';

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
  const [mockInsights, setMockInsights] = useState([]);

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
      
      // Generate mock insights if user has data
      if (rules.length > 0 || hasTransactions) {
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
          }
        ];
        setMockInsights(insights);
      }
    }
  }, [user]);

  const handleDismissBanner = () => {
    setShowSuccessBanner(false);
  };

  const handleCreateFirstRule = () => {
    console.log('Opening rule creation modal...');
    setShowRuleModal(true);
    console.log('Modal state set to:', true);
  };

  const handleRuleCreated = (newRule) => {
    setUserRules(prev => [...prev, newRule]);
    setHasData(true);
    setFirstRule(newRule);
    
    // Show success banner
    setShowSuccessBanner(true);
    
    // Hide success banner after 5 seconds
    setTimeout(() => setShowSuccessBanner(false), 5000);
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

  // Empty state component for when user has no data
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{ marginTop: '2rem' }}
    >
      <CompositeCard variant="elevated">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          {/* Empty State Illustration */}
          <div style={{ 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-secondary-100))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--color-primary-200)'
          }}>
            <BarChart3 size={48} style={{ color: 'var(--color-primary-600)' }} />
          </div>
          
          <h2 style={{ 
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
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
            maxWidth: '600px', 
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
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
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
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Target size={16} />
              Connect Accounts
            </StyledButton>
          </div>
          
          <div style={{ 
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-secondary)'
          }}>
            <p style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0
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
      style={{ marginTop: '2rem' }}
    >
      {/* Financial Insights Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          margin: '0 0 1.5rem 0'
        }}>
          Your Financial Insights
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {mockInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Rules Section */}
      <CompositeCard variant="elevated">
        <div style={{ padding: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              margin: 0
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
                gap: '0.5rem'
              }}
            >
              <Plus size={16} />
              Add Rule
            </StyledButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userRules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}>
                    {rule.name}
                  </h3>
                  <StatusBadge variant="success" size="sm">
                    <CheckCircle size={12} />
                    Active
                  </StatusBadge>
                </div>
                <p style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0'
                }}>
                  {rule.description || 'No description provided'}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  <span>Type: {rule.type.replace('_', ' ')}</span>
                  <span>Amount: ${rule.amount}</span>
                </div>
              </div>
            ))}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={24} style={{ color: 'var(--color-success-600)' }} />
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--color-success-800)', fontWeight: '600' }}>
                      Welcome to AlphaFrame! 🎉
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-success-700)' }}>
                      Your account is set up and ready. Let's create your first automated rule!
                    </p>
                  </div>
                </div>
                <StyledButton
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissBanner}
                  style={{ color: 'var(--color-success-600)' }}
                >
                  <X size={16} />
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
      </motion.div>
    </PageLayout>
  );
};

export default DashboardPage; 