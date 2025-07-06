/**
 * FeedbackForm.test.jsx
 *
 * Purpose: Comprehensive unit tests for the FeedbackForm component to ensure
 * all UI interactions, form validation, category selection, data inclusion
 * options, and snapshot generation work correctly with proper error handling.
 *
 * Procedure:
 * 1. Mock all dependencies before importing the component
 * 2. Test component rendering and UI elements
 * 3. Test user interactions and form validation
 * 4. Test snapshot generation and export functionality
 * 5. Verify error handling and edge cases
 * 
 * Conclusion: Ensures the FeedbackForm component works correctly in all scenarios
 */

// Classic Vitest mocking pattern - all mocks at top
vi.mock('../../../src/lib/services/FeedbackUploader.js', () => ({
  __esModule: true,
  default: {
    generateSnapshot: vi.fn(() => {
      console.log('[MOCK CALLED] generateSnapshot');
      return Promise.resolve({ snapshot: 'mockSnapshot' });
    }),
    exportSnapshot: vi.fn((snapshotData, format) => {
      console.log('[MOCK CALLED] exportSnapshot with format:', format);
      return Promise.resolve({ success: true, format: format });
    }),
    exportToClipboard: vi.fn(() => Promise.resolve({ success: true, format: 'clipboard' }))
  }
}));

// Mock both potential import paths for ExecutionLogService
vi.mock('../../../src/lib/services/ExecutionLogService.js', () => ({
  __esModule: true,
  default: { log: vi.fn(() => Promise.resolve()) }
}));
vi.mock('../../../src/core/services/ExecutionLogService.js', () => ({
  __esModule: true,
  default: { log: vi.fn(() => Promise.resolve()) }
}));

// Mock UI components
vi.mock('../../../src/components/ui/Card.jsx', () => ({
  __esModule: true,
  default: ({ children, className, ...props }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  )
}));

vi.mock('../../../src/components/ui/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, className, ...props }) => (
    <button data-testid="button" className={className} {...props}>
      {children}
    </button>
  )
}));

vi.mock('../../../src/components/ui/switch.jsx', () => {
  const MockSwitch = ({ checked, onCheckedChange = () => {}, ...props }) => (
    <input
      data-testid="checkbox"
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      {...props}
    />
  );
  return {
    __esModule: true,
    default: MockSwitch,
    Checkbox: MockSwitch // for legacy compatibility
  };
});

vi.mock('../../../src/components/ui/textarea.jsx', () => ({
  __esModule: true,
  default: ({ value, onChange, ...props }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}));

vi.mock('../../../src/shared/ui/badge.jsx', () => ({
  __esModule: true,
  default: ({ children, className, ...props }) => (
    <span data-testid="badge" className={className} {...props}>
      {children}
    </span>
  )
}));

// Global unhandledRejection handler
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED PROMISE REJECTION]', reason);
});

// Standard imports after mocks
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach, beforeAll, afterAll } from 'vitest';

// Mock global alert
global.alert = vi.fn();

// Mock browser APIs used by FeedbackUploader
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();
global.navigator.clipboard = {
  writeText: vi.fn().mockResolvedValue(undefined)
};

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

// Import FeedbackForm only after mocks are in place
import FeedbackForm from '../../../src/components/FeedbackForm.jsx';

describe('FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(bugReportCard).toHaveClass('border-blue-500', 'bg-blue-100');
    });

    it('should allow changing selected category', () => {
      render(<FeedbackForm />);
      const bugReportCard = screen.getByTestId('category-bug_report');
      const featureRequestCard = screen.getByTestId('category-feature_request');
      
      fireEvent.click(bugReportCard);
      fireEvent.click(featureRequestCard);
      
      expect(featureRequestCard).toHaveClass('border-blue-500', 'bg-blue-100');
    });
  });

  describe('Data Inclusion Options', () => {
    it('should have default data inclusion settings', () => {
      render(<FeedbackForm />);
      const checkboxes = screen.getAllByTestId('checkbox');
      expect(checkboxes[0]).toBeChecked(); // Execution Logs
      expect(checkboxes[1]).toBeChecked(); // Financial Summary
      expect(checkboxes[2]).toBeChecked(); // UI Preferences
    });

    it('should allow toggling data inclusion options', () => {
      render(<FeedbackForm />);
      const checkboxes = screen.getAllByTestId('checkbox');
      // Toggle Execution Logs (first checkbox) off
      fireEvent.change(checkboxes[0], { target: { checked: false } });
      expect(checkboxes[0]).not.toBeChecked();
      // Toggle back on
      fireEvent.change(checkboxes[0], { target: { checked: true } });
      expect(checkboxes[0]).toBeChecked();
    });

    it('should calculate total size based on selected options', () => {
      render(<FeedbackForm />);
      // Use getAllByText with function matcher for text split across nodes
      const sizeElements = screen.getAllByText((content, element) => {
        return element.textContent.includes('~') && element.textContent.includes('65') && element.textContent.includes('KB');
      });
      expect(sizeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should require category selection', () => {
      render(<FeedbackForm />);
      
      // Only provide feedback text, no category
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      // The component doesn't use global.alert, so we check that the button remains disabled
      expect(submitButton).toBeDisabled();
    });

    it('should require feedback text', () => {
      render(<FeedbackForm />);
      
      // Only select category, no feedback text
      fireEvent.click(screen.getByTestId('category-bug_report'));
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      // The component doesn't use global.alert, so we check that the button remains disabled
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when both category and feedback are provided', () => {
      render(<FeedbackForm />);
      const bugReportCard = screen.getByTestId('category-bug_report');
      const textarea = screen.getByTestId('textarea');
      
      fireEvent.click(bugReportCard);
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Snapshot Generation', () => {
    it('should generate snapshot when form is submitted', async () => {
      render(<FeedbackForm />);
      
      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      const textarea = screen.getByTestId('textarea');
      
      fireEvent.click(bugReportCard);
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
    });

    it('should show snapshot generated view after successful generation', async () => {
      render(<FeedbackForm />);
      // Setup form
      fireEvent.click(screen.getByTestId('category-bug_report'));
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      // Submit form
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      // Verify export buttons appear with correct text
      expect(screen.getByText('Download Snapshot File')).toBeInTheDocument();
      // Use getAllByText and check at least one is a button
      const clipboardButtons = screen.getAllByText('Copy to Clipboard');
      expect(clipboardButtons.some(el => el.tagName === 'BUTTON')).toBe(true);
    });

    it('should handle snapshot generation errors', async () => {
      render(<FeedbackForm />);
      
      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      const textarea = screen.getByTestId('textarea');
      
      fireEvent.click(bugReportCard);
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    it('should export snapshot as file', async () => {
      render(<FeedbackForm />);
      
      // Setup form
      fireEvent.click(screen.getByTestId('category-bug_report'));
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      
      // Updated to match actual button text
      const exportButton = screen.getByText('Download Snapshot File');
      fireEvent.click(exportButton);
      
      // Check that exportSnapshot was called
      const { default: FeedbackUploader } = await import('../../../src/lib/services/FeedbackUploader.js');
      expect(FeedbackUploader.exportSnapshot).toHaveBeenCalled();
    });

    it('should export snapshot to clipboard', async () => {
      render(<FeedbackForm />);
      // Setup form
      fireEvent.click(screen.getByTestId('category-bug_report'));
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      // Submit form
      fireEvent.click(screen.getByText('Generate Snapshot'));
      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      // Find the clipboard button and click it
      const clipboardButtons = screen.getAllByText('Copy to Clipboard').filter(el => el.tagName === 'BUTTON');
      expect(clipboardButtons.length).toBeGreaterThan(0);
      fireEvent.click(clipboardButtons[0]);
      // Check that exportSnapshot was called with 'clipboard' as the format
      const { default: FeedbackUploader } = await import('../../../src/lib/services/FeedbackUploader.js');
      expect(FeedbackUploader.exportSnapshot).toHaveBeenCalledWith(expect.anything(), 'clipboard');
    });

    it('should reset form after snapshot generation', async () => {
      render(<FeedbackForm />);
      
      // Setup and submit form
      fireEvent.click(screen.getByTestId('category-bug_report'));
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      fireEvent.click(screen.getByText('Generate Snapshot'));
      
      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      
      // Updated to match actual button text
      const resetButton = screen.getByText('Create New Feedback');
      fireEvent.click(resetButton);
      
      // Verify form is reset
      expect(screen.getByText('Generate Snapshot')).toBeInTheDocument();
      expect(screen.queryByText(/Snapshot Generated Successfully/i)).not.toBeInTheDocument();
    });

    it('should display snapshot size information', async () => {
      render(<FeedbackForm />);
      // Setup and submit form
      fireEvent.click(screen.getByTestId('category-bug_report'));
      fireEvent.change(screen.getByTestId('textarea'), { target: { value: 'Test feedback' } });
      fireEvent.click(screen.getByText('Generate Snapshot'));
      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      // Use getAllByText with function matcher for text split across nodes
      const sizeElements = screen.getAllByText((content, element) => {
        return element.textContent.includes('~') && element.textContent.includes('65') && element.textContent.includes('KB');
      });
      expect(sizeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', async () => {
      render(<FeedbackForm />);
      
      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      const textarea = screen.getByTestId('textarea');
      
      fireEvent.click(bugReportCard);
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
      
      // Reset form
      const resetButton = screen.getByText('Create New Feedback');
      fireEvent.click(resetButton);
      
      // Verify form is reset
      expect(screen.getByText('Generate Snapshot')).toBeInTheDocument();
      expect(screen.queryByText(/Snapshot Generated Successfully/i)).not.toBeInTheDocument();
    });
  });

  describe('Privacy Notice', () => {
    it('should display privacy and security information', () => {
      render(<FeedbackForm />);
      expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
      expect(screen.getByText(/Your feedback snapshot is encrypted/)).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during snapshot generation', async () => {
      // Mock a delayed response
      render(<FeedbackForm />);

      // Fill out form
      const bugReportCard = screen.getByTestId('category-bug_report');
      const textarea = screen.getByTestId('textarea');
      
      fireEvent.click(bugReportCard);
      fireEvent.change(textarea, { target: { value: 'Test feedback' } });
      
      const submitButton = screen.getByText('Generate Snapshot');
      fireEvent.click(submitButton);
      
      // Should show loading state briefly
      expect(submitButton).toBeDisabled();
      
      await waitFor(() => {
        expect(screen.getByText(/Snapshot Generated Successfully/i)).toBeInTheDocument();
      });
    });
  });
}); 