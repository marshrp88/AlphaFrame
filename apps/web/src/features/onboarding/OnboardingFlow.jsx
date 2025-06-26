/**
 * OnboardingFlow.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Complete first-time user onboarding experience
 * that guides users through bank connection, transaction review,
 * budget setup, and dashboard configuration.
 * 
 * Procedure:
 * 1. Detect first-time users and redirect to onboarding
 * 2. Guide through Plaid bank connection
 * 3. Review imported transactions
 * 4. Set up initial budget categories
 * 5. Choose default dashboard mode
 * 6. Mark user as onboarded and redirect to dashboard
 * 
 * Conclusion: Ensures users have a complete setup
 * and positive first experience with AlphaFrame.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../shared/ui/Card.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { Progress } from '../../shared/ui/Progress.jsx';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Step1PlaidConnect from './steps/Step1PlaidConnect.jsx';
import Step2ReviewTransactions from './steps/Step2ReviewTransactions.jsx';
import Step3BudgetSetup from './steps/Step3BudgetSetup.jsx';
import Step4SetMode from './steps/Step4SetMode.jsx';
import { useAuthStore } from '../../core/store/authStore.js';
import { useFinancialStateStore } from '../../core/store/financialStateStore.js';
import { useToast } from '../../components/ui/use-toast.jsx';

/**
 * Onboarding steps configuration
 */
const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Connect Your Bank',
    description: 'Securely connect your bank account to import transactions',
    component: Step1PlaidConnect,
    required: true
  },
  {
    id: 2,
    title: 'Review Transactions',
    description: 'Review and categorize your imported transactions',
    component: Step2ReviewTransactions,
    required: true
  },
  {
    id: 3,
    title: 'Set Up Budget',
    description: 'Create your first budget categories and limits',
    component: Step3BudgetSetup,
    required: true
  },
  {
    id: 4,
    title: 'Choose Dashboard',
    description: 'Select your preferred dashboard view',
    component: Step4SetMode,
    required: false
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
    if (user?.onboarded) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
      
      // Mark user as onboarded
      await updateUserProfile({ onboarded: true });
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AlphaFrame
          </h1>
          <p className="text-gray-600">
            Let&apos;s get you set up in just a few minutes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < ONBOARDING_STEPS.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">
                  {step.description}
                </div>
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          <CurrentStepComponent
            onComplete={(data) => handleStepComplete(currentStep, data)}
            onSkip={handleSkipStep}
            data={stepData[currentStep]}
            isLoading={isLoading}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePreviousStep}
            disabled={!canGoBack || isLoading}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {canSkip && (
              <Button
                onClick={handleSkipStep}
                disabled={isLoading}
                variant="outline"
              >
                Skip
              </Button>
            )}
            
            {isLastStep && (
              <Button
                onClick={handleOnboardingComplete}
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? 'Completing...' : 'Complete Setup'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a
              href="mailto:support@alphaframe.com"
              className="text-blue-600 hover:text-blue-800"
            >
              support@alphaframe.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow; 