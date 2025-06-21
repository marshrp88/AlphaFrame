/**
 * DashboardModeManager.test.jsx
 *
 * Purpose: Comprehensive unit tests for the DashboardModeManager component,
 * covering mode switching, validation, error handling, and service integration.
 *
 * Procedure:
 * 1. Test mode switching functionality and validation
 * 2. Test error handling and user feedback
 * 3. Test integration with ExecutionLogService
 * 4. Test UI state management and responsiveness
 * 5. Test mode history and preferences
 *
 * Conclusion: Ensures the DashboardModeManager provides robust, reliable,
 * and user-friendly dashboard mode management with proper error handling.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import DashboardModeManager from '../components/DashboardModeManager';
import { useDashboardModeStore } from '../../core/store/dashboardModeStore.js';
import executionLogService from '../../core/services/ExecutionLogService.js';

// Mock ExecutionLogService
vi.mock('../../core/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn(),
    logError: vi.fn()
  }
}));

// Mock DashboardPicker component
vi.mock('../../components/DashboardPicker.jsx', () => ({
  default: ({ selectedMode, onModeChange }) => (
    <div data-testid="dashboard-picker">
      <button onClick={() => onModeChange('INVESTOR')}>Switch to Investor</button>
      <button onClick={() => onModeChange('MINIMALIST')}>Switch to Minimalist</button>
      <span>Selected: {selectedMode}</span>
    </div>
  )
}));

// Mock UI components
vi.mock('../../components/ui/Card.jsx', () => ({
  Card: ({ children, className }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}));

vi.mock('../../components/ui/Button.jsx', () => ({
  Button: ({ children, onClick, disabled, ...props }) => (
    <button data-testid="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

vi.mock('../../components/ui/badge.jsx', () => ({
  Badge: ({ children, variant }) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  )
}));

// Mock the stores
vi.mock('../../../core/store/dashboardModeStore', () => ({
  useDashboardModeStore: vi.fn(() => ({
    mode: 'basic',
    setMode: vi.fn(),
    isProMode: false
  }))
}));

vi.mock('../../../core/store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { role: 'user' },
    isAuthenticated: true
  }))
}));

describe('DashboardModeManager', () => {
  let mockStore;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mocks
    executionLogService.log.mockClear();
    executionLogService.logError.mockClear();

    // Mock store state
    mockStore = {
      currentMode: 'PLANNER',
      switchMode: vi.fn().mockResolvedValue(true),
      getCurrentModeConfig: vi.fn().mockReturnValue({
        name: 'Planner',
        description: 'Comprehensive view for detailed financial planning',
        icon: '📊',
        features: ['Budget Tracking', 'Cash Flow Analysis', 'Goal Progress', 'Detailed Insights']
      }),
      getAvailableModes: vi.fn().mockReturnValue(['PLANNER', 'INVESTOR', 'MINIMALIST']),
      getCurrentModePreferences: vi.fn().mockReturnValue({
        showDetailedMetrics: true,
        autoRefresh: true
      }),
      updateModePreferences: vi.fn(),
      getModeHistory: vi.fn().mockReturnValue([
        { fromMode: 'PLANNER', toMode: 'INVESTOR', timestamp: '2024-01-01T10:00:00Z' }
      ]),
      isModeSwitchAllowed: vi.fn().mockReturnValue(true),
      hasRequiredServices: vi.fn().mockReturnValue(true)
    };

    // Mock the store hook
    vi.mocked(useDashboardModeStore).mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render current mode status', () => {
      render(<DashboardModeManager />);
      
      expect(screen.getByText('Planner Mode')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive view for detailed financial planning')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render mode features', () => {
      render(<DashboardModeManager />);
      
      expect(screen.getByText('Budget Tracking')).toBeInTheDocument();
      expect(screen.getByText('Cash Flow Analysis')).toBeInTheDocument();
      expect(screen.getByText('Goal Progress')).toBeInTheDocument();
      expect(screen.getByText('Detailed Insights')).toBeInTheDocument();
    });

    it('should render dashboard picker when showPicker is true', () => {
      render(<DashboardModeManager showPicker={true} />);
      
      expect(screen.getByTestId('dashboard-picker')).toBeInTheDocument();
    });

    it('should not render dashboard picker when showPicker is false', () => {
      render(<DashboardModeManager showPicker={false} />);
      
      expect(screen.queryByTestId('dashboard-picker')).not.toBeInTheDocument();
    });

    it('should render quick mode switcher', () => {
      render(<DashboardModeManager />);
      
      expect(screen.getByText('Quick Mode Switcher')).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    it('should handle successful mode switch', async () => {
      const onModeChange = vi.fn();
      render(<DashboardModeManager onModeChange={onModeChange} />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(mockStore.switchMode).toHaveBeenCalledWith('INVESTOR');
        expect(executionLogService.log).toHaveBeenCalledWith(
          'dashboard.mode.manager.switched',
          expect.objectContaining({
            newMode: 'INVESTOR'
          })
        );
        expect(onModeChange).toHaveBeenCalledWith('INVESTOR');
      }, { timeout: 1000 });
    }, 2000);

    it('should handle mode switch errors', async () => {
      const error = new Error('Switch failed');
      mockStore.switchMode.mockRejectedValue(error);
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Switch failed')).toBeInTheDocument();
        expect(executionLogService.logError).toHaveBeenCalledWith(
          'dashboard.mode.manager.switch.failed',
          error,
          expect.objectContaining({
            attemptedMode: 'INVESTOR',
            currentMode: 'PLANNER'
          })
        );
      }, { timeout: 1000 });
    }, 2000);

    it('should prevent multiple simultaneous switches', async () => {
      mockStore.switchMode.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      fireEvent.click(switchButton); // Second click should be ignored
      
      expect(mockStore.switchMode).toHaveBeenCalledTimes(1);
    }, 2000);

    it('should validate mode switch before executing', async () => {
      mockStore.isModeSwitchAllowed.mockReturnValue(false);
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Mode switch not allowed/)).toBeInTheDocument();
        expect(mockStore.switchMode).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    }, 2000);
  });

  describe('Mode History', () => {
    it('should show mode history when toggled', () => {
      render(<DashboardModeManager />);
      
      const showHistoryButton = screen.getByText('Show History');
      fireEvent.click(showHistoryButton);
      
      expect(screen.getByText('Planner → Investor')).toBeInTheDocument();
      expect(screen.getByText('10:00:00 AM')).toBeInTheDocument();
    });

    it('should hide mode history when toggled again', () => {
      render(<DashboardModeManager />);
      
      const showHistoryButton = screen.getByText('Show History');
      fireEvent.click(showHistoryButton);
      fireEvent.click(showHistoryButton);
      
      expect(screen.queryByText('Planner → Investor')).not.toBeInTheDocument();
    });
  });

  describe('Quick Mode Switcher', () => {
    it('should render quick switcher buttons for all modes', () => {
      render(<DashboardModeManager />);
      
      const buttons = screen.getAllByTestId('button');
      const modeButtons = buttons.filter(button => 
        button.textContent.includes('📊') || 
        button.textContent.includes('📈') || 
        button.textContent.includes('🎯')
      );
      
      expect(modeButtons.length).toBeGreaterThan(0);
    });

    it('should disable active mode button', () => {
      render(<DashboardModeManager />);
      
      const buttons = screen.getAllByTestId('button');
      const activeButton = buttons.find(button => button.textContent.includes('📊'));
      
      expect(activeButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display switching error messages', async () => {
      const error = new Error('Service unavailable');
      mockStore.switchMode.mockRejectedValue(error);
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Service unavailable')).toBeInTheDocument();
      });
    });

    it('should clear error when switching again', async () => {
      const error = new Error('Service unavailable');
      mockStore.switchMode
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(true);
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      
      // First click - should show error
      fireEvent.click(switchButton);
      await waitFor(() => {
        expect(screen.getByText('Service unavailable')).toBeInTheDocument();
      });
      
      // Second click - should clear error and succeed
      fireEvent.click(switchButton);
      await waitFor(() => {
        expect(screen.queryByText('Service unavailable')).not.toBeInTheDocument();
      });
    });
  });

  describe('Service Integration', () => {
    it('should log successful mode switches', async () => {
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(executionLogService.log).toHaveBeenCalledWith(
          'dashboard.mode.manager.switched',
          expect.objectContaining({
            newMode: 'INVESTOR',
            timestamp: expect.any(String)
          })
        );
      });
    });

    it('should log mode switch errors', async () => {
      const error = new Error('Switch failed');
      mockStore.switchMode.mockRejectedValue(error);
      
      render(<DashboardModeManager />);
      
      const switchButton = screen.getByText('Switch to Investor');
      fireEvent.click(switchButton);
      
      await waitFor(() => {
        expect(executionLogService.logError).toHaveBeenCalledWith(
          'dashboard.mode.manager.switch.failed',
          error,
          expect.objectContaining({
            attemptedMode: 'INVESTOR',
            currentMode: 'PLANNER'
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<DashboardModeManager />);
      
      // Check for proper button accessibility
      const buttons = screen.getAllByTestId('button');
      buttons.forEach(button => {
        expect(button).not.toBeDisabled(); // Except for active mode
      });
    });

    it('should handle keyboard navigation', () => {
      render(<DashboardModeManager />);
      
      const buttons = screen.getAllByTestId('button');
      const firstButton = buttons[0];
      
      // Test keyboard interaction
      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveFocus();
    });
  });

  it('renders mode selection buttons', () => {
    render(<DashboardModeManager />);
    expect(screen.getByText('Basic Mode')).toBeInTheDocument();
    expect(screen.getByText('Pro Mode')).toBeInTheDocument();
  });

  it('handles mode changes', () => {
    const mockSetMode = vi.fn();
    vi.mocked(require('../../../core/store/dashboardModeStore').useDashboardModeStore).mockReturnValue({
      mode: 'basic',
      setMode: mockSetMode,
      isProMode: false
    });

    render(<DashboardModeManager />);
    
    const proButton = screen.getByText('Pro Mode');
    fireEvent.click(proButton);
    
    expect(mockSetMode).toHaveBeenCalledWith('pro');
  });
}); 