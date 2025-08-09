/**
 * RouteGuard.jsx - Unified Route Protection with Demo Mode Support
 * 
 * Purpose: Single source of truth for all routing logic.
 * Handles onboarding bypass and demo mode routing consistently.
 * 
 * Procedure:
 * 1. Check demo mode status via DemoModeService
 * 2. Check onboarding completion via unified store
 * 3. Redirect appropriately based on user state
 * 4. Provide consistent routing behavior
 * 
 * Conclusion: Centralized routing prevents redirect loops and ensures proper navigation.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import DemoModeService from '../lib/services/DemoModeService';
import { useOnboardingStore } from '../store/modular/onboardingStore';

// Pure decision helper exported for unit tests
export const evaluateRouteDecision = ({ isAuthenticated, isDemo, onboardingDone, path }) => {
  const PUBLIC = new Set(['/', '/home', '/about', '/onboarding']);
  if (!isAuthenticated && !isDemo) {
    if (path === '/dashboard') return '/';
    return PUBLIC.has(path) ? path : '/';
  }
  if (isDemo) {
    if (!onboardingDone) return path === '/dashboard' ? '/onboarding' : path;
    if (path === '/onboarding') return '/dashboard';
    return path;
  }
  if (isAuthenticated) {
    if (!onboardingDone) return path === '/dashboard' ? '/onboarding' : path;
    if (path === '/onboarding') return '/dashboard';
    return path;
  }
  return path;
};

const RouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get state from unified store
  const {
    isDemo,
    onboardingComplete,
    isAuthenticated,
    initializeApp,
    shouldBypassOnboarding
  } = useAppStore();

  // Read FSM completion as an additional signal
  const { fsmState } = useOnboardingStore();

  useEffect(() => {
    // Initialize app state on mount
    initializeApp();
    setIsInitialized(true);
  }, [initializeApp]);

  useEffect(() => {
    if (!isInitialized) return;

    const currentPath = location.pathname;
    const isDemoMode = DemoModeService.isDemo();
    
    console.log('🔧 RouteGuard:', {
      currentPath,
      isDemoMode,
      onboardingComplete,
      shouldBypass: shouldBypassOnboarding()
    });

    const onboardingDone = shouldBypassOnboarding() || fsmState === 'done';
    const dest = evaluateRouteDecision({
      isAuthenticated,
      isDemo: isDemoMode || isDemo,
      onboardingDone,
      path: currentPath,
    });
    if (dest !== currentPath) {
      navigate(dest, { replace: true });
      return;
    }

    // Allow access to the requested route
    console.log('🔧 RouteGuard: Allowing access to', currentPath);
  }, [isInitialized, location.pathname, isDemo, onboardingComplete, shouldBypassOnboarding, fsmState, navigate]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Initializing...</div>
      </div>
    );
  }

  return children;
};

export default RouteGuard; 