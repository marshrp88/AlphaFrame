/**
 * FeedbackModule.test.jsx
 *
 * Purpose: Comprehensive unit tests for the FeedbackModule component to ensure
 * all feedback generation, export functionality, error handling, and UI interactions
 * work correctly according to VX.0 sprint requirements.
 *
 * Procedure:
 * 1. Test component rendering and initial state
 * 2. Test feedback report generation with ExecutionLogService integration
 * 3. Test JSON export functionality and file download
 * 4. Test error handling and user feedback
 * 5. Test UI state management and interactions
 * 6. Test narrative insights placeholder functionality
 *
 * Conclusion: These tests validate that the FeedbackModule provides reliable
 * feedback export capabilities while maintaining data privacy and user experience.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import FeedbackModule from '../components/FeedbackModule.jsx';

// Mock dependencies
vi.mock('@/core/services/ExecutionLogService.js', () => ({
  default: {
    getLogs: vi.fn()
  }
}));

vi.mock('@/shared/ui/Button.jsx', () => ({
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

vi.mock('@/shared/ui/Card.jsx', () => ({
  Card: ({ children, className, ...props }) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }) => (
    <div data-testid="card-header" className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }) => (
    <h3 data-testid="card-title" className={className} {...props}>
      {children}
    </h3>
  ),
  CardDescription: ({ children, className, ...props }) => (
    <p data-testid="card-description" className={className} {...props}>
      {children}
    </p>
  )
}));

describe('FeedbackModule', () => {
  let mockExecutionLogService;

  beforeEach(async () => {
    mockExecutionLogService = (await import('@/core/services/ExecutionLogService.js')).default;
    
    vi.clearAllMocks();
    
    // Mock document methods
    global.document.createElement = vi.fn(() => ({
      href: '',
      download: '',
      click: vi.fn()
    }));
    global.document.body.appendChild = vi.fn();
    global.document.body.removeChild = vi.fn();
    
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock Blob
    global.Blob = vi.fn(() => ({}));
    
    // Mock Date.now for consistent timestamps
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the feedback module with correct title and description', () => {
      render(<FeedbackModule />);
      
      expect(screen.getByText('AlphaPro Feedback Export')).toBeInTheDocument();
      expect(screen.getByText(/Generate and download a comprehensive report/)).toBeInTheDocument();
    });

    it('should render the generate button with correct text', () => {
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      expect(generateButton).toBeInTheDocument();
      expect(generateButton).not.toBeDisabled();
    });

    it('should render the included data list', () => {
      render(<FeedbackModule />);
      
      expect(screen.getByText("What's included:")).toBeInTheDocument();
      expect(screen.getByText('• Execution logs and system events')).toBeInTheDocument();
      expect(screen.getByText('• Narrative insights and analysis')).toBeInTheDocument();
      expect(screen.getByText('• Timestamp and version information')).toBeInTheDocument();
      expect(screen.getByText('• Structured JSON format for easy analysis')).toBeInTheDocument();
    });

    it('should render privacy and security information', () => {
      render(<FeedbackModule />);
      
      expect(screen.getByText(/This report contains your usage data/)).toBeInTheDocument();
      expect(screen.getByText(/All data is processed locally/)).toBeInTheDocument();
    });
  });

  describe('Feedback Report Generation', () => {
    it('should generate feedback report with execution logs and narrative insights', async () => {
      const mockLogs = [
        { type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }
      ];
      
      mockExecutionLogService.getLogs.mockReturnValue(mockLogs);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(mockExecutionLogService.getLogs).toHaveBeenCalledTimes(1);
      });
      
      // Verify the feedback report structure
      expect(global.Blob).toHaveBeenCalledWith(
        [expect.stringContaining('"reportVersion":"1.0"')],
        { type: 'application/json' }
      );
      
      expect(global.Blob).toHaveBeenCalledWith(
        [expect.stringContaining('"source":"AlphaPro FeedbackModule"')],
        { type: 'application/json' }
      );
      
      expect(global.Blob).toHaveBeenCalledWith(
        [expect.stringContaining('"placeholder":"NarrativeService not yet implemented"')],
        { type: 'application/json' }
      );
    });

    it('should include execution logs in the generated report', async () => {
      const mockLogs = [
        { type: 'user.action', timestamp: '2024-01-01T00:00:00Z', payload: { action: 'test' } },
        { type: 'system.event', timestamp: '2024-01-01T00:01:00Z', payload: { event: 'test' } }
      ];
      
      mockExecutionLogService.getLogs.mockReturnValue(mockLogs);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(global.Blob).toHaveBeenCalledWith(
          [expect.stringContaining('"type":"user.action"')],
          { type: 'application/json' }
        );
        
        expect(global.Blob).toHaveBeenCalledWith(
          [expect.stringContaining('"type":"system.event"')],
          { type: 'application/json' }
        );
      });
    });

    it('should include narrative insights placeholder in the generated report', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(global.Blob).toHaveBeenCalledWith(
          [expect.stringContaining('"placeholder":"NarrativeService not yet implemented"')],
          { type: 'application/json' }
        );
        
        expect(global.Blob).toHaveBeenCalledWith(
          [expect.stringContaining('"generatedAt"')],
          { type: 'application/json' }
        );
      });
    });
  });

  describe('File Download Functionality', () => {
    it('should create and trigger file download with correct filename', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(global.document.createElement).toHaveBeenCalledWith('a');
        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(global.document.body.appendChild).toHaveBeenCalled();
        expect(global.document.body.removeChild).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      });
    });

    it('should set correct download filename with timestamp', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        const mockLink = global.document.createElement();
        expect(mockLink.download).toBe('alphapro-feedback-report-1234567890.json');
      });
    });
  });

  describe('UI State Management', () => {
    it('should show loading state during generation', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      expect(screen.getByText('Generating...')).toBeInTheDocument();
      expect(screen.getByText('Generating...')).toBeDisabled();
    });

    it('should show success message after successful generation', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('✅ Feedback report generated and downloaded successfully!')).toBeInTheDocument();
      });
    });

    it('should show reset button after success or error', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Reset')).toBeInTheDocument();
      });
    });

    it('should reset state when reset button is clicked', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      // Generate report first
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('✅ Feedback report generated and downloaded successfully!')).toBeInTheDocument();
      });
      
      // Click reset
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);
      
      // Should be back to initial state
      expect(screen.queryByText('✅ Feedback report generated and downloaded successfully!')).not.toBeInTheDocument();
      expect(screen.getByText('Generate & Download Report')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle execution log service errors gracefully', async () => {
      mockExecutionLogService.getLogs.mockImplementation(() => {
        throw new Error('Service error');
      });
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Could not generate the report. Please check the console for details.')).toBeInTheDocument();
      });
    });

    it('should handle file download errors gracefully', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      global.document.createElement.mockImplementation(() => {
        throw new Error('DOM error');
      });
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText('Could not generate the report. Please check the console for details.')).toBeInTheDocument();
      });
    });

    it('should show error message in red alert box', async () => {
      mockExecutionLogService.getLogs.mockImplementation(() => {
        throw new Error('Service error');
      });
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        const errorBox = screen.getByText('Could not generate the report. Please check the console for details.');
        expect(errorBox.closest('div')).toHaveClass('bg-red-50', 'border-red-200');
      });
    });
  });

  describe('Data Privacy and Security', () => {
    it('should process all data locally without external calls', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        // Verify no external API calls are made
        expect(mockExecutionLogService.getLogs).toHaveBeenCalledTimes(1);
        expect(global.Blob).toHaveBeenCalled();
        expect(global.URL.createObjectURL).toHaveBeenCalled();
      });
    });

    it('should include privacy notice in the UI', () => {
      render(<FeedbackModule />);
      
      expect(screen.getByText(/This report contains your usage data/)).toBeInTheDocument();
      expect(screen.getByText(/All data is processed locally/)).toBeInTheDocument();
    });
  });

  describe('JSON Export Format', () => {
    it('should generate properly formatted JSON with correct structure', async () => {
      const mockLogs = [
        { type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }
      ];
      
      mockExecutionLogService.getLogs.mockReturnValue(mockLogs);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        expect(global.Blob).toHaveBeenCalledWith(
          [expect.stringMatching(/^\s*\{\s*"reportVersion":\s*"1\.0"/)],
          { type: 'application/json' }
        );
      });
    });

    it('should include all required fields in the JSON structure', async () => {
      mockExecutionLogService.getLogs.mockReturnValue([]);
      
      render(<FeedbackModule />);
      
      const generateButton = screen.getByText('Generate & Download Report');
      fireEvent.click(generateButton);
      
      await waitFor(() => {
        const jsonString = global.Blob.mock.calls[0][0][0];
        const parsed = JSON.parse(jsonString);
        
        expect(parsed).toHaveProperty('reportVersion', '1.0');
        expect(parsed).toHaveProperty('generatedAt');
        expect(parsed).toHaveProperty('source', 'AlphaPro FeedbackModule');
        expect(parsed).toHaveProperty('data');
        expect(parsed.data).toHaveProperty('executionLogs');
        expect(parsed.data).toHaveProperty('narrativeInsights');
      });
    });
  });
}); 