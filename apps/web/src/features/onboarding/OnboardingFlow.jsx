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
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Shield, Zap, Target, Brain, Play, Eye } from 'lucide-react';
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
 * Main onboarding flow component - Enhanced for Phase 4
 */
export const OnboardingFlow = ({ onComplete, initialState }) => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthStore();
  const { initializeFinancialState } = useFinancialStateStore();
  const { toast, automationToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1); // Always start at step 1 for debug
  const [stepData, setStepData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [automationDemoActive, setAutomationDemoActive] = useState(false);

  // Debug: Add a button to reset onboarding state
  const handleDebugReset = () => {
    localStorage.removeItem('alphaframe_onboarding_complete');
    localStorage.removeItem('alphaframe_onboarding_data');
    setCurrentStep(1);
    setStepData({});
    toast({
      title: 'Onboarding Reset',
      description: 'Onboarding state has been reset. Starting from step 1.',
      variant: 'info'
    });
  };

  // Check if user is already onboarded
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete');
    if (onboardingComplete === 'true' && !initialState) {
      navigate('/dashboard');
    } else {
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
  }, [navigate, initialState, toast]);

  /**
   * Handle step completion - Enhanced for Phase 4
   * @param {number} stepId - Step ID
   * @param {Object} data - Step data
   */
  const handleStepComplete = (stepId, data) => {
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
    } else {
      handleOnboardingComplete();
    }
  };

  /**
   * Handle onboarding completion - Enhanced for Phase 4
   */
  const handleOnboardingComplete = async () => {
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
      // Show error toast
      toast({
        title: "Setup Error",
        description: "There was an issue completing your setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to previous step
   */
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Skip current step
   */
  const handleSkipStep = () => {
    const currentStepConfig = ONBOARDING_STEPS[currentStep - 1];
    if (!currentStepConfig.required) {
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

  const currentStepConfig = ONBOARDING_STEPS[currentStep - 1];
  const CurrentStepComponent = currentStepConfig.component;
  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;
  const canGoBack = currentStep > 1;
  const canSkip = !currentStepConfig.required;
  const isLastStep = currentStep === ONBOARDING_STEPS.length;

  return (
    <div className="onboarding-container">
      {/* Debug Reset Button */}
      <button onClick={handleDebugReset} style={{ position: 'fixed', top: 10, right: 10, zIndex: 2000, background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>
        Debug: Reset Onboarding
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
              {currentStep >= 4 && (
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
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
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

            {/* Step Content */}
            <motion.div 
              className="onboarding-step-content"
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <CurrentStepComponent
                  key={currentStep}
                  onComplete={(data) => handleStepComplete(currentStep, data)}
                  data={stepData[currentStep]}
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