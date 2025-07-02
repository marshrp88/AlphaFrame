/**
 * OnboardingFlow.jsx - AlphaFrame VX.1 Consumer-Ready Onboarding
 * 
 * Purpose: Complete first-time user onboarding experience
 * that guides users through bank connection, transaction review,
 * budget setup, and dashboard configuration with professional styling.
 * 
 * Procedure:
 * 1. Detect first-time users and redirect to onboarding
 * 2. Guide through Plaid bank connection with enhanced UI
 * 3. Review imported transactions with better visualization
 * 4. Set up initial budget categories with intuitive interface
 * 5. Choose default dashboard mode with clear options
 * 6. Mark user as onboarded and redirect to dashboard
 * 
 * Conclusion: Ensures users have a complete setup
 * and positive first experience with AlphaFrame.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from '../../components/ui/CompositeCard.jsx';
import StyledButton from '../../components/ui/StyledButton.jsx';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import Step1PlaidConnect from './steps/Step1PlaidConnect.jsx';
import Step2ReviewTransactions from './steps/Step2ReviewTransactions.jsx';
import Step3BudgetSetup from './steps/Step3BudgetSetup.jsx';
import Step4SetMode from './steps/Step4SetMode.jsx';
import { useAuthStore } from '../../core/store/authStore.js';
import { useFinancialStateStore } from '../../core/store/financialStateStore.js';
import { useToast } from '../../components/ui/use-toast.jsx';
import './OnboardingFlow.css';

/**
 * Onboarding steps configuration
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
    title: 'Choose Dashboard',
    description: 'Select your preferred dashboard view',
    component: Step4SetMode,
    required: false,
    icon: Sparkles,
    color: 'var(--color-secondary-600)'
  }
];

/**
 * Main onboarding flow component
 */
export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthStore();
  const { initializeFinancialState } = useFinancialStateStore();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already onboarded
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete');
    if (onboardingComplete === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  /**
   * Handle step completion
   * @param {number} stepId - Step ID
   * @param {Object} data - Step data
   */
  const handleStepComplete = (stepId, data) => {
    setStepData(prev => ({ ...prev, [stepId]: data }));
    
    // Show success toast for step completion
    const stepConfig = ONBOARDING_STEPS[stepId - 1];
    toast({
      title: "Step Complete!",
      description: `${stepConfig.title} completed successfully.`,
      variant: "default"
    });
    
    if (stepId < ONBOARDING_STEPS.length) {
      setCurrentStep(stepId + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  /**
   * Handle onboarding completion
   */
  const handleOnboardingComplete = async () => {
    setIsLoading(true);
    
    try {
      // Initialize financial state with onboarding data
      await initializeFinancialState(stepData);
      
      // Mark user as onboarded in localStorage
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
      localStorage.setItem('alphaframe_onboarding_data', JSON.stringify(stepData));
      
      // Show success toast
      toast({
        title: "Welcome to AlphaFrame!",
        description: "Your account has been set up successfully. Let's get started!",
        variant: "default"
      });
      
      // Redirect to dashboard
      navigate('/dashboard', { 
        state: { 
          welcome: true,
          onboardingComplete: true 
        } 
      });
      
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

  const currentStepConfig = ONBOARDING_STEPS[currentStep - 1];
  const CurrentStepComponent = currentStepConfig.component;
  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;
  const canGoBack = currentStep > 1;
  const canSkip = !currentStepConfig.required;
  const isLastStep = currentStep === ONBOARDING_STEPS.length;

  return (
    <div className="onboarding-container">
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
                Let's get you set up in just a few minutes
              </p>
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