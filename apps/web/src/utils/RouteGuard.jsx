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

    // Demo users always bypass onboarding and go to dashboard
    if (isDemoMode) {
      if (currentPath === '/' || currentPath === '/onboarding') {
        console.log('🔧 RouteGuard: Demo user redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    }

    // Non-demo users: check onboarding completion
    if (!shouldBypassOnboarding()) {
      // User needs onboarding
      if (currentPath !== '/onboarding') {
        console.log('🔧 RouteGuard: User needs onboarding, redirecting');
        navigate('/onboarding', { replace: true });
        return;
      }
    } else {
      // User has completed onboarding
      if (currentPath === '/onboarding') {
        console.log('🔧 RouteGuard: User completed onboarding, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }
    }

    // Allow access to the requested route
    console.log('🔧 RouteGuard: Allowing access to', currentPath);
  }, [isInitialized, location.pathname, isDemo, onboardingComplete, shouldBypassOnboarding, navigate]);

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