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
  const [userRules, setUserRules] = useState([]); // Track user's rules
  const { toast } = useToast();

  // Check for existing rules on mount
  useEffect(() => {
    // For now, we'll simulate checking for existing rules
    // In a real implementation, this would fetch from the user's actual rules
    const storedRules = localStorage.getItem('alphaframe_user_rules');
    if (storedRules) {
      try {
        setUserRules(JSON.parse(storedRules));
      } catch (error) {
        console.error('Error parsing stored rules:', error);
      }
    }
  }, []);

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
    
    // Save the new rule
    const newRule = {
      id: currentRule.id,
      name: `Rule ${userRules.length + 1}`,
      trigger: currentRule.trigger,
      action: currentRule.action,
      enabled: true,
      createdAt: new Date().toISOString()
    };
    
    const updatedRules = [...userRules, newRule];
    setUserRules(updatedRules);
    localStorage.setItem('alphaframe_user_rules', JSON.stringify(updatedRules));
    
    toast({
      title: "Rule Created!",
      description: "Your new rule has been saved and is now active.",
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

  // Empty state component for when user has no rules
  const EmptyRulesState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ marginTop: '2rem' }}
    >
      <CompositeCard variant="elevated">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          {/* Empty State Illustration */}
          <div style={{ 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 2rem',
            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-warning-100))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--color-primary-200)'
          }}>
            <Zap size={48} style={{ color: 'var(--color-primary-600)' }} />
          </div>
          
          <h2 style={{ 
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            No Rules Created Yet
          </h2>
          
          <p style={{ 
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            FrameSync rules automate your financial management. Create your first rule to start 
            monitoring your accounts and get intelligent insights automatically.
          </p>
          
          <StyledButton 
            onClick={handleCreateRule}
            style={{ 
              background: 'var(--color-primary-600)',
              color: 'white',
              padding: '1rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <Plus size={16} />
            Create Your First Rule
          </StyledButton>
          
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-secondary)'
          }}>
            <h4 style={{ 
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem'
            }}>
              💡 Popular Rule Examples:
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ 
                padding: '1rem',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)'
              }}>
                <h5 style={{ 
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Low Balance Alert
                </h5>
                <p style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  Get notified when your checking account balance falls below $500
                </p>
              </div>
              <div style={{ 
                padding: '1rem',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)'
              }}>
                <h5 style={{ 
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  High Spending Alert
                </h5>
                <p style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0
                }}>
                  Alert when daily spending exceeds your budget limit
                </p>
              </div>
            </div>
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );

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
                
                {/* Show empty state if no rules exist */}
                {userRules.length === 0 ? (
                  <EmptyRulesState />
                ) : (
                  <>
                    {/* Show existing rules */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ 
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '1rem'
                      }}>
                        Your Active Rules ({userRules.length})
                      </h3>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {userRules.map((rule) => (
                          <CompositeCard key={rule.id} variant="elevated">
                            <div style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Zap size={16} style={{ color: 'var(--color-success-600)' }} />
                                <h4 style={{ 
                                  fontSize: 'var(--font-size-base)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)',
                                  margin: 0
                                }}>
                                  {rule.name}
                                </h4>
                                <StatusBadge variant="success" size="sm">
                                  Active
                                </StatusBadge>
                              </div>
                              <p style={{ 
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-text-secondary)',
                                margin: '0.5rem 0'
                              }}>
                                {rule.trigger}
                              </p>
                              <p style={{ 
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--color-text-tertiary)',
                                margin: 0
                              }}>
                                Created: {new Date(rule.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </CompositeCard>
                        ))}
                      </div>
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
                      <StatusBadge variant="success" size="sm">
                        {userRules.length} rule{userRules.length !== 1 ? 's' : ''} active
                      </StatusBadge>
                      <p className="timestamp">
                        Last updated: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
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
