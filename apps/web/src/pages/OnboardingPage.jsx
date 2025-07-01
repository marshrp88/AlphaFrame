/**
 * OnboardingPage.jsx - Phoenix Initiative V3.1
 * 
 * Purpose: Complete first-time user onboarding experience that guides users
 * through account setup, bank connection, and first rule creation for the "Aha!" moment.
 * 
 * Procedure:
 * 1. Check if user is already onboarded and redirect appropriately
 * 2. Integrate the existing OnboardingFlow component
 * 3. Implement persistent onboarding state in localStorage
 * 4. Handle new user detection and routing
 * 5. Provide fallback for returning users
 * 
 * Conclusion: Ensures every new user gets a guided setup experience
 * and achieves their first "Aha!" moment within 2 minutes.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import OnboardingFlow from '../features/onboarding/OnboardingFlow';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';
import StyledButton from '../components/ui/StyledButton';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const OnboardingPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onboardingState, setOnboardingState] = useState(null);

  // Check onboarding state on mount
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const storedState = localStorage.getItem('alphaframe_onboarding_state');
      const userOnboardingState = storedState ? JSON.parse(storedState) : null;
      
      // Check if user has completed onboarding
      if (userOnboardingState?.completed && userOnboardingState?.userId === user?.sub) {
        // User has completed onboarding, redirect to dashboard
        toast({
          title: "Welcome Back!",
          description: "Redirecting you to your dashboard...",
          variant: "default"
        });
        navigate('/dashboard', { replace: true });
      } else {
        // New user or incomplete onboarding
        setOnboardingState(userOnboardingState || {
          userId: user?.sub,
          started: true,
          currentStep: 1,
          completed: false,
          data: {}
        });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, toast]);

  // Handle onboarding completion
  const handleOnboardingComplete = (onboardingData) => {
    const completedState = {
      userId: user?.sub,
      started: true,
      currentStep: 4,
      completed: true,
      completedAt: new Date().toISOString(),
      data: onboardingData
    };
    
    // Save to localStorage
    localStorage.setItem('alphaframe_onboarding_state', JSON.stringify(completedState));
    
    // Show success message
    toast({
      title: "🎉 Welcome to AlphaFrame!",
      description: "Your account is set up and ready to go. Let's explore your dashboard!",
      variant: "default"
    });
    
    // Redirect to dashboard with success state
    navigate('/dashboard', { 
      replace: true,
      state: { 
        onboardingComplete: true,
        firstRuleCreated: onboardingData.firstRule
      }
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout title="Setting Up AlphaFrame" description="Preparing your personalized experience...">
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <h2>Setting Up AlphaFrame</h2>
            <p>Please wait while we prepare your personalized experience...</p>
          </div>
        </CompositeCard>
      </PageLayout>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <PageLayout title="Welcome to AlphaFrame" description="Get started with intelligent financial management">
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h1>Welcome to AlphaFrame</h1>
            <p style={{ marginBottom: '2rem' }}>
              Connect your accounts and start managing your finances intelligently.
            </p>
            <StyledButton onClick={() => navigate('/')}>
              <ArrowRight size={16} />
              Get Started
            </StyledButton>
          </div>
        </CompositeCard>
      </PageLayout>
    );
  }

  // Show onboarding flow for new users
  if (onboardingState && !onboardingState.completed) {
    return (
      <PageLayout title="Welcome to AlphaFrame" description="Let's set up your account in just a few steps">
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          initialState={onboardingState}
        />
      </PageLayout>
    );
  }

  // Fallback for edge cases
  return (
    <PageLayout title="Welcome to AlphaFrame" description="Your account setup">
      <CompositeCard>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle size={48} style={{ color: 'var(--color-success-600)', marginBottom: '1rem' }} />
          <h1>Welcome to AlphaFrame!</h1>
          <p style={{ marginBottom: '2rem' }}>
            Your account is ready. Let's explore your dashboard.
          </p>
          <StyledButton onClick={() => navigate('/dashboard')}>
            <ArrowRight size={16} />
            Go to Dashboard
          </StyledButton>
        </div>
      </CompositeCard>
    </PageLayout>
  );
};

export default OnboardingPage; 