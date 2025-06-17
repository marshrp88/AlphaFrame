// logStore.js
// ActionLogLayer - A Zustand store for managing FrameSync action logs
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Action Log Entry Type
 * @typedef {Object} ActionLogEntry
 * @property {string} id - Unique identifier for the log entry
 * @property {string} actionType - Type of action executed
 * @property {Object} payload - Action configuration
 * @property {string} status - Current status of the action
 * @property {number} timestamp - Unix timestamp of when the action was executed
 * @property {Object} [result] - Result of the action execution
 * @property {string} [error] - Error message if the action failed
 */

/**
 * Log Store State Type
 * @typedef {Object} LogStoreState
 * @property {ActionLogEntry[]} actionLog - Array of action log entries
 * @property {Function} addLogEntry - Function to add a new log entry
 * @property {Function} updateLogEntry - Function to update an existing log entry
 * @property {Function} clearLog - Function to clear the action log
 */

/**
 * Creates a new log entry
 * @param {string} actionType - Type of action executed
 * @param {Object} payload - Action configuration
 * @returns {ActionLogEntry} The created log entry
 */
const createLogEntry = (actionType, payload) => ({
  id: crypto.randomUUID(),
  actionType,
  payload,
  status: 'pending',
  timestamp: Date.now()
});

/**
 * Log Store
 * Manages the action log state and provides methods for log manipulation
 */
export const useLogStore = create(
  persist(
    (set, get) => ({
      actionLog: [],

      /**
       * Adds a new entry to the action log
       * @param {string} actionType - Type of action executed
       * @param {Object} payload - Action configuration
       * @returns {string} The ID of the created log entry
       */
      addLogEntry: (actionType, payload) => {
        const entry = createLogEntry(actionType, payload);
        set(state => ({
          actionLog: [entry, ...state.actionLog]
        }));
        return entry.id;
      },

      /**
       * Updates an existing log entry
       * @param {string} id - ID of the log entry to update
       * @param {Object} updates - Updates to apply to the entry
       * @returns {boolean} Whether the update was successful
       */
      updateLogEntry: (id, updates) => {
        set(state => ({
          actionLog: state.actionLog.map(entry =>
            entry.id === id
              ? { ...entry, ...updates }
              : entry
          )
        }));
        return true;
      },

      /**
       * Clears all entries from the action log
       * @returns {void}
       */
      clearLog: () => {
        set({ actionLog: [] });
      },

      /**
       * Gets the most recent log entries
       * @param {number} [limit=10] - Maximum number of entries to return
       * @returns {ActionLogEntry[]} Array of recent log entries
       */
      getRecentEntries: (limit = 10) => {
        return get().actionLog.slice(0, limit);
      },

      /**
       * Gets log entries for a specific action type
       * @param {string} actionType - Type of action to filter by
       * @returns {ActionLogEntry[]} Array of filtered log entries
       */
      getEntriesByType: (actionType) => {
        return get().actionLog.filter(entry => entry.actionType === actionType);
      }
    }),
    {
      name: 'action-log',
      partialize: (state) => ({ actionLog: state.actionLog })
    }
  )
);

// Use this for storing and managing action logs. 