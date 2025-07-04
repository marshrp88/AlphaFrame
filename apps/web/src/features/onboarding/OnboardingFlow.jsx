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
  
  // DEV/DEMO HOTFIX: Always show onboarding step 1, bypass auth and blockers
  const [currentStep, setCurrentStep] = useState(1); // Always start at step 1
  const [stepData, setStepData] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Remove loading gate
  const [automationDemoActive, setAutomationDemoActive] = useState(false);
  
  // NEW: Error state management
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // DEV/DEMO: Bypass auth (inject demo user if needed)
  // const user = { id: 'demoUser', email: 'demo@demo.com' };

  // Remove all pointer-events/opacity blockers on mount
  useEffect(() => {
    const unblockUI = () => {
      document.querySelectorAll('*').forEach(el => {
        el.style.pointerEvents = 'auto';
        el.style.opacity = 1;
        el.style.filter = 'none';
      });
    };
    unblockUI();
  }, []);

  // DEV/DEMO: Loading timeout to prevent infinite loading
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

  // Debug reset button handler
  const handleDebugReset = () => {
    localStorage.removeItem('onboardingProgress');
    localStorage.removeItem('alphaframe_onboarding_complete');
    localStorage.removeItem('alphaframe_onboarding_data');
    window.location.reload();
  };

  // Always render step 1 (no auth required)
  const StepComponent = ONBOARDING_STEPS[0].component;

  // Check if user is already onboarded - ENHANCED with error handling
  useEffect(() => {
    try {
      console.log('🔧 OnboardingFlow: Checking onboarding status');
      
      // Use the same logic as useAppStore to check if user is onboarded
      // This ensures demo users are properly recognized as onboarded
      const onboardingComplete = 
        localStorage.getItem('alphaframe_onboarding_complete') === 'true' ||
        sessionStorage.getItem('demo_user') === 'true';
      console.log('🔧 OnboardingFlow: onboardingComplete =', onboardingComplete);
      
      if (onboardingComplete && !initialState) {
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

  // Detect demo mode
  const isDemoUser = !user || window.demoMode === true;

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
  const handleOnboardingComplete = () => {
    const isDemo = !user;
    localStorage.setItem('alphaframe_onboarding_complete', 'true');
    if (isDemo) sessionStorage.setItem('demo_user', 'true');
    if (onComplete) onComplete({ demo: isDemo });
    navigate('/dashboard');
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
                onRetry={handleDebugReset}
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

  // === INSTITUTIONAL ONBOARDING HARDENING ===
  // Full reset for onboarding/demo state (for QA/dev/edge-case recovery)
  const handleDebugFullReset = () => {
    localStorage.removeItem('alphaframe_onboarding_complete');
    sessionStorage.removeItem('demo_user');
    localStorage.removeItem('plaid_connection');
    window.location.reload();
  };

  return (
    <div style={{ pointerEvents: 'auto', opacity: 1, background: '#fff', minHeight: '100vh' }} data-testid="onboarding-container">
      {/* Debug reset button (dev only) */}
      <button 
        onClick={handleDebugReset}
        style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999, background: 'red', color: 'white', fontWeight: 'bold', padding: '8px', borderRadius: '6px', border: 'none' }}
      >
        Reset Onboarding State
      </button>
      <button 
        onClick={handleDebugFullReset}
        style={{ position: 'fixed', top: 50, right: 10, zIndex: 9999, background: '#333', color: 'white', fontWeight: 'bold', padding: '8px', borderRadius: '6px', border: 'none' }}
      >
        Full Onboarding Reset
      </button>
      <div style={{ maxWidth: 600, margin: '40px auto', border: '2px solid #333', borderRadius: 12, padding: 32, background: '#f9f9f9', pointerEvents: 'auto', opacity: 1 }}>
        <h2>Welcome to AlphaFrame</h2>
        <p>Let's get you set up with automated financial monitoring.</p>
        <CurrentStepComponent 
          onComplete={(data) => handleStepComplete(validCurrentStep, data)}
          data={stepData[validCurrentStep]}
          isLoading={isLoading}
          automationDemoActive={automationDemoActive}
          onStartDemo={startAutomationDemo}
        />
      </div>
    </div>
  );
};

export default OnboardingFlow; 