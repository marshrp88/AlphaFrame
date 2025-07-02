/**
 * OnboardingFlow.jsx - AlphaFrame VX.1 Consumer-Ready Onboarding
 * Enhanced for Phase 4: Automation Education & Guided Rule Creation
 * 
 * Purpose: Complete first-time user onboarding experience that guides users through
 * bank connection, transaction review, budget setup, and automation education with
 * guided rule creation and visual rule mapping.
 * 
 * Procedure:
 * 1. Detect first-time users and redirect to onboarding
 * 2. Guide through Plaid bank connection with enhanced UI
 * 3. Review imported transactions with better visualization
 * 4. Set up initial budget categories with intuitive interface
 * 5. Phase 4: Teach automation value proposition with guided rule creation
 * 6. Phase 4: Demonstrate automation in action with visual rule map
 * 7. Choose default dashboard mode with clear options
 * 8. Mark user as onboarded and redirect to dashboard
 * 
 * Conclusion: Ensures users have a complete setup, understand automation value,
 * and experience their first "aha moment" with guided rule creation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from '../../components/ui/CompositeCard.jsx';
import StyledButton from '../../components/ui/StyledButton.jsx';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Shield, Zap, Target, Brain, Play, Eye, AlertTriangle, RefreshCw } from 'lucide-react';
import Step1PlaidConnect from './steps/Step1PlaidConnect.jsx';
import Step2ReviewTransactions from './steps/Step2ReviewTransactions.jsx';
import Step3BudgetSetup from './steps/Step3BudgetSetup.jsx';
import Step4AutomationEducation from './steps/Step4AutomationEducation.jsx';
import Step5GuidedRuleCreation from './steps/Step5GuidedRuleCreation.jsx';
import Step6SetMode from './steps/Step6SetMode.jsx';
import { useAuthStore } from '../../core/store/authStore.js';
import { useFinancialStateStore } from '../../core/store/financialStateStore.js';
import { useToast } from '../../components/ui/use-toast.jsx';
import { trackOnboardStarted, trackOnboardCompleted } from '@/lib/analytics.js';
import './OnboardingFlow.css';

/**
 * Onboarding steps configuration - Enhanced for Phase 4
 */
const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Connect Your Bank',
    description: 'Securely connect your bank account to import transactions',
    component: Step1PlaidConnect,
    required: true,
    icon: Shield,
    color: 'var(--color-primary-600)'
  },
  {
    id: 2,
    title: 'Review Transactions',
    description: 'Review and categorize your imported transactions',
    component: Step2ReviewTransactions,
    required: true,
    icon: CheckCircle,
    color: 'var(--color-success-600)'
  },
  {
    id: 3,
    title: 'Set Up Budget',
    description: 'Create your first budget categories and limits',
    component: Step3BudgetSetup,
    required: true,
    icon: Zap,
    color: 'var(--color-warning-600)'
  },
  {
    id: 4,
    title: 'Learn Automation',
    description: 'Discover how AlphaFrame automates your financial monitoring',
    component: Step4AutomationEducation,
    required: true,
    icon: Brain,
    color: 'var(--color-info-600)'
  },
  {
    id: 5,
    title: 'Create Your First Rule',
    description: 'Set up your first automated financial rule',
    component: Step5GuidedRuleCreation,
    required: true,
    icon: Target,
    color: 'var(--color-secondary-600)'
  },
  {
    id: 6,
    title: 'Choose Dashboard',
    description: 'Select your preferred dashboard view',
    component: Step6SetMode,
    required: false,
    icon: Eye,
    color: 'var(--color-tertiary-600)'
  }
];

/**
 * Error State Component for Onboarding Recovery
 */
const OnboardingErrorState = ({ message, onReset, onRetry }) => (
  <div className="onboarding-error-state" style={{
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    margin: '20px 0'
  }}>
    <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
    <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>Onboarding Issue Detected</h3>
    <p style={{ color: '#6b7280', marginBottom: '24px' }}>{message}</p>
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <StyledButton
        variant="secondary"
        onClick={onRetry}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <RefreshCw size={16} />
        Retry
      </StyledButton>
      <StyledButton
        variant="primary"
        onClick={onReset}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        Reset Onboarding
      </StyledButton>
    </div>
  </div>
);

/**
 * Main onboarding flow component - Enhanced for Phase 4
 */
export const OnboardingFlow = ({ onComplete, initialState }) => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthStore();
  const { initializeFinancialState } = useFinancialStateStore();
  const { toast, automationToast } = useToast();
  
  // CRITICAL FIX: Always start at step 1, never undefined
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [automationDemoActive, setAutomationDemoActive] = useState(false);
  
  // NEW: Error state management
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // CRITICAL FIX: Clear onboarding state on load to prevent stuck states
  useEffect(() => {
    console.log('🔧 OnboardingFlow: Clearing localStorage to prevent stuck states');
    localStorage.removeItem('alphaframe_onboarding_complete');
    localStorage.removeItem('alphaframe_onboarding_data');
    localStorage.removeItem('af:onboardingComplete');
    localStorage.removeItem('af:userState');
    
    // Force step 1 rendering
    setCurrentStep(1);
    setHasError(false);
    setErrorMessage('');
    
    console.log('🔧 OnboardingFlow: Current step set to 1, error state cleared');
  }, []);

  // NEW: Loading timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ OnboardingFlow: Loading timeout exceeded (10 seconds)');
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('Onboarding is taking longer than expected. Please try again.');
      }, 10000);
      
      setLoadingTimeout(timeout);
    } else {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
    }
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [isLoading]);

  // Enhanced debug reset with comprehensive state clearing
  const handleDebugReset = () => {
    console.log('🔧 OnboardingFlow: Debug reset triggered');
    
    // Clear all localStorage keys
    const keysToRemove = [
      'alphaframe_onboarding_complete',
      'alphaframe_onboarding_data', 
      'af:onboardingComplete',
      'af:userState',
      'alphaframe_user_profile',
      'alphaframe_financial_state'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🔧 OnboardingFlow: Removed localStorage key: ${key}`);
    });
    
    // Reset all state
    setCurrentStep(1);
    setStepData({});
    setIsLoading(false);
    setHasError(false);
    setErrorMessage('');
    setAutomationDemoActive(false);
    
    // Clear any loading timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    
    toast({
      title: 'Onboarding Reset Complete',
      description: 'All onboarding state has been cleared. Starting fresh from step 1.',
      variant: 'info'
    });
    
    console.log('🔧 OnboardingFlow: Debug reset completed successfully');
  };

  // NEW: Retry functionality
  const handleRetry = () => {
    console.log('🔧 OnboardingFlow: Retry triggered');
    setHasError(false);
    setErrorMessage('');
    setIsLoading(false);
    
    // Force re-render of current step
    const currentStepCopy = currentStep;
    setCurrentStep(0);
    setTimeout(() => setCurrentStep(currentStepCopy), 100);
  };

  // Check if user is already onboarded - ENHANCED with error handling
  useEffect(() => {
    try {
      console.log('🔧 OnboardingFlow: Checking onboarding status');
      
      const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete');
      console.log('🔧 OnboardingFlow: onboardingComplete =', onboardingComplete);
      
      if (onboardingComplete === 'true' && !initialState) {
        console.log('🔧 OnboardingFlow: User already onboarded, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('🔧 OnboardingFlow: Starting new onboarding flow');
        
        // Track onboarding start for new users
        trackOnboardStarted();
        
        // Phase 4: Show automation welcome message
        toast({
          type: 'automationGuidance',
          message: 'Welcome to AlphaFrame! We\'ll teach you how automation can transform your financial monitoring.',
          action: null,
          actionLabel: null
        });
      }
    } catch (error) {
      console.error('❌ OnboardingFlow: Error checking onboarding status:', error);
      setHasError(true);
      setErrorMessage('Failed to check onboarding status. Please refresh the page.');
    }
  }, [navigate, initialState, toast]);

  /**
   * Handle step completion - Enhanced for Phase 4
   * @param {number} stepId - Step ID
   * @param {Object} data - Step data
   */
  const handleStepComplete = (stepId, data) => {
    console.log(`🔧 OnboardingFlow: Step ${stepId} completed with data:`, data);
    
    setStepData(prev => ({ ...prev, [stepId]: data }));
    
    // Phase 4: Enhanced step completion feedback
    const stepConfig = ONBOARDING_STEPS[stepId - 1];
    
    if (stepId === 4) {
      // Automation education completed
      toast({
        type: 'automationGuidance',
        message: 'Great! You now understand how automation works. Let\'s create your first rule together.',
        action: () => setCurrentStep(5),
        actionLabel: 'Create Rule'
      });
    } else if (stepId === 5) {
      // First rule created
      toast({
        type: 'ruleCreated',
        ruleName: data.ruleName || 'Your First Rule',
        ruleId: data.ruleId,
        message: 'Congratulations! Your first automation rule is now active and monitoring your finances.',
        action: () => setCurrentStep(6),
        actionLabel: 'Continue'
      });
    } else {
      // Regular step completion
      toast({
        title: "Step Complete!",
        description: `${stepConfig.title} completed successfully.`,
        variant: "default"
      });
    }
    
    if (stepId < ONBOARDING_STEPS.length) {
      setCurrentStep(stepId + 1);
      console.log(`🔧 OnboardingFlow: Moving to step ${stepId + 1}`);
    } else {
      handleOnboardingComplete();
    }
  };

  /**
   * Handle onboarding completion - Enhanced for Phase 4
   */
  const handleOnboardingComplete = async () => {
    console.log('🔧 OnboardingFlow: Starting onboarding completion');
    setIsLoading(true);
    
    try {
      // Initialize financial state with onboarding data
      await initializeFinancialState(stepData);
      
      // Mark user as onboarded in localStorage
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
      localStorage.setItem('alphaframe_onboarding_data', JSON.stringify(stepData));
      
      // Track onboarding completion
      trackOnboardCompleted();
      
      // Phase 4: Show automation success message
      toast({
        type: 'automationGuidance',
        message: 'Welcome to AlphaFrame! Your automation is now active. You\'ll receive alerts when your rules trigger.',
        action: () => navigate('/dashboard'),
        actionLabel: 'Go to Dashboard'
      });
      
      // Call parent completion handler if provided
      if (onComplete) {
        onComplete(stepData);
      } else {
        // Redirect to dashboard with enhanced state
        navigate('/dashboard', { 
          state: { 
            welcome: true,
            onboardingComplete: true,
            firstRuleCreated: stepData[5]?.rule || null,
            automationDemo: true
          } 
        });
      }
      
    } catch (error) {
      console.error('❌ OnboardingFlow: Error completing onboarding:', error);
      
      // Show error toast
      toast({
        title: "Setup Error",
        description: "There was an issue completing your setup. Please try again.",
        variant: "destructive"
      });
      
      setHasError(true);
      setErrorMessage('Failed to complete onboarding setup. Please try again or reset onboarding.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      console.log(`🔧 OnboardingFlow: Moving back to step ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Skip current step
   */
  const handleSkipStep = () => {
    const currentStepConfig = ONBOARDING_STEPS[currentStep - 1];
    if (!currentStepConfig.required) {
      console.log(`🔧 OnboardingFlow: Skipping step ${currentStep}`);
      
      // Show skip confirmation toast
      toast({
        title: "Step Skipped",
        description: `${currentStepConfig.title} has been skipped. You can complete this later.`,
        variant: "default"
      });
      
      handleStepComplete(currentStep, { skipped: true });
    }
  };

  /**
   * Phase 4: Start automation demo
   */
  const startAutomationDemo = () => {
    setAutomationDemoActive(true);
    
    // Simulate rule trigger for demo
    setTimeout(() => {
      toast({
        type: 'ruleTriggered',
        ruleName: 'Demo Spending Alert',
        message: 'This is how you\'ll be notified when your rules trigger!',
        action: () => setAutomationDemoActive(false),
        actionLabel: 'Got it!'
      });
    }, 2000);
  };

  // CRITICAL FIX: Ensure currentStep is always valid
  const validCurrentStep = currentStep >= 1 && currentStep <= ONBOARDING_STEPS.length ? currentStep : 1;
  const currentStepConfig = ONBOARDING_STEPS[validCurrentStep - 1];
  const CurrentStepComponent = currentStepConfig?.component;
  const progress = (validCurrentStep / ONBOARDING_STEPS.length) * 100;
  const canGoBack = validCurrentStep > 1;
  const canSkip = !currentStepConfig?.required;
  const isLastStep = validCurrentStep === ONBOARDING_STEPS.length;

  // CRITICAL FIX: Show error state if onboarding is stuck
  if (hasError) {
    return (
      <div className="onboarding-container">
        {/* Debug Reset Button - Always visible */}
        <button 
          onClick={handleDebugReset} 
          style={{ 
            position: 'fixed', 
            top: 10, 
            right: 10, 
            zIndex: 2000, 
            background: '#dc2626', 
            color: 'white',
            border: 'none', 
            borderRadius: 4, 
            padding: '8px 16px', 
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          🚨 RESET ONBOARDING
        </button>
        
        <div className="onboarding-background">
          <div className="onboarding-content">
            <CompositeCard variant="elevated" className="onboarding-card">
              <OnboardingErrorState
                message={errorMessage}
                onReset={handleDebugReset}
                onRetry={handleRetry}
              />
            </CompositeCard>
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL FIX: Ensure component exists before rendering
  if (!CurrentStepComponent) {
    console.error('❌ OnboardingFlow: CurrentStepComponent is undefined for step:', validCurrentStep);
    setHasError(true);
    setErrorMessage('Invalid onboarding step. Please reset onboarding.');
    return null;
  }

  return (
    <div className="onboarding-container">
      {/* Enhanced Debug Reset Button - Always visible and prominent */}
      <button 
        onClick={handleDebugReset} 
        style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          zIndex: 2000, 
          background: '#3b82f6', 
          color: 'white',
          border: 'none', 
          borderRadius: 6, 
          padding: '8px 16px', 
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
        }}
      >
        🔧 DEBUG RESET
      </button>
      
      <div className="onboarding-background">
        <div className="onboarding-content">
          <CompositeCard variant="elevated" className="onboarding-card">
            {/* Header */}
            <motion.div 
              className="onboarding-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="onboarding-logo">
                <Sparkles size={32} color="var(--color-primary-600)" />
                <h1 className="onboarding-title">Welcome to AlphaFrame</h1>
              </div>
              <p className="onboarding-subtitle">
                Let's get you set up with automated financial monitoring
              </p>
              
              {/* Phase 4: Automation preview */}
              {validCurrentStep >= 4 && (
                <motion.div 
                  className="automation-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="preview-badge">
                    <Brain size={16} />
                    <span>Automation Active</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Progress Indicator */}
            <motion.div 
              className="onboarding-progress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="progress-steps">
                {ONBOARDING_STEPS.map((step, index) => {
                  const isActive = validCurrentStep === step.id;
                  const isCompleted = validCurrentStep > step.id;
                  const IconComponent = step.icon;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="step-indicator">
                        {isCompleted ? (
                          <CheckCircle size={20} color="var(--color-success-600)" />
                        ) : (
                          <IconComponent size={20} color={isActive ? step.color : 'var(--color-text-tertiary)'} />
                        )}
                      </div>
                      <div className="step-info">
                        <span className="step-title">{step.title}</span>
                        <span className="step-description">{step.description}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Step Content - CRITICAL FIX: Always render current step */}
            <motion.div 
              className="onboarding-step-content"
              key={validCurrentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <CurrentStepComponent
                  key={validCurrentStep}
                  onComplete={(data) => handleStepComplete(validCurrentStep, data)}
                  data={stepData[validCurrentStep]}
                  isLoading={isLoading}
                  automationDemoActive={automationDemoActive}
                  onStartDemo={startAutomationDemo}
                />
              </AnimatePresence>
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="onboarding-navigation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="nav-left">
                {canGoBack && (
                  <StyledButton
                    variant="secondary"
                    onClick={handlePreviousStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </StyledButton>
                )}
              </div>
              
              <div className="nav-right">
                {canSkip && (
                  <StyledButton
                    variant="outline"
                    onClick={handleSkipStep}
                    disabled={isLoading}
                  >
                    Skip
                  </StyledButton>
                )}
                
                {isLastStep ? (
                  <StyledButton
                    variant="primary"
                    onClick={handleOnboardingComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Completing...' : 'Complete Setup'}
                    <ArrowRight size={16} />
                  </StyledButton>
                ) : null}
              </div>
            </motion.div>
          </CompositeCard>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 