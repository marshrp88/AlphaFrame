// uiStore.js
// Zustand store for managing UI state
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { create } from 'zustand';

/**
 * Zustand store for managing UI state
 * @typedef {Object} UIStore
 * @property {Object} confirmationModal - Confirmation modal state
 * @property {Function} showConfirmationModal - Function to show the confirmation modal
 * @property {Function} hideConfirmationModal - Function to hide the confirmation modal
 */
export const useUIStore = create((set) => ({
  // Initial state
  confirmationModal: {
    isOpen: false,
    action: null,
    onConfirm: null,
    onCancel: null
  },

  // Sandbox mode flag
  isSandboxMode: false, // If true, actions are simulated and not executed for real

  // Actions
  showConfirmationModal: (action, onConfirm, onCancel) => set({
    confirmationModal: {
      isOpen: true,
      action,
      onConfirm,
      onCancel
    }
  }),

  hideConfirmationModal: () => set({
    confirmationModal: {
      isOpen: false,
      action: null,
      onConfirm: null,
      onCancel: null
    }
  }),

  // Toggle sandbox mode
  toggleSandboxMode: () => set((state) => ({ isSandboxMode: !state.isSandboxMode }))
}));

// Notes:
// - isSandboxMode allows the app to run in a safe, non-destructive mode for testing or demos.
// - toggleSandboxMode can be used in the UI to switch modes. 
