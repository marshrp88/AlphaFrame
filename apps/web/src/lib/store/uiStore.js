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
  })
})); 