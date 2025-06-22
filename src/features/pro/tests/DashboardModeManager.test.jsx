import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardModeManager from '../components/DashboardModeManager';
import { useDashboardModeStore } from '../../core/store/dashboardModeStore';
import { useExecutionLogService } from '../../core/services/ExecutionLogService';

// Mock the stores
vi.mock('../../core/store/dashboardModeStore', () => ({
  useDashboardModeStore: vi.fn()
}));

vi.mock('../../core/services/ExecutionLogService', () => ({
  useExecutionLogService: vi.fn()
}));

describe('DashboardModeManager', () => {
  const mockSetMode = vi.fn();
  const mockLogModeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    useDashboardModeStore.mockReturnValue({
      mode: 'PLANNER',
      setMode: mockSetMode
    });

    useExecutionLogService.mockReturnValue({
      logModeChange: mockLogModeChange
    });
  });

  it('should render mode selection buttons', () => {
    render(<DashboardModeManager />);
    
    expect(screen.getByText('Planner')).toBeInTheDocument();
    expect(screen.getByText('Investor')).toBeInTheDocument();
    expect(screen.getByText('Analyst')).toBeInTheDocument();
  });

  it('should call setMode when a mode is selected', () => {
    render(<DashboardModeManager />);
    
    const investorButton = screen.getByText('Investor');
    fireEvent.click(investorButton);
    
    expect(mockSetMode).toHaveBeenCalledWith('INVESTOR');
  });

  it('should log mode changes', async () => {
    render(<DashboardModeManager />);
    
    const investorButton = screen.getByText('Investor');
    fireEvent.click(investorButton);
    
    await waitFor(() => {
      expect(mockLogModeChange).toHaveBeenCalledWith('INVESTOR');
    });
  });

  it('should highlight the current mode', () => {
    render(<DashboardModeManager />);
    
    const plannerButton = screen.getByText('Planner');
    expect(plannerButton).toHaveClass('bg-blue-500', 'text-white');
  });
}); 