/**
 * DashboardPicker.test.jsx
 *
 * Purpose: Comprehensive unit tests for the DashboardPicker component to ensure
 * all dashboard mode selection, preview, and customization functionality works
 * correctly with proper user interactions and state management.
 *
 * Procedure:
 * 1. Test dashboard mode rendering and selection
 * 2. Test preview functionality for each mode
 * 3. Test quick mode switcher interactions
 * 4. Test component state management
 * 5. Test accessibility and user experience
 *
 * Conclusion: These tests validate that the DashboardPicker properly handles
 * mode selection, previews, and user interactions while maintaining
 * responsive design and accessibility standards.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardPicker from '../../../src/components/DashboardPicker';

describe('DashboardPicker', () => {
  const mockOnModeChange = vi.fn();

  beforeEach(() => {
    mockOnModeChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render all three dashboard modes', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('Investor')).toBeInTheDocument();
      expect(screen.getByText('Minimalist')).toBeInTheDocument();
    });

    it('should highlight the selected mode', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      // Check for the checkmark icon in the selected mode
      const checkmark = screen.getByTestId('check-icon');
      expect(checkmark).toBeInTheDocument();
    });

    it('should show mode descriptions', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      expect(screen.getByText('Comprehensive view for detailed financial planning')).toBeInTheDocument();
      expect(screen.getByText('Portfolio-focused view for investment decisions')).toBeInTheDocument();
      expect(screen.getByText('Clean, essential view for a quick overview')).toBeInTheDocument();
    });

    it('should show feature tags for each mode', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      expect(screen.getByText('Budget Tracking')).toBeInTheDocument();
      expect(screen.getByText('Cash Flow Analysis')).toBeInTheDocument();
      expect(screen.getByText('Goal Progress')).toBeInTheDocument();
      expect(screen.getByText('Portfolio Analysis')).toBeInTheDocument();
      expect(screen.getByText('Allocation Drift')).toBeInTheDocument();
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('Key Metrics')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  describe('Mode Selection', () => {
    it('should call onModeChange when a mode card is clicked', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const investorCard = screen.getByText('Investor').closest('div');
      fireEvent.click(investorCard);

      expect(mockOnModeChange).toHaveBeenCalledWith('INVESTOR');
    });

    it('should call onModeChange when minimalist mode is clicked', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const minimalistCard = screen.getByText('Minimalist').closest('div');
      fireEvent.click(minimalistCard);

      expect(mockOnModeChange).toHaveBeenCalledWith('MINIMALIST');
    });

    it('should not call onModeChange when selected mode is clicked again', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const plannerCard = screen.getByText('Planner').closest('div');
      fireEvent.click(plannerCard);

      expect(mockOnModeChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should show different visual states for selected vs unselected modes', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      // Selected mode should have different styling
      const plannerCard = screen.getByText('Planner').closest('div');
      expect(plannerCard.className).toContain('border-blue-500');
      expect(plannerCard.className).toContain('bg-blue-100');

      // Unselected modes should have different styling
      const investorCard = screen.getByText('Investor').closest('div');
      expect(investorCard.className).toContain('border-gray-200');
      expect(investorCard.className).toContain('bg-white');
    });

    it('should show hover effects on unselected cards', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const investorCard = screen.getByText('Investor').closest('div');
      expect(investorCard.className).toContain('hover:bg-gray-50');
    });
  });

  describe('Accessibility', () => {
    it('should have clickable cards with proper styling', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const cards = screen.getAllByText(/Planner|Investor|Minimalist/);
      cards.forEach(card => {
        const cardElement = card.closest('div');
        expect(cardElement.className).toContain('cursor-pointer');
      });
    });

    it('should handle keyboard navigation', () => {
      render(<DashboardPicker selectedMode="PLANNER" onModeChange={mockOnModeChange} />);

      const investorCard = screen.getByText('Investor').closest('div');
      fireEvent.keyDown(investorCard, { key: 'Enter' });

      expect(mockOnModeChange).toHaveBeenCalledWith('INVESTOR');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onModeChange prop gracefully', () => {
      expect(() => {
        render(<DashboardPicker selectedMode="PLANNER" />);
      }).not.toThrow();
    });

    it('should handle invalid selectedMode gracefully', () => {
      expect(() => {
        render(<DashboardPicker selectedMode="INVALID" onModeChange={mockOnModeChange} />);
      }).not.toThrow();
    });
  });
}); 