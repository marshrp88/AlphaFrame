/**
 * Onboarding Machine - XState FSM for AlphaFrame Onboarding
 * 
 * Purpose: Replace imperative onboarding logic with a declarative state machine
 * that handles all edge cases, timeouts, and error states properly.
 * 
 * States:
 * - idle: Initial state
 * - checking: Checking if user should bypass onboarding
 * - connecting: Connecting to bank via Plaid
 * - reviewing: Reviewing transactions
 * - budgeting: Setting up budget
 * - learning: Learning automation
 * - creating: Creating first rule
 * - choosing: Choosing dashboard mode
 * - completed: Onboarding complete
 * - error: Error state with retry options
 * - timeout: Timeout state with recovery options
 * 
 * Events:
 * - START: Begin onboarding process
 * - BYPASS: Skip onboarding (demo mode)
 * - CONNECT: Connect bank account
 * - REVIEW: Review transactions
 * - BUDGET: Set up budget
 * - LEARN: Learn automation
 * - CREATE: Create first rule
 * - CHOOSE: Choose dashboard mode
 * - COMPLETE: Complete onboarding
 * - ERROR: Handle error
 * - TIMEOUT: Handle timeout
 * - RETRY: Retry from error/timeout
 * - RESET: Reset to initial state
 */

import { createMachine, assign } from 'xstate';

export const onboardingMachine = createMachine({
  id: 'onboarding',
  initial: 'idle',
  context: {
    step: 1,
    totalSteps: 6,
    userData: {},
    bankData: {},
    transactions: [],
    budget: {},
    rules: [],
    dashboardMode: 'standard',
    error: null,
    isDemo: false,
    timeoutDuration: 10000, // 10 seconds
  },
  states: {
    idle: {
      on: {
        START: {
          target: 'checking',
          actions: assign({
            step: 1,
            error: null,
          }),
        },
        BYPASS: {
          target: 'completed',
          actions: assign({
            isDemo: true,
            step: 6,
          }),
        },
      },
    },
    
    checking: {
      entry: 'checkOnboardingStatus',
      on: {
        BYPASS: {
          target: 'completed',
          actions: assign({
            isDemo: true,
            step: 6,
          }),
        },
        CONTINUE: {
          target: 'connecting',
          actions: assign({
            step: 1,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    connecting: {
      entry: 'startPlaidConnection',
      on: {
        CONNECTED: {
          target: 'reviewing',
          actions: assign({
            bankData: (context, event) => event.bankData,
            step: 2,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'reviewing',
          actions: assign({
            step: 2,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    reviewing: {
      entry: 'loadTransactions',
      on: {
        REVIEWED: {
          target: 'budgeting',
          actions: assign({
            transactions: (context, event) => event.transactions,
            step: 3,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'budgeting',
          actions: assign({
            step: 3,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    budgeting: {
      entry: 'setupBudget',
      on: {
        BUDGET_SET: {
          target: 'learning',
          actions: assign({
            budget: (context, event) => event.budget,
            step: 4,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'learning',
          actions: assign({
            step: 4,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    learning: {
      entry: 'startAutomationEducation',
      on: {
        LEARNED: {
          target: 'creating',
          actions: assign({
            step: 5,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'creating',
          actions: assign({
            step: 5,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    creating: {
      entry: 'createFirstRule',
      on: {
        RULE_CREATED: {
          target: 'choosing',
          actions: assign({
            rules: (context, event) => [...context.rules, event.rule],
            step: 6,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'choosing',
          actions: assign({
            step: 6,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    choosing: {
      entry: 'selectDashboardMode',
      on: {
        MODE_SELECTED: {
          target: 'completed',
          actions: assign({
            dashboardMode: (context, event) => event.mode,
            step: 6,
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.error,
          }),
        },
        TIMEOUT: {
          target: 'timeout',
        },
        SKIP: {
          target: 'completed',
          actions: assign({
            step: 6,
          }),
        },
      },
      after: {
        TIMEOUT_DELAY: 'timeout',
      },
    },
    
    completed: {
      entry: 'completeOnboarding',
      type: 'final',
    },
    
    error: {
      entry: 'handleError',
      on: {
        RETRY: {
          target: 'checking',
          actions: assign({
            error: null,
          }),
        },
        RESET: {
          target: 'idle',
          actions: assign({
            step: 1,
            error: null,
            userData: {},
            bankData: {},
            transactions: [],
            budget: {},
            rules: [],
          }),
        },
        BYPASS: {
          target: 'completed',
          actions: assign({
            isDemo: true,
            step: 6,
          }),
        },
      },
    },
    
    timeout: {
      entry: 'handleTimeout',
      on: {
        RETRY: {
          target: 'checking',
          actions: assign({
            error: null,
          }),
        },
        RESET: {
          target: 'idle',
          actions: assign({
            step: 1,
            error: null,
            userData: {},
            bankData: {},
            transactions: [],
            budget: {},
            rules: [],
          }),
        },
        BYPASS: {
          target: 'completed',
          actions: assign({
            isDemo: true,
            step: 6,
          }),
        },
      },
    },
  },
}, {
  delays: {
    TIMEOUT_DELAY: (context) => context.timeoutDuration,
  },
  actions: {
    checkOnboardingStatus: (context, event) => {
      console.log('🔧 OnboardingMachine: Checking onboarding status');
      // This will be implemented in the service layer
    },
    startPlaidConnection: (context, event) => {
      console.log('🔧 OnboardingMachine: Starting Plaid connection');
      // This will be implemented in the service layer
    },
    loadTransactions: (context, event) => {
      console.log('🔧 OnboardingMachine: Loading transactions');
      // This will be implemented in the service layer
    },
    setupBudget: (context, event) => {
      console.log('🔧 OnboardingMachine: Setting up budget');
      // This will be implemented in the service layer
    },
    startAutomationEducation: (context, event) => {
      console.log('🔧 OnboardingMachine: Starting automation education');
      // This will be implemented in the service layer
    },
    createFirstRule: (context, event) => {
      console.log('🔧 OnboardingMachine: Creating first rule');
      // This will be implemented in the service layer
    },
    selectDashboardMode: (context, event) => {
      console.log('🔧 OnboardingMachine: Selecting dashboard mode');
      // This will be implemented in the service layer
    },
    completeOnboarding: (context, event) => {
      console.log('🔧 OnboardingMachine: Completing onboarding');
      // This will be implemented in the service layer
    },
    handleError: (context, event) => {
      console.error('🔧 OnboardingMachine: Handling error:', context.error);
      // This will be implemented in the service layer
    },
    handleTimeout: (context, event) => {
      console.warn('🔧 OnboardingMachine: Handling timeout');
      // This will be implemented in the service layer
    },
  },
});

export default onboardingMachine; 