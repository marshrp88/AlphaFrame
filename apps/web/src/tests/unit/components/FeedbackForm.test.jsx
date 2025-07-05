// Jest mock for FeedbackUploader must be declared BEFORE importing the component
vi.mock('../../../lib/services/FeedbackUploader.js', () => ({
  __esModule: true,
  default: {
    generateSnapshot: vi.fn(() => {
      // Log to confirm mock is used
      console.log('[MOCK CALLED] generateSnapshot');
      return Promise.resolve({ snapshot: 'mockSnapshot' });
    }),
    exportSnapshot: vi.fn(() => {
      console.log('[MOCK CALLED] exportSnapshot');
      return Promise.resolve({ success: true, format: 'file' });
    })
  }
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackForm from '../../../components/FeedbackForm.jsx';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('FeedbackForm Unit', () => {
  it('renders the form and calls generateSnapshot on submit', async () => {
    // Render the FeedbackForm component
    render(<FeedbackForm />);

    // Select a feedback category (simulate user)
    const categorySelect = screen.getByTestId('category-bug_report');
    fireEvent.click(categorySelect);

    // Enter feedback text
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });

    // Click the generate snapshot button
    const generateBtn = screen.getByRole('button', { name: /generate snapshot/i });
    fireEvent.click(generateBtn);

    // Wait for the mock to be called and UI to update
    await waitFor(() => {
      // The mock should have been called
      expect(require('../../../lib/services/FeedbackUploader.js').default.generateSnapshot).toHaveBeenCalled();
      // The UI should show a success state (snapshot generated)
      expect(screen.getByText('Snapshot Generated Successfully!')).toBeInTheDocument();
    });
  });
});

// Notes:
// - jest.mock is hoisted, so the mock is active before FeedbackForm is imported.
// - This test simulates a user filling out the form and submitting it.
// - The mock logs confirm the mock is used, and the UI is checked for correct state.
// - This pattern avoids the React hook error and ensures CI stability. 