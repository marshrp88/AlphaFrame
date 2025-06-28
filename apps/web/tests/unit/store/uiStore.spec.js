// @test-id: uiStore-Unit
// @last-reviewed: 2025-06-18
// @version-hash: <git rev-parse HEAD>

import { describe, it, expect, beforeEach } from '@jest/globals';
import { act } from '@testing-library/react';
import { useUIStore } from '@/core/store/uiStore';

describe('useUIStore Zustand Store', () => {
  beforeEach(() => {
    act(() => {
      useUIStore.setState({
        confirmationModal: {
          isOpen: false,
          action: null,
          onConfirm: null,
          onCancel: null
        },
        isSandboxMode: false
      });
    });
  });

  it('should have initial state', () => {
    const state = useUIStore.getState();
    expect(state.confirmationModal.isOpen).toBe(false);
    expect(state.confirmationModal.action).toBe(null);
    expect(state.isSandboxMode).toBe(false);
  });

  it('should show and hide confirmation modal', () => {
    act(() => {
      useUIStore.getState().showConfirmationModal('test-action', () => {}, () => {});
    });
    let state = useUIStore.getState();
    expect(state.confirmationModal.isOpen).toBe(true);
    expect(state.confirmationModal.action).toBe('test-action');
    expect(typeof state.confirmationModal.onConfirm).toBe('function');
    expect(typeof state.confirmationModal.onCancel).toBe('function');

    act(() => {
      useUIStore.getState().hideConfirmationModal();
    });
    state = useUIStore.getState();
    expect(state.confirmationModal.isOpen).toBe(false);
    expect(state.confirmationModal.action).toBe(null);
  });

  it('should toggle sandbox mode', () => {
    act(() => {
      useUIStore.getState().toggleSandboxMode();
    });
    expect(useUIStore.getState().isSandboxMode).toBe(true);
    act(() => {
      useUIStore.getState().toggleSandboxMode();
    });
    expect(useUIStore.getState().isSandboxMode).toBe(false);
  });
}); 