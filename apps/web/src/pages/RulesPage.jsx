import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RuleBinderRoot from '../components/framesync/RuleBinderRoot';
import StyledButton from '../components/ui/StyledButton';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';
import { useToast } from '../components/ui/use-toast.jsx';
import { Plus, X, Settings } from 'lucide-react';
import './RulesPage.css';

/**
 * RulesPage - FrameSync Rules Management
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
 * 
 * Conclusion: Delivers a cohesive, modern rules management interface
 * that guides users through rule creation and management.
 */

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
    if (import.meta.env.VITE_APP_ENV === 'test') {
      console.log('RulesPage: Test mode active');
    }
  }, [showRuleBinder, currentRule]);

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
    <PageLayout>
      <ErrorCatcher>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CompositeCard>
            <div className="rules-header">
              <div className="rules-title-section">
                <h1 className="rules-title">FrameSync Rules</h1>
                <p className="rules-subtitle">
                  Create automated rules to manage your finances intelligently
                </p>
              </div>
              
              {/* Test mode indicator */}
              {import.meta.env.VITE_APP_ENV === 'test' && (
                <motion.div 
                  className="test-mode-indicator"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>🧪 Test Mode Active - Element Should Be Visible</p>
                  <p>Background: Lime | Border: Red | Z-Index: 9999</p>
                </motion.div>
              )}
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
                
                <div className="rules-info">
                  <div className="info-card">
                    <Settings size={24} />
                    <h3>What are FrameSync Rules?</h3>
                    <p>
                      FrameSync rules automatically monitor your financial data and 
                      execute actions when specific conditions are met. For example, 
                      automatically transfer money when your checking account balance 
                      exceeds a certain threshold.
                    </p>
                  </div>
                </div>
                
                <div className="rules-status">
                  <p className="status-text">Test: Rules Page Loaded</p>
                  <p className="timestamp">
                    Component rendered at: {new Date().toISOString()}
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
                      <div className="error-container">
                        <span data-testid="rulespage-render-error">
                          {err?.message || "Unknown error"}
                        </span>
                        <pre className="error-stack">{err?.stack}</pre>
                      </div>
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
