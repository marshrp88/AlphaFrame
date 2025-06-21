import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FeedbackModule from '../components/FeedbackModule';

// Mock dependencies
vi.mock('../../../lib/services/FeedbackUploader', () => ({
  default: {
    uploadFeedback: vi.fn()
  }
}));

vi.mock('../../../lib/services/NotificationService', () => ({
  default: {
    showNotification: vi.fn()
  }
}));

vi.mock('../../../core/services/ExecutionLogService.js', () => ({
  default: {
    queryLogs: vi.fn().mockResolvedValue([
      { type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }
    ])
  }
}));

describe('FeedbackModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document methods only if required by the component
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    global.Blob = vi.fn(() => ({}));
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders feedback module with correct title', () => {
    render(<FeedbackModule />);
    expect(screen.getByText('AlphaPro Feedback Export')).toBeInTheDocument();
  });

  it('renders generate button', () => {
    render(<FeedbackModule />);
    const generateButton = screen.getByText('Generate & Download Report');
    expect(generateButton).toBeInTheDocument();
  });

  it('handles report generation', async () => {
    const mockLogs = [
      { type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }
    ];
    const mockExecutionLogService = require('../../../core/services/ExecutionLogService.js').default;
    mockExecutionLogService.queryLogs.mockResolvedValue(mockLogs);
    render(<FeedbackModule />);
    const generateButton = screen.getByText('Generate & Download Report');
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(mockExecutionLogService.queryLogs).toHaveBeenCalled();
    });
  });
}); 