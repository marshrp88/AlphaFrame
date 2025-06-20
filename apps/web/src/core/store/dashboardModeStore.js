/**
 * dashboardModeStore.js - AlphaPro VX.0
 *
 * Purpose: Centralized store for managing dashboard modes (Planner, Investor, Minimalist)
 * with persistence, validation, and integration with all AlphaPro services.
 *
 * Procedure:
 * 1. Manages current dashboard mode state
 * 2. Validates mode switching and data persistence
 * 3. Integrates with ExecutionLogService for auditability
 * 4. Provides mode-specific data and preferences
 * 5. Ensures mutual exclusivity of modes
 *
 * Conclusion: Provides robust, persistent, and auditable dashboard mode management
 * that integrates seamlessly with all AlphaPro services.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import executionLogService from '../services/ExecutionLogService.js';

// Valid dashboard modes
const DASHBOARD_MODES = {
  PLANNER: 'PLANNER',
  INVESTOR: 'INVESTOR', 
  MINIMALIST: 'MINIMALIST'
};

// Mode-specific configurations and integrations
const MODE_CONFIGS = {
  [DASHBOARD_MODES.PLANNER]: {
    name: 'Planner',
    description: 'Comprehensive view for detailed financial planning',
    icon: '📊',
    color: 'blue',
    services: ['BudgetService', 'CashFlowService', 'NarrativeService', 'RuleEngine', 'TimelineSimulator'],
    features: ['Budget Tracking', 'Cash Flow Analysis', 'Goal Progress', 'Detailed Insights'],
    layout: 'detailed',
    dataRequirements: ['budgets', 'cashFlow', 'goals', 'rules']
  },
  [DASHBOARD_MODES.INVESTOR]: {
    name: 'Investor',
    description: 'Portfolio-focused view for investment decisions',
    icon: '📈',
    color: 'green',
    services: ['PortfolioAnalyzer', 'TimelineSimulator', 'ReportCenter'],
    features: ['Portfolio Analysis', 'Allocation Drift', 'Performance Metrics', 'Rebalancing Alerts'],
    layout: 'portfolio',
    dataRequirements: ['portfolios', 'allocations', 'performance']
  },
  [DASHBOARD_MODES.MINIMALIST]: {
    name: 'Minimalist',
    description: 'Clean, essential view for quick overview',
    icon: '🎯',
    color: 'purple',
    services: ['ExecutionLogService', 'ReportCenter'],
    features: ['Key Metrics', 'Recent Activity', 'Quick Actions', 'Essential Alerts'],
    layout: 'minimal',
    dataRequirements: ['summary', 'recentActivity']
  }
};

/**
 * Dashboard Mode Store
 * Manages dashboard mode state with persistence and validation
 */
export const useDashboardModeStore = create(
  persist(
    (set, get) => ({
      // Current dashboard mode
      currentMode: DASHBOARD_MODES.PLANNER,
      
      // Mode switching history for analytics
      modeHistory: [],
      
      // Mode-specific preferences
      modePreferences: {
        [DASHBOARD_MODES.PLANNER]: {
          showDetailedMetrics: true,
          autoRefresh: true,
          defaultTimeframe: 'monthly'
        },
        [DASHBOARD_MODES.INVESTOR]: {
          showRiskMetrics: true,
          rebalancingAlerts: true,
          performanceTimeframe: 'quarterly'
        },
        [DASHBOARD_MODES.MINIMALIST]: {
          showNotifications: false,
          quickActions: true,
          essentialOnly: true
        }
      },

      /**
       * Switch to a different dashboard mode
       * @param {string} newMode - The mode to switch to
       * @returns {Promise<boolean>} Success status
       */
      switchMode: async (newMode) => {
        try {
          // Validate mode
          if (!Object.values(DASHBOARD_MODES).includes(newMode)) {
            throw new Error(`Invalid dashboard mode: ${newMode}`);
          }

          const currentMode = get().currentMode;
          
          // Don't switch if already in the requested mode
          if (currentMode === newMode) {
            return true;
          }

          // Log the mode switch
          await executionLogService.log('dashboard.mode.switched', {
            fromMode: currentMode,
            toMode: newMode,
            timestamp: new Date().toISOString()
          });

          // Update state
          set(state => ({
            currentMode: newMode,
            modeHistory: [
              {
                fromMode: currentMode,
                toMode: newMode,
                timestamp: new Date().toISOString()
              },
              ...state.modeHistory.slice(0, 9) // Keep last 10 switches
            ]
          }));

          return true;
        } catch (error) {
          await executionLogService.logError('dashboard.mode.switch.failed', error, {
            attemptedMode: newMode,
            currentMode: get().currentMode
          });
          throw error;
        }
      },

      /**
       * Get current mode configuration
       * @returns {Object} Current mode configuration
       */
      getCurrentModeConfig: () => {
        const currentMode = get().currentMode;
        return MODE_CONFIGS[currentMode] || null;
      },

      /**
       * Get configuration for a specific mode
       * @param {string} mode - The mode to get config for
       * @returns {Object} Mode configuration
       */
      getModeConfig: (mode) => {
        return MODE_CONFIGS[mode] || null;
      },

      /**
       * Get all available modes
       * @returns {Array} Array of available modes
       */
      getAvailableModes: () => {
        return Object.values(DASHBOARD_MODES);
      },

      /**
       * Update preferences for current mode
       * @param {Object} preferences - New preferences
       */
      updateModePreferences: (preferences) => {
        const currentMode = get().currentMode;
        set(state => ({
          modePreferences: {
            ...state.modePreferences,
            [currentMode]: {
              ...state.modePreferences[currentMode],
              ...preferences
            }
          }
        }));
      },

      /**
       * Get preferences for current mode
       * @returns {Object} Current mode preferences
       */
      getCurrentModePreferences: () => {
        const currentMode = get().currentMode;
        return get().modePreferences[currentMode] || {};
      },

      /**
       * Get mode switching history
       * @param {number} limit - Number of entries to return
       * @returns {Array} Mode switching history
       */
      getModeHistory: (limit = 10) => {
        return get().modeHistory.slice(0, limit);
      },

      /**
       * Reset mode to default (Planner)
       */
      resetToDefault: async () => {
        await get().switchMode(DASHBOARD_MODES.PLANNER);
      },

      /**
       * Validate if a mode switch is allowed
       * @param {string} newMode - The mode to validate
       * @returns {boolean} Whether the switch is allowed
       */
      isModeSwitchAllowed: (newMode) => {
        // Basic validation - could be extended with business rules
        return Object.values(DASHBOARD_MODES).includes(newMode);
      },

      /**
       * Get mode-specific data requirements
       * @param {string} mode - The mode to check
       * @returns {Array} Required data types
       */
      getModeDataRequirements: (mode) => {
        const config = MODE_CONFIGS[mode];
        return config ? config.dataRequirements : [];
      },

      /**
       * Check if current mode has all required services
       * @returns {boolean} Whether all services are available
       */
      hasRequiredServices: () => {
        const currentConfig = get().getCurrentModeConfig();
        if (!currentConfig) return false;
        
        // This would check if all required services are loaded/available
        // For now, we'll assume all services are available
        return true;
      }
    }),
    {
      name: 'dashboard-mode',
      partialize: (state) => ({
        currentMode: state.currentMode,
        modeHistory: state.modeHistory,
        modePreferences: state.modePreferences
      })
    }
  )
);

// Export constants for use in components
export { DASHBOARD_MODES, MODE_CONFIGS }; 