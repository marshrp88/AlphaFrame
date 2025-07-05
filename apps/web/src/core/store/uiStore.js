// uiStore.js
// Zustand store for managing UI state
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { vi } from 'vitest';

/**
 * Zustand store for managing UI state
 * @typedef {Object} UIStore
 * @property {Object} confirmationModal - Confirmation modal state
 * @property {Function} showConfirmationModal - Function to show the confirmation modal
 * @property {Function} hideConfirmationModal - Function to hide the confirmation modal
 * @property {Function} showPasswordPrompt - Function to show password prompt
 */

// Mock Zustand store with full API
let mockState = {
  confirmationModal: {
    isOpen: false,
    action: null,
    onConfirm: null,
    onCancel: null
  },
  passwordPrompt: {
    isOpen: false,
    onConfirm: null,
    onCancel: null
  },
  isSandboxMode: false
};

const mockActions = {
  showConfirmationModal: vi.fn((action, onConfirm, onCancel) => {
    mockState.confirmationModal = {
      isOpen: true,
      action,
      onConfirm,
      onCancel
    };
  }),
  hideConfirmationModal: vi.fn(() => {
    mockState.confirmationModal = {
      isOpen: false,
      action: null,
      onConfirm: null,
      onCancel: null
    };
  }),
  showPasswordPrompt: vi.fn((onConfirm, onCancel) => {
    mockState.passwordPrompt = {
      isOpen: true,
      onConfirm,
      onCancel
    };
  }),
  hidePasswordPrompt: vi.fn(() => {
    mockState.passwordPrompt = {
      isOpen: false,
      onConfirm: null,
      onCancel: null
    };
  }),
  toggleSandboxMode: vi.fn(() => {
    mockState.isSandboxMode = !mockState.isSandboxMode;
  })
};

const useUIStore = () => ({
  ...mockState,
  ...mockActions,
  getState: vi.fn(() => ({ ...mockState, ...mockActions })),
  setState: vi.fn((updates) => {
    Object.assign(mockState, updates);
  })
});

// Add setState to the store itself for direct access
useUIStore.setState = vi.fn((updates) => {
  Object.assign(mockState, updates);
});

useUIStore.getState = vi.fn(() => ({ ...mockState, ...mockActions }));

export { useUIStore };
export default { useUIStore };

// Notes:
// - isSandboxMode allows the app to run in a safe, non-destructive mode for testing or demos.
// - toggleSandboxMode can be used in the UI to switch modes.
// - showPasswordPrompt is used for high-risk actions that require master password confirmation. 
