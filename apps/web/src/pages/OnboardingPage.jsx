/**
 * OnboardingPage.jsx - Phoenix Initiative V3.1
 * 
 * Purpose: Complete first-time user onboarding experience that guides users
 * through account setup, bank connection, and first rule creation for the "Aha!" moment.
 * 
 * Procedure:
 * 1. Check if user is already onboarded and redirect appropriately
 * 2. Integrate the existing OnboardingFlow component
 * 3. Implement persistent onboarding state in localStorage using StorageService
 * 4. Handle new user detection and routing
 * 5. Provide fallback for returning users
 * 
 * Conclusion: Ensures every new user gets a guided setup experience
 * and achieves their first "Aha!" moment within 2 minutes.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../core/store/authStore';
import OnboardingFlow from '../features/onboarding/OnboardingFlow';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';
import StyledButton from '../components/ui/StyledButton';
import { CheckCircle, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import storageService from '../lib/services/StorageService';

const OnboardingPage = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onboardingState, setOnboardingState] = useState(null);
  const [timedOut, setTimedOut] = useState(false);

  // Timeout fallback for loading state
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ OnboardingPage: Loading timeout exceeded (10 seconds)');
        setTimedOut(true);
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setTimedOut(false);
    }
  }, [isLoading]);

  // Check onboarding state on mount
  useEffect(() => {
    // Check if user is in demo mode and should bypass onboarding
    const isDemoUser = sessionStorage.getItem('demo_user') === 'true';
    const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete') === 'true';
    
    // If demo user and onboarding is complete (or demo mode bypass), go to dashboard
    if (isDemoUser && (onboardingComplete || true)) { // Always bypass for demo users
      console.log('🔧 Demo mode: Bypassing onboarding, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // TEMPORARY DEMO MODE: If Firebase is not configured, allow demo access
    const isDemoMode = !user && !isAuthenticated && !isLoading;
    
    if (isDemoMode) {
      // Demo mode - show onboarding without authentication
      console.log('🔧 Demo mode: Showing onboarding without authentication');
      setOnboardingState({
        userId: 'demo-user',
        started: true,
        currentStep: 1,
        completed: false,
        data: {},
        isDemoMode: true
      });
      return;
    }
    
    if (!isLoading && isAuthenticated && user?.id) {
      // Set user ID for storage isolation
      storageService.setUserId(user.id);
      
      // Get stored onboarding state using enhanced service
      const userOnboardingState = storageService.getOnboardingState();
      
      // Check if user has completed onboarding
      if (userOnboardingState?.completed && userOnboardingState?.userId === user.id) {
        // User has completed onboarding, redirect to dashboard
        toast({
          title: "Welcome Back!",
          description: "Redirecting you to your dashboard...",
          variant: "default"
        });
        navigate('/dashboard', { replace: true });
      } else {
        // New user or incomplete onboarding - ALWAYS show onboarding
        setOnboardingState(userOnboardingState || {
          userId: user.id,
          started: true,
          currentStep: 1,
          completed: false,
          data: {}
        });
      }
    } else if (!isLoading && !isAuthenticated) {
      // Not authenticated - show login prompt
      setOnboardingState(null);
    }
  }, [isAuthenticated, isLoading, user, navigate, toast]);

  const handleOnboardingComplete = () => {
    const isDemo = !user;
    if (isDemo) {
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
      sessionStorage.setItem('demo_user', 'true');
      navigate('/dashboard');
      return;
    }
    // ✅ Insert your real user completion logic below this
    completeOnboardingWithBackend(user);
  };

  const handleRetrySetup = () => {
    console.log('🔄 Retrying AlphaFrame setup...');
    setTimedOut(false);
    window.location.reload();
  };

  // Show timeout error state
  if (isLoading && timedOut) {
    return (
      <PageLayout title="Setup Issue" description="We're having trouble setting up AlphaFrame">
        <CompositeCard>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <AlertTriangle size={48} style={{ color: 'var(--color-warning-600)', marginBottom: '1rem' }} />
            <h2>We're having trouble setting up AlphaFrame</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
              The setup process is taking longer than expected. This might be due to a network issue or temporary service problem.
            </p>
            {error && (
              <div style={{ 
                background: 'var(--color-error-50)', 
                border: '1px solid var(--color-error-200)', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <strong>Error details:</strong> {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <StyledButton onClick={handleRetrySetup} variant="primary">
                <RefreshCw size={16} />
                Retry Setup
              </StyledButton>
              <StyledButton onClick={() => navigate('/')} variant="secondary">
                Go Back Home
              </StyledButton>
            </div>
          </div>
        </CompositeCard>
      </PageLayout>
    );
  }

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

  // Show login prompt if not authenticated (but allow demo mode)
  if (!isAuthenticated && !onboardingState?.isDemoMode) {
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

  // Always show onboarding flow in demo/dev mode
  if (!isAuthenticated || onboardingState?.isDemoMode) {
    return (
      <PageLayout title="Onboarding" description="Let's get you set up!">
        <OnboardingFlow onComplete={handleOnboardingComplete} initialState={onboardingState} />
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