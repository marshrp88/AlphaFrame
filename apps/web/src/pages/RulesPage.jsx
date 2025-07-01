/**
 * RulesPage.jsx - AlphaFrame VX.1 Consumer-Ready Rules Management
 * 
 * Purpose: Provides users with a clean, intuitive interface for creating
 * and managing automated financial rules using the FrameSync system.
 * 
 * Procedure:
 * 1. Uses PageLayout for consistent page structure
 * 2. Implements CompositeCard for content organization
 * 3. Uses StyledButton for consistent button styling
 * 4. Applies motion animations for enhanced UX
 * 5. Integrates toast notifications for user feedback
 * 6. Uses design system components for professional appearance
 * 
 * Conclusion: Delivers a cohesive, modern rules management interface
 * that guides users through rule creation and management.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RuleBinderRoot from '../components/framesync/RuleBinderRoot';
import StyledButton from '../components/ui/StyledButton';
import CompositeCard from '../components/ui/CompositeCard';
import StatusBadge from '../components/ui/StatusBadge';
import PageLayout from '../components/PageLayout';
import { useToast } from '../components/ui/use-toast.jsx';
import { Plus, X, Settings, Zap, Shield, TrendingUp } from 'lucide-react';
import './RulesPage.css';
import env from '../lib/env.js';

// Error Catcher Component to catch runtime exceptions
const ErrorCatcher = ({ children }) => {
  try {
    return children;
  } catch (err) {
    return <div data-testid="error-caught">Error rendered: {err.message}</div>;
  }
};

const RulesPage = () => {
  const [showRuleBinder, setShowRuleBinder] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const { toast } = useToast();

  // Diagnostic logging and test mode setup
  useEffect(() => {
    // Set test mode for development
    if (import.meta.env.DEV) {
      localStorage.setItem('test_mode', 'true');
    }
  }, []);

  const handleCreateRule = () => {
    setCurrentRule({
      id: `rule_${Date.now()}`,
      trigger: 'checking_account_balance > 5000',
      action: '',
      enabled: true
    });
    setShowRuleBinder(true);
    
    toast({
      title: "Creating New Rule",
      description: "Opening rule builder...",
      variant: "default"
    });
  };

  const handleConfigurationChange = () => {
    setShowRuleBinder(false);
    toast({
      title: "Rule Updated",
      description: "Your rule has been saved successfully.",
      variant: "default"
    });
  };

  const handleCancel = () => {
    setShowRuleBinder(false);
    setCurrentRule(null);
    toast({
      title: "Cancelled",
      description: "Rule creation cancelled.",
      variant: "default"
    });
  };

  return (
    <PageLayout title="FrameSync Rules" description="Create and manage automated financial rules">
      <ErrorCatcher>
        <motion.div
          className="rules-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CompositeCard>
            <div className="rules-header">
              <div className="rules-title-section">
                <div className="rules-title-wrapper">
                  <Zap className="rules-icon" />
                  <h1 className="rules-title">FrameSync Rules</h1>
                </div>
                <p className="rules-subtitle">
                  Create automated rules to manage your finances intelligently
                </p>
              </div>
            </div>

            {!showRuleBinder ? (
              <motion.div 
                className="rules-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="rules-actions">
                  <StyledButton 
                    onClick={handleCreateRule}
                    data-testid="create-rule-button"
                    className="create-rule-button"
                  >
                    <Plus size={16} />
                    Create Rule
                  </StyledButton>
                </div>
                
                <div className="rules-info-grid">
                  <CompositeCard variant="elevated" className="info-card">
                    <div className="info-card-header">
                      <Settings className="info-icon" />
                      <h3 className="info-title">What are FrameSync Rules?</h3>
                    </div>
                    <p className="info-description">
                      FrameSync rules automatically monitor your financial data and 
                      execute actions when specific conditions are met. For example, 
                      automatically transfer money when your checking account balance 
                      exceeds a certain threshold.
                    </p>
                  </CompositeCard>

                  <CompositeCard variant="elevated" className="info-card">
                    <div className="info-card-header">
                      <Shield className="info-icon" />
                      <h3 className="info-title">Security & Safety</h3>
                    </div>
                    <p className="info-description">
                      All rules are executed with bank-level security. You can review, 
                      pause, or delete rules at any time. We never make changes without 
                      your explicit approval.
                    </p>
                  </CompositeCard>

                  <CompositeCard variant="elevated" className="info-card">
                    <div className="info-card-header">
                      <TrendingUp className="info-icon" />
                      <h3 className="info-title">Smart Automation</h3>
                    </div>
                    <p className="info-description">
                      Build intelligent rules that adapt to your financial patterns. 
                      Save time and reduce stress with automated financial management 
                      that works 24/7.
                    </p>
                  </CompositeCard>
                </div>
                
                <div className="rules-status">
                  <StatusBadge variant="info" size="sm">
                    Ready to create rules
                  </StatusBadge>
                  <p className="timestamp">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="rule-builder-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="builder-header">
                  <div className="builder-title">
                    <h2 className="builder-title-text">Create New Rule</h2>
                    <p className="builder-subtitle">Configure your automated financial rule</p>
                  </div>
                  <StyledButton 
                    onClick={handleCancel}
                    variant="secondary"
                    className="cancel-button"
                  >
                    <X size={16} />
                    Cancel
                  </StyledButton>
                </div>
                
                {(() => {
                  try {
                    return (
                      <RuleBinderRoot
                        initialConfig={{
                          rule: currentRule,
                          currentState: {
                            checking_account_balance: 6000,
                            savings_account_balance: 15000,
                            credit_score: 750
                          }
                        }}
                        onConfigurationChange={handleConfigurationChange}
                      />
                    );
                  } catch (err) {
                    return (
                      <CompositeCard className="error-container">
                        <div className="error-content">
                          <StatusBadge variant="error" size="sm">
                            Error Loading Rule Builder
                          </StatusBadge>
                          <span data-testid="rulespage-render-error">
                            {err?.message || "Unknown error"}
                          </span>
                          <pre className="error-stack">{err?.stack}</pre>
                        </div>
                      </CompositeCard>
                    );
                  }
                })()}
              </motion.div>
            )}
          </CompositeCard>
        </motion.div>
      </ErrorCatcher>
    </PageLayout>
  );
};

export default RulesPage;
