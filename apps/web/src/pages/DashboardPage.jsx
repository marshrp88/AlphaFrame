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
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout.jsx';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import StyledButton from '../components/ui/StyledButton.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { CheckCircle, Sparkles, TrendingUp, Zap, ArrowRight, X } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const DashboardPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [firstRule, setFirstRule] = useState(null);

  // Check for onboarding completion on mount
  useEffect(() => {
    if (location.state?.onboardingComplete) {
      setShowSuccessBanner(true);
      
      // Show welcome toast
      toast({
        title: "🎉 Welcome to AlphaFrame!",
        description: "Your account is set up and ready to go. Let's explore your financial insights!",
        variant: "default"
      });

      // Check for first rule creation
      if (location.state?.firstRuleCreated) {
        setFirstRule(location.state.firstRuleCreated);
      }

      // Clear the state to prevent showing banner on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  const handleDismissBanner = () => {
    setShowSuccessBanner(false);
  };

  const handleCreateFirstRule = () => {
    // Navigate to rules page with first rule creation mode
    window.location.href = '/rules?createFirst=true';
  };

  return (
    <PageLayout title="Dashboard" description="Your main financial overview and insights">
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
                  onClick={() => window.location.href = '/rules'}
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
                onClick={() => window.location.href = '/rules'}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <Zap size={20} style={{ marginBottom: '0.5rem' }} />
                <div>Manage Rules</div>
              </StyledButton>
              <StyledButton 
                variant="outline"
                onClick={() => window.location.href = '/profile'}
                style={{ padding: '1rem', textAlign: 'center' }}
              >
                <TrendingUp size={20} style={{ marginBottom: '0.5rem' }} />
                <div>View Profile</div>
              </StyledButton>
              <StyledButton 
                variant="outline"
                onClick={() => window.location.href = '/settings'}
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