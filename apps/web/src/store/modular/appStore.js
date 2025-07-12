/**
 * App Store - Modular Zustand Store for Core Application State
 * 
 * Purpose: Centralized state management for core application functionality
 * including initialization, loading states, errors, and global UI state.
 * 
 * Features:
 * - App initialization and hydration
 * - Global loading and error states
 * - Navigation and routing state
 * - Performance monitoring
 * - Demo mode detection
 * 
 * Conclusion: Clean separation of concerns with predictable state updates.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DemoModeService from '../../lib/services/DemoModeService';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Core app state
      isInitialized: false,
      isLoading: false,
      error: null,
      currentPage: 'home',
      
      // Performance and monitoring
      performanceMetrics: {
        loadTime: 0,
        renderTime: 0,
        errorCount: 0,
      },
      
      // Demo mode state
      isDemo: false,
      demoConfig: {
        enabled: false,
        autoComplete: true,
        skipOnboarding: true,
      },
      
      // Actions
      initializeApp: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Check demo mode
          const isDemo = DemoModeService.isDemo();
          
          if (isDemo) {
            DemoModeService.completeOnboarding();
            set({
              isDemo: true,
              demoConfig: {
                enabled: true,
                autoComplete: true,
                skipOnboarding: true,
              },
              isInitialized: true,
              isLoading: false,
            });
            console.log('🔧 AppStore: Demo mode initialized');
            return;
          }
          
          // Normal initialization
          set({
            isInitialized: true,
            isLoading: false,
            isDemo: false,
          });
          
          console.log('🔧 AppStore: Normal mode initialized');
        } catch (error) {
          console.error('❌ AppStore: Initialization failed:', error);
          set({
            error: error.message,
            isLoading: false,
            isInitialized: false,
          });
        }
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
      
      updatePerformanceMetrics: (metrics) => {
        set((state) => ({
          performanceMetrics: {
            ...state.performanceMetrics,
            ...metrics,
          },
        }));
      },
      
      enableDemo: () => {
        DemoModeService.enable();
        get().initializeApp();
      },
      
      disableDemo: () => {
        DemoModeService.disable();
        set({
          isDemo: false,
          demoConfig: {
            enabled: false,
            autoComplete: false,
            skipOnboarding: false,
          },
        });
      },
      
      // Utility getters
      getIsDemo: () => {
        return get().isDemo;
      },
      
      getDemoConfig: () => {
        return get().demoConfig;
      },
      
      getPerformanceMetrics: () => {
        return get().performanceMetrics;
      },
      
      // Check if app is ready for user interaction
      isReady: () => {
        const state = get();
        return state.isInitialized && !state.isLoading && !state.error;
      },
      
      // Reset app state (useful for testing or logout)
      reset: () => {
        set({
          isInitialized: false,
          isLoading: false,
          error: null,
          currentPage: 'home',
          performanceMetrics: {
            loadTime: 0,
            renderTime: 0,
            errorCount: 0,
          },
          isDemo: false,
          demoConfig: {
            enabled: false,
            autoComplete: false,
            skipOnboarding: false,
          },
        });
      },
    }),
    {
      name: 'alphaframe-app-store',
      partialize: (state) => ({
        currentPage: state.currentPage,
        performanceMetrics: state.performanceMetrics,
        demoConfig: state.demoConfig,
      }),
    }
  )
);

export default useAppStore; 