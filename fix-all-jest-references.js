/**
 * Comprehensive Jest to Vitest Migration Script
 * 
 * Purpose: Fix all remaining Jest references and import issues for Galileo V2.2 completion
 * Procedure: Replace all jest.* with vi.*, fix import paths, and resolve missing files
 * Conclusion: Ensures complete Vitest compatibility for production readiness
 */

const fs = require('fs');
const path = require('path');

// Files that need Jest to Vitest conversion
const filesToFix = [
  'apps/web/tests/unit/services/PlaidService.test.js',
  'apps/web/src/features/pro/tests/BudgetService.test.js',
  'apps/web/src/features/pro/tests/CashFlowService.test.js',
  'apps/web/src/features/pro/tests/ExecutionLogService.simple.test.js',
  'apps/web/src/features/pro/tests/NarrativeService.test.js',
  'apps/web/src/features/pro/tests/PortfolioAnalyzer.test.js',
  'apps/web/src/features/pro/tests/ReportCenter.test.js',
  'apps/web/src/features/pro/tests/TimelineSimulator.test.js',
  'apps/web/src/lib/services/__tests__/AuthService.test.js',
  'apps/web/src/lib/services/__tests__/PlaidService.fixed.test.js',
  'apps/web/src/lib/services/__tests__/PlaidService.test.js',
  'apps/web/src/features/pro/tests/RuleEngine.test.js',
  'apps/web/src/lib/services/__tests__/ruleEngine.spec.js',
  'apps/web/src/lib/services/__tests__/ruleEngine.test.js',
  'apps/web/src/lib/services/__tests__/RuleExecutionEngine.test.js',
  'apps/web/tests/integration/services/ruleEngine.spec.js',
  'apps/web/tests/unit/services/ExecutionController.test.js',
  'apps/web/tests/unit/services/ExecutionLogService.test.js',
  'apps/web/tests/unit/services/FeedbackUploader.test.js'
];

function fixJestReferences(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add vitest import if not present
  if (!content.includes("import {") || !content.includes("vitest")) {
    const vitestImport = "import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';";
    if (!content.includes("import {") && !content.includes("from 'vitest'")) {
      content = vitestImport + "\n" + content;
      changed = true;
    }
  }

  // Replace jest.* with vi.*
  const jestReplacements = [
    { from: /jest\.fn\(/g, to: 'vi.fn(' },
    { from: /jest\.mock\(/g, to: 'vi.mock(' },
    { from: /jest\.spyOn\(/g, to: 'vi.spyOn(' },
    { from: /jest\.clearAllMocks\(/g, to: 'vi.clearAllMocks(' },
    { from: /jest\.restoreAllMocks\(/g, to: 'vi.restoreAllMocks(' },
    { from: /jest\.resetAllMocks\(/g, to: 'vi.resetAllMocks(' },
    { from: /jest\.restoreAllMocks\(/g, to: 'vi.restoreAllMocks(' },
    { from: /jest\.useFakeTimers\(/g, to: 'vi.useFakeTimers(' },
    { from: /jest\.useRealTimers\(/g, to: 'vi.useRealTimers(' },
    { from: /jest\.advanceTimersByTime\(/g, to: 'vi.advanceTimersByTime(' },
    { from: /jest\.runAllTimers\(/g, to: 'vi.runAllTimers(' },
    { from: /jest\.runOnlyPendingTimers\(/g, to: 'vi.runOnlyPendingTimers(' },
    { from: /jest\.setSystemTime\(/g, to: 'vi.setSystemTime(' },
    { from: /jest\.getRealSystemTime\(/g, to: 'vi.getRealSystemTime(' },
    { from: /jest\.isMockFunction\(/g, to: 'vi.isMockFunction(' },
    { from: /jest\.mocked\(/g, to: 'vi.mocked(' },
    { from: /jest\.requireActual\(/g, to: 'vi.importActual(' },
    { from: /jest\.requireMock\(/g, to: 'vi.importMock(' },
    { from: /jest\.unmock\(/g, to: 'vi.unmock(' },
    { from: /jest\.doMock\(/g, to: 'vi.doMock(' },
    { from: /jest\.dontMock\(/g, to: 'vi.dontMock(' },
    { from: /jest\.setMock\(/g, to: 'vi.setMock(' },
    { from: /jest\.resetModules\(/g, to: 'vi.resetModules(' },
    { from: /jest\.isolateModules\(/g, to: 'vi.isolateModules(' },
    { from: /jest\.retryTimes\(/g, to: 'vi.retryTimes(' },
    { from: /jest\.extend\(/g, to: 'vi.extend(' },
    { from: /jest\.addMatchers\(/g, to: 'vi.addMatchers(' },
    { from: /jest\.addSnapshotSerializer\(/g, to: 'vi.addSnapshotSerializer(' },
    { from: /jest\.getTimerCount\(/g, to: 'vi.getTimerCount(' },
    { from: /jest\.setTimeout\(/g, to: 'vi.setTimeout(' },
    { from: /jest\.getRealSystemTime\(/g, to: 'vi.getRealSystemTime(' },
    { from: /jest\.isMockFunction\(/g, to: 'vi.isMockFunction(' },
    { from: /jest\.mocked\(/g, to: 'vi.mocked(' },
    { from: /jest\.requireActual\(/g, to: 'vi.importActual(' },
    { from: /jest\.requireMock\(/g, to: 'vi.importMock(' },
    { from: /jest\.unmock\(/g, to: 'vi.unmock(' },
    { from: /jest\.doMock\(/g, to: 'vi.doMock(' },
    { from: /jest\.dontMock\(/g, to: 'vi.dontMock(' },
    { from: /jest\.setMock\(/g, to: 'vi.setMock(' },
    { from: /jest\.resetModules\(/g, to: 'vi.resetModules(' },
    { from: /jest\.isolateModules\(/g, to: 'vi.isolateModules(' },
    { from: /jest\.retryTimes\(/g, to: 'vi.retryTimes(' },
    { from: /jest\.extend\(/g, to: 'vi.extend(' },
    { from: /jest\.addMatchers\(/g, to: 'vi.addMatchers(' },
    { from: /jest\.addSnapshotSerializer\(/g, to: 'vi.addSnapshotSerializer(' },
    { from: /jest\.getTimerCount\(/g, to: 'vi.getTimerCount(' },
    { from: /jest\.setTimeout\(/g, to: 'vi.setTimeout(' }
  ];

  jestReplacements.forEach(({ from, to }) => {
    if (content.match(from)) {
      content = content.replace(from, to);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

// Fix import path issues
function fixImportPaths() {
  const importFixes = [
    {
      file: 'apps/web/src/shared/ui/Select.jsx',
      search: "import { cn } from '@/lib/utils.js';",
      replace: "import { cn } from '@/lib/utils';"
    },
    {
      file: 'apps/web/tests/unit/services/ruleEngine.spec.js',
      search: "import { RuleSchema } from '@/lib/validation/schemas';",
      replace: "import { RuleSchema } from '../../../src/lib/validation/schemas';"
    }
  ];

  importFixes.forEach(({ file, search, replace }) => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes(search)) {
        content = content.replace(search, replace);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fixed import: ${file}`);
      }
    }
  });
}

// Create missing files
function createMissingFiles() {
  const missingFiles = [
    {
      path: 'apps/web/src/lib/validation/schemas.js',
      content: `/**
 * Validation Schemas for AlphaFrame Galileo V2.2
 * 
 * Purpose: Define data validation schemas for rule engine and services
 * Procedure: Export validation functions for different data types
 * Conclusion: Ensures data integrity across the application
 */

export const RuleSchema = {
  validate: (rule) => {
    if (!rule || typeof rule !== 'object') return false;
    if (!rule.id || !rule.name || !rule.conditions) return false;
    return true;
  }
};

export const TransactionSchema = {
  validate: (transaction) => {
    if (!transaction || typeof transaction !== 'object') return false;
    if (!transaction.id || !transaction.amount || !transaction.date) return false;
    return true;
  }
};

export const InsightSchema = {
  validate: (insight) => {
    if (!insight || typeof insight !== 'object') return false;
    if (!insight.id || !insight.type || !insight.title) return false;
    return true;
  }
};
`
    },
    {
      path: 'apps/web/src/core/store/financialStateStore.js',
      content: `/**
 * Financial State Store for AlphaFrame Galileo V2.2
 * 
 * Purpose: Manage financial state data across the application
 * Procedure: Use Zustand for state management with persistence
 * Conclusion: Provides centralized financial data management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFinancialStateStore = create(
  persist(
    (set, get) => ({
      accounts: [],
      transactions: [],
      insights: [],
      rules: [],
      
      setAccounts: (accounts) => set({ accounts }),
      setTransactions: (transactions) => set({ transactions }),
      setInsights: (insights) => set({ insights }),
      setRules: (rules) => set({ rules }),
      
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, account]
      })),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, transaction]
      })),
      
      addInsight: (insight) => set((state) => ({
        insights: [...state.insights, insight]
      })),
      
      addRule: (rule) => set((state) => ({
        rules: [...state.rules, rule]
      })),
      
      clearAll: () => set({
        accounts: [],
        transactions: [],
        insights: [],
        rules: []
      })
    }),
    {
      name: 'financial-state-storage'
    }
  )
);
`
    },
    {
      path: 'apps/web/src/core/store/uiStore.js',
      content: `/**
 * UI Store for AlphaFrame Galileo V2.2
 * 
 * Purpose: Manage UI state and preferences across the application
 * Procedure: Use Zustand for state management with persistence
 * Conclusion: Provides centralized UI state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: false,
      currentPage: 'dashboard',
      notifications: [],
      loadingStates: {},
      
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      setLoading: (key, loading) => set((state) => ({
        loadingStates: { ...state.loadingStates, [key]: loading }
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      resetUI: () => set({
        sidebarOpen: false,
        notifications: [],
        loadingStates: {}
      })
    }),
    {
      name: 'ui-state-storage'
    }
  )
);
`
    }
  ];

  missingFiles.forEach(({ path: filePath, content }) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Created: ${filePath}`);
    } else {
      console.log(`⏭️  Already exists: ${filePath}`);
    }
  });
}

// Main execution
console.log('🚀 Starting comprehensive Jest to Vitest migration...\n');

console.log('📝 Fixing Jest references...');
filesToFix.forEach(fixJestReferences);

console.log('\n🔧 Fixing import paths...');
fixImportPaths();

console.log('\n📁 Creating missing files...');
createMissingFiles();

console.log('\n✅ Migration complete! Ready for test execution.'); 