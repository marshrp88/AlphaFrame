// CLUSTER 1 FIX: Add test-local fetch mock BEFORE imports to prevent hanging
global.fetch = jest.fn(() => Promise.resolve({ 
  json: () => Promise.resolve({ success: true }),
  ok: true 
}));

import { describe, it, expect, vi, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WebhookActionForm from '@/components/framesync/WebhookActionForm';

// Mock the toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

jest.mock('@/components/ui/Input', () => ({
  Input: (props) => <input {...props} />
}));
jest.mock('@/components/ui/Label', () => ({
  Label: ({ children, htmlFor, ...props }) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  )
}));
jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea {...props} />
}));

describe('WebhookActionForm', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders URL input with correct attributes', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    expect(urlInput).toBeInTheDocument();
    expect(urlInput).toHaveAttribute('type', 'url');
  });

  it('renders method selector with correct options', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const methodSelect = screen.getByLabelText('Request Method');
    expect(methodSelect).toBeInTheDocument();
    expect(methodSelect).toHaveValue('POST');

    const options = methodSelect.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('POST');
    expect(options[1]).toHaveValue('PUT');
    expect(options[2]).toHaveValue('PATCH');
  });

  it('renders JSON payload textarea with correct attributes', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');
    expect(payloadTextarea).toBeInTheDocument();
    expect(payloadTextarea).toHaveClass('font-mono');
    expect(payloadTextarea).toHaveAttribute('rows', '8');
  });

  it('validates URL input', async () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    
    // Test valid HTTPS URL
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/webhook' } });
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.queryByText('Webhook URL is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Please enter a valid HTTPS URL')).not.toBeInTheDocument();
    }, 2000);
    
    // Test invalid URL
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid HTTPS URL')).toBeInTheDocument();
    }, 2000);
    
    // Test HTTP URL
    fireEvent.change(urlInput, { target: { value: 'http://example.com' } });
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid HTTPS URL')).toBeInTheDocument();
    }, 2000);
  }, 10000);

  it('validates JSON payload', async () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');
    
    // Test invalid JSON
    fireEvent.change(payloadTextarea, { target: { value: 'not json' } });
    
    await waitFor(() => {
      expect(screen.getByText('Please enter valid JSON')).toBeInTheDocument();
    }, 2000);
    
    // Test valid JSON
    fireEvent.change(payloadTextarea, { target: { value: '{"key": "value"}' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Please enter valid JSON')).not.toBeInTheDocument();
    }, 2000);
  });

  it('formats valid JSON payload', async () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');
    
    // Enter unformatted JSON
    fireEvent.change(payloadTextarea, { target: { value: '{"key":"value"}' } });
    
    // Wait for formatting
    await waitFor(() => {
      expect(payloadTextarea).toHaveValue('{\n  "key": "value"\n}');
    }, 2000);
  });

  it('calls onChange with correct payload when form is valid', async () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    const methodSelect = screen.getByLabelText('Request Method');
    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');

    // Fill in the form
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/webhook' } });
    fireEvent.change(methodSelect, { target: { value: 'PUT' } });
    fireEvent.change(payloadTextarea, { target: { value: '{"key": "value"}' } });

    // Wait for validation and onChange call
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        url: 'https://api.example.com/webhook',
        method: 'PUT',
        payload: '{\n  "key": "value"\n}',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }, 3000);
  });

  it('handles initial payload correctly', () => {
    const initialPayload = {
      url: 'https://api.example.com/webhook',
      method: 'PATCH',
      payload: '{"initial": "value"}',
      headers: { 'Content-Type': 'application/json' }
    };

    render(<WebhookActionForm initialPayload={initialPayload} onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText('https://api.example.com/webhook')).toHaveValue(initialPayload.url);
    expect(screen.getByLabelText('Request Method')).toHaveValue(initialPayload.method);
    expect(screen.getByPlaceholderText('Enter JSON payload')).toHaveValue('{\n  "initial": "value"\n}');
  });

  it.skip('should be implemented', () => {
    // Placeholder test
  });
}); 
