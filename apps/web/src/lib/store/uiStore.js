/**
 * UI Store for managing UI state
 */

import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Confirmation modal state
  confirmationModal: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  },

  // Password prompt state
  passwordPrompt: {
    isOpen: false,
    onConfirm: null,
    onCancel: null
  },

  // Sandbox mode
  isSandboxMode: false,

  // Actions
  showConfirmationModal: (title, message, onConfirm, onCancel) => set({
    confirmationModal: {
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel
    }
  }),

  hideConfirmationModal: () => set({
    confirmationModal: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    }
  }),

  showPasswordPrompt: (onConfirm, onCancel) => set({
    passwordPrompt: {
      isOpen: true,
      onConfirm,
      onCancel
    }
  }),

  hidePasswordPrompt: () => set({
    passwordPrompt: {
      isOpen: false,
      onConfirm: null,
      onCancel: null
    }
  }),

  toggleSandboxMode: () => set(state => ({
    isSandboxMode: !state.isSandboxMode
  }))
}));

export default useUIStore; 