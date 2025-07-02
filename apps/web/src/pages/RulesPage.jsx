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
import { useAuth0 } from '@auth0/auth0-react';
import RuleBinderRoot from '../components/framesync/RuleBinderRoot';
import StyledButton from '../components/ui/StyledButton';
import CompositeCard from '../components/ui/CompositeCard';
import StatusBadge from '../components/ui/StatusBadge';
import RuleStatusCard from '../components/ui/RuleStatusCard';
import RuleCreationModal from '../components/ui/RuleCreationModal';
import PageLayout from '../components/PageLayout';
import { useToast } from '../components/ui/use-toast';
import { Plus, X, Settings, Zap, Shield, TrendingUp, Trash2, Play, Pause, Edit, Eye } from 'lucide-react';
import './RulesPage.css';
import env from '../lib/env.js';
import storageService from '../lib/services/StorageService';
import ruleExecutionEngine from '../lib/services/RuleExecutionEngine.js';

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
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [userRules, setUserRules] = useState([]); // Track user's rules
  const [ruleExecutionResults, setRuleExecutionResults] = useState([]);
  const [engineStatus, setEngineStatus] = useState({});
  const { toast } = useToast();
  const { user } = useAuth0();

  // Check for existing rules on mount
  useEffect(() => {
    if (user?.sub) {
      // Set user ID for storage isolation
      storageService.setUserId(user.sub);
      
      // Get stored rules using enhanced service
      const storedRules = storageService.getUserRules();
      setUserRules(storedRules);
      
      // Initialize rule execution engine if rules exist
      if (storedRules.length > 0) {
        initializeRuleEngine(storedRules);
      }
    }
  }, [user]);

  const initializeRuleEngine = async (rules) => {
    try {
      // Initialize the engine with user rules
      await ruleExecutionEngine.initialize(rules);
      
      // Start periodic evaluation
      await ruleExecutionEngine.startPeriodicEvaluation(30000); // 30 seconds
      
      // Get initial evaluation results
      const evaluation = await ruleExecutionEngine.evaluateAllRules();
      setRuleExecutionResults(evaluation.results);
      setEngineStatus(ruleExecutionEngine.getStatus());
    } catch (error) {
      console.error('Failed to initialize rule engine:', error);
    }
  };

  // Diagnostic logging and test mode setup
  useEffect(() => {
    // Set test mode for development
    if (import.meta.env.DEV) {
      storageService.setItem('test_mode', 'true');
    }
  }, []);

  const handleCreateRule = () => {
    setShowRuleModal(true);
    
    toast({
      title: "Creating New Rule",
      description: "Opening rule builder...",
      variant: "default"
    });
  };

  const handleRuleCreated = async (newRule) => {
    const updatedRules = [...userRules, newRule];
    setUserRules(updatedRules);
    
    // Save using enhanced storage service
    const saveSuccess = storageService.setUserRules(updatedRules);
    
    if (!saveSuccess) {
      console.warn('Failed to save rules, but continuing...');
    }
    
    // Add rule to execution engine
    try {
      const evaluation = await ruleExecutionEngine.addRule(newRule);
      setRuleExecutionResults(evaluation.results);
      setEngineStatus(ruleExecutionEngine.getStatus());
    } catch (error) {
      console.error('Failed to add rule to engine:', error);
    }
    
    toast({
      title: "Rule Created!",
      description: "Your new rule has been saved and is now active.",
      variant: "default"
    });
  };

  const handleEditRule = (rule) => {
    setCurrentRule(rule);
    setShowRuleModal(true);
  };

  const handleDeleteRule = async (ruleId) => {
    const updatedRules = userRules.filter(rule => rule.id !== ruleId);
    setUserRules(updatedRules);
    
    // Save using enhanced storage service
    storageService.setUserRules(updatedRules);
    
    // Remove rule from execution engine
    try {
      await ruleExecutionEngine.removeRule(ruleId);
      const evaluation = await ruleExecutionEngine.evaluateAllRules();
      setRuleExecutionResults(evaluation.results);
      setEngineStatus(ruleExecutionEngine.getStatus());
    } catch (error) {
      console.error('Failed to remove rule from engine:', error);
    }
    
    toast({
      title: "Rule Deleted",
      description: "Your rule has been successfully removed.",
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
    
    // Save using enhanced storage service
    const saveSuccess = storageService.setUserRules(updatedRules);
    
    if (!saveSuccess) {
      console.warn('Failed to save rules, but continuing...');
    }
    
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
        {/* Rule Creation Modal */}
        <RuleCreationModal
          isOpen={showRuleModal}
          onClose={() => setShowRuleModal(false)}
          onRuleCreated={handleRuleCreated}
        />

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
                    {/* Engine Status */}
                    {engineStatus.isRunning && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginBottom: '1rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'var(--color-success-50)',
                          border: '1px solid var(--color-success-200)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-success-500)',
                          animation: 'pulse 2s infinite'
                        }} />
                        <span style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--color-success-700)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          Auto-monitoring Active - {userRules.length} rule{userRules.length !== 1 ? 's' : ''} being evaluated
                        </span>
                      </motion.div>
                    )}

                    {/* Show existing rules with RuleStatusCard */}
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
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        {userRules.map((rule) => {
                          const executionResult = ruleExecutionResults.find(r => r.ruleId === rule.id) || {
                            status: 'ok',
                            message: 'Rule is active and monitoring',
                            metrics: {}
                          };
                          
                          return (
                            <div key={rule.id} style={{ position: 'relative' }}>
                              <RuleStatusCard
                                rule={rule}
                                executionResult={executionResult}
                              />
                              {/* Action buttons */}
                              <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                display: 'flex',
                                gap: '0.5rem'
                              }}>
                                <StyledButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRule(rule)}
                                  style={{ padding: '0.5rem' }}
                                >
                                  <Edit size={16} />
                                </StyledButton>
                                <StyledButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRule(rule.id)}
                                  style={{ padding: '0.5rem', color: 'var(--color-destructive-600)' }}
                                >
                                  <Trash2 size={16} />
                                </StyledButton>
                              </div>
                            </div>
                          );
                        })}
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
                        Last updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <RuleBinderRoot
                rule={currentRule}
                onConfigurationChange={handleConfigurationChange}
                onCancel={handleCancel}
              />
            )}
          </CompositeCard>
        </motion.div>
      </ErrorCatcher>
    </PageLayout>
  );
};

export default RulesPage;
