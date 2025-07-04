/**
 * useAppStore.js - Unified State Management with Demo Mode Integration
 * 
 * Purpose: Single source of truth for all application state.
 * Integrates with DemoModeService for consistent demo behavior.
 * 
 * Procedure:
 * 1. Import DemoModeService for demo detection
 * 2. Initialize demo data when in demo mode
 * 3. Provide unified state access
 * 4. Handle persistence automatically
 * 
 * Conclusion: Centralized state prevents conflicts and ensures consistency.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DemoModeService from '../lib/services/DemoModeService';
import { mockTransactions, mockRules, mockTriggeredRules } from '../lib/demo-data/index';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Core state
      isAuthenticated: false,
      user: null,
      onboardingComplete: false,
      isLoading: false,
      error: null,

      // Demo mode state
      isDemo: false,
      demoData: {
        transactions: [],
        rules: [],
        triggeredRules: []
      },

      // Financial data
      transactions: [],
      rules: [],
      triggeredRules: [],

      // UI state
      currentPage: 'home',
      dashboardMode: 'standard',

      // Actions
      initializeApp: () => {
        const isDemo = DemoModeService.isDemo();
        
        if (isDemo) {
          // Initialize demo mode
          DemoModeService.completeOnboarding();
          set({
            isDemo: true,
            onboardingComplete: true,
            isAuthenticated: true,
            transactions: mockTransactions,
            rules: mockRules,
            triggeredRules: mockTriggeredRules,
            demoData: {
              transactions: mockTransactions,
              rules: mockRules,
              triggeredRules: mockTriggeredRules
            }
          });
          console.log('🔧 useAppStore: Demo mode initialized');
        } else {
          // Check onboarding status from localStorage
          const onboardingComplete = localStorage.getItem('alphaframe_onboarding_complete') === 'true';
          set({ onboardingComplete });
        }
      },

      setAuthenticated: (authenticated, user = null) => {
        set({ isAuthenticated: authenticated, user });
      },

      setOnboardingComplete: (complete) => {
        set({ onboardingComplete: complete });
        localStorage.setItem('alphaframe_onboarding_complete', complete.toString());
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      // Demo mode actions
      enableDemo: () => {
        DemoModeService.enable();
        get().initializeApp();
      },

      disableDemo: () => {
        DemoModeService.disable();
        set({
          isDemo: false,
          demoData: { transactions: [], rules: [], triggeredRules: [] },
          onboardingComplete: false
        });
      },

      // Data actions
      setTransactions: (transactions) => {
        set({ transactions });
        if (get().isDemo) {
          set({ demoData: { ...get().demoData, transactions } });
        }
      },

      setRules: (rules) => {
        set({ rules });
        if (get().isDemo) {
          set({ demoData: { ...get().demoData, rules } });
        }
      },

      setTriggeredRules: (triggeredRules) => {
        set({ triggeredRules });
        if (get().isDemo) {
          set({ demoData: { ...get().demoData, triggeredRules } });
        }
      },

      // UI actions
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setDashboardMode: (mode) => {
        set({ dashboardMode: mode });
      },

      // Utility getters
      getTransactions: () => {
        const state = get();
        return state.isDemo ? state.demoData.transactions : state.transactions;
      },

      getRules: () => {
        const state = get();
        return state.isDemo ? state.demoData.rules : state.rules;
      },

      getTriggeredRules: () => {
        const state = get();
        return state.isDemo ? state.demoData.triggeredRules : state.triggeredRules;
      },

      // Check if user should bypass onboarding
      shouldBypassOnboarding: () => {
        const state = get();
        return state.isDemo || state.onboardingComplete;
      }
    }),
    {
      name: 'alphaframe-store',
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        currentPage: state.currentPage,
        dashboardMode: state.dashboardMode
      })
    }
  )
);

export default useAppStore; 