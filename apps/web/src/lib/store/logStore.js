/**
 * LogStore - Zustand store for managing action logs and execution history
 * 
 * Purpose: Centralized state management for FrameSync action execution logs,
 * providing a persistent record of all rule executions and their outcomes.
 * 
 * Procedure:
 * 1. Store action execution logs with timestamps and metadata
 * 2. Provide methods to add, query, and clear logs
 * 3. Maintain execution history for audit and debugging
 * 4. Support filtering and searching through logs
 * 
 * Conclusion: Essential store for tracking FrameSync rule execution
 * and providing transparency into automated financial actions.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Action Log Entry Structure
 * @typedef {Object} ActionLogEntry
 * @property {string} id - Unique identifier for the log entry
 * @property {string} ruleId - ID of the rule that was executed
 * @property {string} actionType - Type of action (PLAID_TRANSFER, WEBHOOK, etc.)
 * @property {Object} payload - Action payload data
 * @property {string} status - Execution status (success, failed, pending)
 * @property {string} timestamp - ISO timestamp of execution
 * @property {string} [error] - Error message if execution failed
 * @property {Object} [result] - Execution result data
 */

/**
 * LogStore State Interface
 * @typedef {Object} LogStoreState
 * @property {ActionLogEntry[]} actionLog - Array of action log entries
 * @property {Function} addLogEntry - Add a new log entry
 * @property {Function} clearLogs - Clear all logs
 * @property {Function} getLogsByRule - Get logs for a specific rule
 * @property {Function} getLogsByStatus - Get logs by execution status
 * @property {Function} getRecentLogs - Get recent logs with limit
 */

export const useLogStore = create(
  persist(
    (set, get) => ({
      // Action log entries
      actionLog: [],

      /**
       * Add a new action log entry
       * @param {ActionLogEntry} entry - The log entry to add
       */
      addLogEntry: (entry) => {
        const newEntry = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...entry
        };

        set((state) => ({
          actionLog: [newEntry, ...state.actionLog]
        }));

        // Keep only last 1000 entries to prevent memory issues
        const currentLogs = get().actionLog;
        if (currentLogs.length > 1000) {
          set({ actionLog: currentLogs.slice(0, 1000) });
        }
      },

      /**
       * Clear all action logs
       */
      clearLogs: () => {
        set({ actionLog: [] });
      },

      /**
       * Get logs for a specific rule
       * @param {string} ruleId - The rule ID to filter by
       * @returns {ActionLogEntry[]} Filtered log entries
       */
      getLogsByRule: (ruleId) => {
        const { actionLog } = get();
        return actionLog.filter(entry => entry.ruleId === ruleId);
      },

      /**
       * Get logs by execution status
       * @param {string} status - The status to filter by
       * @returns {ActionLogEntry[]} Filtered log entries
       */
      getLogsByStatus: (status) => {
        const { actionLog } = get();
        return actionLog.filter(entry => entry.status === status);
      },

      /**
       * Get recent logs with optional limit
       * @param {number} limit - Maximum number of logs to return
       * @returns {ActionLogEntry[]} Recent log entries
       */
      getRecentLogs: (limit = 50) => {
        const { actionLog } = get();
        return actionLog.slice(0, limit);
      },

      /**
       * Get logs within a date range
       * @param {Date} startDate - Start date for filtering
       * @param {Date} endDate - End date for filtering
       * @returns {ActionLogEntry[]} Filtered log entries
       */
      getLogsByDateRange: (startDate, endDate) => {
        const { actionLog } = get();
        return actionLog.filter(entry => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= startDate && entryDate <= endDate;
        });
      }
    }),
    {
      name: 'alphaframe-action-logs',
      version: 1
    }
  )
); 