/**
 * DemoModeService.js - Centralized Demo Mode Management
 * 
 * Purpose: Single source of truth for all demo mode logic across AlphaFrame.
 * Eliminates fragmentation and provides consistent demo behavior.
 * 
 * Procedure:
 * 1. Check demo status via sessionStorage
 * 2. Enable/disable demo mode
 * 3. Auto-complete onboarding for demo users
 * 4. Provide demo data access
 * 
 * Conclusion: Centralized demo logic prevents routing and state conflicts.
 */

export const DemoModeService = {
  /**
   * Check if user is currently in demo mode
   * @returns {boolean} True if demo mode is active
   */
  isDemo: () => {
    return sessionStorage.getItem('demo_user') === 'true';
  },

  /**
   * Enable demo mode and set up demo environment
   */
  enable: () => {
    sessionStorage.setItem('demo_user', 'true');
    // Auto-complete onboarding for demo users
    localStorage.setItem('alphaframe_onboarding_complete', 'true');
    console.log('🔧 DemoModeService: Demo mode enabled');
  },

  /**
   * Disable demo mode and clean up demo state
   */
  disable: () => {
    sessionStorage.removeItem('demo_user');
    localStorage.removeItem('alphaframe_onboarding_complete');
    console.log('🔧 DemoModeService: Demo mode disabled');
  },

  /**
   * Demo users ALWAYS bypass onboarding
   * @returns {boolean} Always true for demo users
   */
  shouldBypassOnboarding: () => {
    return true; // Demo users never need onboarding
  },

  /**
   * Auto-complete onboarding for demo users
   */
  completeOnboarding: () => {
    localStorage.setItem('alphaframe_onboarding_complete', 'true');
    console.log('🔧 DemoModeService: Onboarding auto-completed for demo user');
  },

  /**
   * Get demo user ID for storage isolation
   * @returns {string} Demo user identifier
   */
  getDemoUserId: () => {
    return 'demo-user-' + Date.now();
  },

  /**
   * Check if demo mode is properly configured
   * @returns {boolean} True if demo mode is valid
   */
  isValid: () => {
    const isDemo = sessionStorage.getItem('demo_user') === 'true';
    const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete') === 'true';
    return isDemo && onboardingComplete;
  }
};

export default DemoModeService; 