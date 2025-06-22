/**
 * FeedbackForm.test.jsx
 *
 * Purpose: Comprehensive unit tests for the FeedbackForm component to ensure
 * all UI interactions, form validation, category selection, data inclusion
 * options, and snapshot generation work correctly with proper error handling.
 *
 * Fixes Applied:
 * - Proper afterEach cleanup with vi.restoreAllMocks()
 * - Added proper mock isolation
 * - Comments added for clarity
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import FeedbackForm from '../../../src/components/FeedbackForm.jsx';

// Mock dependencies
vi.mock('../../../src/lib/services/FeedbackUploader.js', () => ({
  default: {
    generateSnapshot: vi.fn(),
    exportSnapshot: vi.fn()
  }
}));

vi.mock('../../../src/core/services/ExecutionLogService.js', () => ({
  default: {
    log: vi.fn()
  }
}));

// Mock UI components
vi.mock('@/components/ui/Card.jsx', () => ({
  Card: ({ children, className, ...props }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  )
}));

vi.mock('@/components/ui/Button.jsx', () => ({
  Button: ({ children, onClick, disabled, variant, className, ...props }) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={`${variant || ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/switch.jsx', () => ({
  Checkbox: ({ checked, onCheckedChange, className, ...props }) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={className}
      {...props}
    />
  )
}));

vi.mock('@/components/ui/textarea.jsx', () => ({
  Textarea: ({ value, onChange, placeholder, className, ...props }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  )
}));

vi.mock('@/components/ui/Select.jsx', () => ({
  Select: ({ children, ...props }) => (
    <select data-testid="select" {...props}>
      {children}
    </select>
  )
}));

vi.mock('@/components/ui/badge.jsx', () => ({
  Badge: ({ children, variant, className, ...props }) => (
    <span data-testid="badge" className={`badge ${variant || ''} ${className || ''}`} {...props}>
      {children}
    </span>
  )
}));

describe('FeedbackForm', () => {
  let mockFeedbackUploader;
  let mockExecutionLogService;

  beforeEach(async () => {
    mockFeedbackUploader = (await import('../../../src/lib/services/FeedbackUploader.js')).default;
    mockExecutionLogService = (await import('../../../src/core/services/ExecutionLogService.js')).default;

    vi.clearAllMocks();

    // Mock alert
    global.alert = vi.fn();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the feedback form with header', () => {
      render(<FeedbackForm />);

      expect(screen.getByText('Pioneer Feedback')).toBeInTheDocument();
      expect(screen.getByText(/Help us improve AlphaPro/)).toBeInTheDocument();
    });

    it('should render feedback categories', () => {
      render(<FeedbackForm />);

      expect(screen.getByText('Bug Report')).toBeInTheDocument();
      expect(screen.getByText('Feature Request')).toBeInTheDocument();
      expect(screen.getByText('UX Feedback')).toBeInTheDocument();
      expect(screen.getByText('General Feedback')).toBeInTheDocument();
    });

    it('should render data inclusion options', () => {
      render(<FeedbackForm />);

      expect(screen.getByText('Execution Logs')).toBeInTheDocument();
      expect(screen.getByText('Financial Summary')).toBeInTheDocument();
      expect(screen.getByText('UI Preferences')).toBeInTheDocument();
      expect(screen.getByText('Error Logs')).toBeInTheDocument();
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    });

    it('should render submit and reset buttons', () => {
      render(<FeedbackForm />);

      expect(screen.getByText('Generate Snapshot')).toBeInTheDocument();
      expect(screen.getByText('Reset Form')).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('should allow selecting a feedback category', () => {
      render(<FeedbackForm />);

      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      // The selected category should have different styling
      expect(bugReportCard).toHaveClass('border-blue-500');
    });

    it('should allow changing selected category', () => {
      render(<FeedbackForm />);

      const bugReportCard = screen.getByTestId('category-bug_report');
      const featureRequestCard = screen.getByTestId('category-feature_request');

      fireEvent.click(bugReportCard);
      fireEvent.click(featureRequestCard);

      expect(featureRequestCard).toHaveClass('border-blue-500');
      expect(bugReportCard).not.toHaveClass('border-blue-500');
    });
  });

  describe('Data Inclusion Options', () => {
    it('should have default data inclusion settings', () => {
      render(<FeedbackForm />);

      const checkboxes = screen.getAllByTestId('checkbox');
      
      // First 3 should be checked by default (execution_logs, financial_summary, ui_preferences)
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      
      // Last 2 should be unchecked by default (error_logs, performance_metrics)
      expect(checkboxes[3]).not.toBeChecked();
      expect(checkboxes[4]).not.toBeChecked();
    });

    it('should allow toggling data inclusion options', () => {
      render(<FeedbackForm />);

      const checkboxes = screen.getAllByTestId('checkbox');
      
      // Toggle error logs on
      fireEvent.click(checkboxes[3]);
      expect(checkboxes[3]).toBeChecked();

      // Toggle execution logs off
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).not.toBeChecked();
    });

    it('should calculate total size based on selected options', () => {
      render(<FeedbackForm />);

      // Default size should be ~65KB (50 + 10 + 5)
      expect(screen.getByText('~65KB')).toBeInTheDocument();

      // Toggle error logs on (adds ~20KB)
      const checkboxes = screen.getAllByTestId('checkbox');
      fireEvent.click(checkboxes[3]);
      expect(screen.getByText('~85KB')).toBeInTheDocument();

      // Toggle execution logs off (removes ~50KB)
      fireEvent.click(checkboxes[0]);
      expect(screen.getByText('~35KB')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require category selection', () => {
      render(<FeedbackForm />);

      const submitButton = screen.getByText('Generate Snapshot');
      expect(submitButton).toBeDisabled();
    });

    it('should require feedback text', () => {
      render(<FeedbackForm />);

      // Select category
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const submitButton = screen.getByText('Generate Snapshot');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when both category and feedback are provided', () => {
      render(<FeedbackForm />);

      // Select category
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      // Add feedback text
      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'This is test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Snapshot Generation', () => {
    it('should generate snapshot when form is submitted', async () => {
      const mockSnapshot = {
        encrypted: true,
        data: 'encrypted-data',
        metadata: { version: '1.0' }
      };

      mockFeedbackUploader.generateSnapshot.mockResolvedValue(mockSnapshot);

      render(<FeedbackForm />);

      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback message' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockFeedbackUploader.generateSnapshot).toHaveBeenCalledWith({
          category: 'bug_report',
          feedback: 'Test feedback message',
          includedData: {
            execution_logs: true,
            financial_summary: true,
            ui_preferences: true,
            error_logs: false,
            performance_metrics: false
          },
          timestamp: expect.any(String)
        });
      });
    });

    it('should show snapshot generated view after successful generation', async () => {
      const mockSnapshot = {
        encrypted: true,
        data: 'encrypted-data',
        metadata: { version: '1.0' }
      };

      mockFeedbackUploader.generateSnapshot.mockResolvedValue(mockSnapshot);

      render(<FeedbackForm />);

      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Snapshot Generated Successfully!')).toBeInTheDocument();
        expect(screen.getByText('Download Snapshot File')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Copy to Clipboard' })).toBeInTheDocument();
      });
    });

    it('should handle snapshot generation errors', async () => {
      mockFeedbackUploader.generateSnapshot.mockRejectedValue(new Error('Generation failed'));

      render(<FeedbackForm />);

      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error generating snapshot. Please try again.');
      });
    });
  });

  describe('Export Functionality', () => {
    beforeEach(async () => {
      // Setup successful snapshot generation
      const mockSnapshot = {
        encrypted: true,
        data: 'encrypted-data',
        metadata: { version: '1.0' }
      };

      mockFeedbackUploader.generateSnapshot.mockResolvedValue(mockSnapshot);
      mockFeedbackUploader.exportSnapshot.mockResolvedValue({ success: true, format: 'file' });

      render(<FeedbackForm />);

      // Generate snapshot first
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Snapshot Generated Successfully!')).toBeInTheDocument();
      });
    });

    it('should export snapshot as file', async () => {
      const downloadButton = screen.getByText('Download Snapshot File');
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockFeedbackUploader.exportSnapshot).toHaveBeenCalledWith(
          expect.any(Object),
          'file'
        );
        expect(global.alert).toHaveBeenCalledWith('Snapshot exported successfully!');
      });
    });

    it('should export snapshot to clipboard', async () => {
      const clipboardButton = screen.getByRole('button', { name: 'Copy to Clipboard' });
      fireEvent.click(clipboardButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Snapshot data copied to clipboard!');
      });
    });

    it('should handle export errors', async () => {
      mockFeedbackUploader.exportSnapshot.mockRejectedValue(new Error('Export failed'));

      const downloadButton = screen.getByText('Download Snapshot File');
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error exporting snapshot. Please try again.');
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', async () => {
      const mockSnapshot = {
        encrypted: true,
        data: 'encrypted-data',
        metadata: { version: '1.0' }
      };

      mockFeedbackUploader.generateSnapshot.mockResolvedValue(mockSnapshot);

      render(<FeedbackForm />);

      // Fill out form and generate snapshot
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Snapshot Generated Successfully!')).toBeInTheDocument();
      });

      // Reset form
      const resetButton = screen.getByText('Create New Feedback');
      fireEvent.click(resetButton);

      // Should be back to initial state
      expect(screen.getByText('Generate Snapshot')).toBeInTheDocument();
      expect(screen.queryByText('Snapshot Generated Successfully!')).not.toBeInTheDocument();
    });
  });

  describe('Privacy Notice', () => {
    it('should display privacy and security information', () => {
      render(<FeedbackForm />);

      expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
      expect(screen.getByText(/Your feedback snapshot is encrypted/)).toBeInTheDocument();
      expect(screen.getByText(/You maintain full control/)).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during snapshot generation', async () => {
      // Mock delayed response
      mockFeedbackUploader.generateSnapshot.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ encrypted: true, data: 'test' }), 100))
      );

      render(<FeedbackForm />);

      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      fireEvent.click(bugReportCard);

      const textarea = screen.getByTestId('textarea');
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });

      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);

      // Should show loading state
      expect(screen.getByText('Generating Snapshot...')).toBeInTheDocument();
      expect(screen.getByText('Generating Snapshot...')).toBeDisabled();
    });
  });
}); 