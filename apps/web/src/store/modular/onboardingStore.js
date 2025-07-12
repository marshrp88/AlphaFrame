/**
 * Onboarding Store - Modular Zustand Store for Onboarding State
 * 
 * Purpose: Dedicated state management for onboarding flow, including
 * step tracking, user data collection, and onboarding completion status.
 * 
 * Features:
 * - Step-by-step onboarding progress
 * - User data collection and validation
 * - Onboarding completion tracking
 * - Integration with XState FSM
 * - Demo mode onboarding bypass
 * 
 * Conclusion: Isolated onboarding logic for better maintainability and testing.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

// Validation schemas for onboarding data
const UserDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  goals: z.array(z.string()).optional(),
});

const BankDataSchema = z.object({
  institution: z.string().optional(),
  accounts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  })).optional(),
});

const BudgetSchema = z.object({
  categories: z.array(z.object({
    name: z.string(),
    limit: z.number().positive(),
  })),
  monthlyIncome: z.number().positive().optional(),
});

const OnboardingDataSchema = z.object({
  userData: UserDataSchema,
  bankData: BankDataSchema.optional(),
  budget: BudgetSchema.optional(),
  rules: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    condition: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional(),
  dashboardMode: z.enum(['standard', 'advanced', 'minimal']).default('standard'),
});

export const useOnboardingStore = create(
  persist(
    (set, get) => ({
      // Onboarding state
      isOnboarding: false,
      currentStep: 1,
      totalSteps: 6,
      isCompleted: false,
      
      // Onboarding data
      userData: {},
      bankData: {},
      budget: {},
      rules: [],
      dashboardMode: 'standard',
      
      // Validation and errors
      validationErrors: {},
      stepErrors: {},
      
      // Actions
      startOnboarding: () => {
        set({
          isOnboarding: true,
          currentStep: 1,
          isCompleted: false,
          validationErrors: {},
          stepErrors: {},
        });
      },
      
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      
      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      goToStep: (step) => {
        const { totalSteps } = get();
        if (step >= 1 && step <= totalSteps) {
          set({ currentStep: step });
        }
      },
      
      updateUserData: (data) => {
        set((state) => ({
          userData: { ...state.userData, ...data },
        }));
      },
      
      updateBankData: (data) => {
        set((state) => ({
          bankData: { ...state.bankData, ...data },
        }));
      },
      
      updateBudget: (data) => {
        set((state) => ({
          budget: { ...state.budget, ...data },
        }));
      },
      
      addRule: (rule) => {
        set((state) => ({
          rules: [...state.rules, { ...rule, id: `rule_${Date.now()}` }],
        }));
      },
      
      removeRule: (ruleId) => {
        set((state) => ({
          rules: state.rules.filter(rule => rule.id !== ruleId),
        }));
      },
      
      setDashboardMode: (mode) => {
        set({ dashboardMode: mode });
      },
      
      setValidationError: (field, error) => {
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [field]: error,
          },
        }));
      },
      
      clearValidationError: (field) => {
        set((state) => {
          const newErrors = { ...state.validationErrors };
          delete newErrors[field];
          return { validationErrors: newErrors };
        });
      },
      
      setStepError: (step, error) => {
        set((state) => ({
          stepErrors: {
            ...state.stepErrors,
            [step]: error,
          },
        }));
      },
      
      clearStepError: (step) => {
        set((state) => {
          const newErrors = { ...state.stepErrors };
          delete newErrors[step];
          return { stepErrors: newErrors };
        });
      },
      
      validateStep: (step) => {
        const state = get();
        
        try {
          switch (step) {
            case 1: // User data
              UserDataSchema.parse(state.userData);
              break;
            case 2: // Bank connection (optional)
              if (Object.keys(state.bankData).length > 0) {
                BankDataSchema.parse(state.bankData);
              }
              break;
            case 3: // Budget setup
              if (Object.keys(state.budget).length > 0) {
                BudgetSchema.parse(state.budget);
              }
              break;
            case 4: // Automation learning (no validation needed)
              break;
            case 5: // Rule creation (optional)
              break;
            case 6: // Dashboard mode (has default)
              break;
            default:
              throw new Error(`Unknown step: ${step}`);
          }
          
          // Clear step error if validation passes
          get().clearStepError(step);
          return true;
        } catch (error) {
          get().setStepError(step, error.message);
          return false;
        }
      },
      
      validateAll: () => {
        const { totalSteps } = get();
        let isValid = true;
        
        for (let step = 1; step <= totalSteps; step++) {
          if (!get().validateStep(step)) {
            isValid = false;
          }
        }
        
        return isValid;
      },
      
      completeOnboarding: () => {
        // Validate all data before completion
        if (!get().validateAll()) {
          throw new Error('Onboarding data validation failed');
        }
        
        set({
          isOnboarding: false,
          isCompleted: true,
          currentStep: get().totalSteps,
        });
        
        // Store completion in localStorage for persistence
        localStorage.setItem('alphaframe_onboarding_complete', 'true');
        localStorage.setItem('alphaframe_onboarding_data', JSON.stringify(get().getOnboardingData()));
      },
      
      skipOnboarding: () => {
        set({
          isOnboarding: false,
          isCompleted: true,
          currentStep: get().totalSteps,
        });
        
        // Mark as completed for demo mode
        localStorage.setItem('alphaframe_onboarding_complete', 'true');
      },
      
      resetOnboarding: () => {
        set({
          isOnboarding: false,
          currentStep: 1,
          isCompleted: false,
          userData: {},
          bankData: {},
          budget: {},
          rules: [],
          dashboardMode: 'standard',
          validationErrors: {},
          stepErrors: {},
        });
        
        // Clear localStorage
        localStorage.removeItem('alphaframe_onboarding_complete');
        localStorage.removeItem('alphaframe_onboarding_data');
      },
      
      // Utility getters
      getOnboardingData: () => {
        const state = get();
        return {
          userData: state.userData,
          bankData: state.bankData,
          budget: state.budget,
          rules: state.rules,
          dashboardMode: state.dashboardMode,
        };
      },
      
      getStepProgress: () => {
        const { currentStep, totalSteps } = get();
        return (currentStep / totalSteps) * 100;
      },
      
      isStepValid: (step) => {
        const { stepErrors } = get();
        return !stepErrors[step];
      },
      
      hasValidationErrors: () => {
        const { validationErrors, stepErrors } = get();
        return Object.keys(validationErrors).length > 0 || Object.keys(stepErrors).length > 0;
      },
      
      canProceed: (step) => {
        return get().validateStep(step);
      },
      
      // Check if onboarding should be bypassed (demo mode)
      shouldBypassOnboarding: () => {
        const isCompleted = get().isCompleted;
        const localStorageCompleted = localStorage.getItem('alphaframe_onboarding_complete') === 'true';
        return isCompleted || localStorageCompleted;
      },
    }),
    {
      name: 'alphaframe-onboarding-store',
      partialize: (state) => ({
        isCompleted: state.isCompleted,
        currentStep: state.currentStep,
        userData: state.userData,
        bankData: state.bankData,
        budget: state.budget,
        rules: state.rules,
        dashboardMode: state.dashboardMode,
      }),
    }
  )
);

export default useOnboardingStore; 