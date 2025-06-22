// CLUSTER 1 FIX: Add test-local fetch mock BEFORE imports to prevent hanging
global.fetch = vi.fn(() => Promise.resolve({ 
  json: () => Promise.resolve({ success: true }),
  ok: true 
}));

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WebhookActionForm from '@/components/framesync/WebhookActionForm';

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/components/ui/Input', () => ({
  Input: (props) => <input {...props} />
}));
vi.mock('@/components/ui/Label', () => ({
  Label: (props) => <label {...props} />
}));
vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea {...props} />
}));

describe('WebhookActionForm', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // CLUSTER 1 FIX: Reset any global state that might interfere
    console.log('WebhookActionForm test starting...');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    console.log('WebhookActionForm test completed');
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
    console.log('Starting URL validation test...');
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    
    // Test empty URL - CLUSTER 1 FIX: More robust validation with proper waiting
    console.log('Testing empty URL...');
    fireEvent.change(urlInput, { target: { value: '' } });
    fireEvent.blur(urlInput); // Trigger validation
    
    // CLUSTER 1 FIX: Wait for validation to complete and check for error
    await waitFor(() => {
      const errorElement = screen.queryByText('Webhook URL is required');
      console.log('Empty URL error found:', !!errorElement);
      expect(errorElement).toBeInTheDocument();
    }, 1000);
    
    // Test invalid URL - CLUSTER 1 FIX: More robust validation
    console.log('Testing invalid URL...');
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    fireEvent.blur(urlInput); // Trigger validation
    
    await waitFor(() => {
      const errorElement = screen.queryByText('Please enter a valid HTTPS URL');
      console.log('Invalid URL error found:', !!errorElement);
      expect(errorElement).toBeInTheDocument();
    }, 1000);
    
    // Test HTTP URL - CLUSTER 1 FIX: More robust validation
    console.log('Testing HTTP URL...');
    fireEvent.change(urlInput, { target: { value: 'http://example.com' } });
    fireEvent.blur(urlInput); // Trigger validation
    
    await waitFor(() => {
      const errorElement = screen.queryByText('Please enter a valid HTTPS URL');
      console.log('HTTP URL error found:', !!errorElement);
      expect(errorElement).toBeInTheDocument();
    }, 1000);
    
    // Test valid HTTPS URL - CLUSTER 1 FIX: More robust validation
    console.log('Testing valid HTTPS URL...');
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/webhook' } });
    fireEvent.blur(urlInput); // Trigger validation
    
    // CLUSTER 1 FIX: Wait for validation to clear errors
    await waitFor(() => {
      const errorElements = screen.queryAllByText(/Please enter a valid HTTPS URL|Webhook URL is required/);
      console.log('Valid URL - error elements found:', errorElements.length);
      expect(errorElements).toHaveLength(0);
    }, 1000);
    
    console.log('URL validation test completed');
  }, 8000); // CLUSTER 1 FIX: Reduced timeout from 10s to 8s

  it('validates JSON payload', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');
    
    // Test invalid JSON
    fireEvent.change(payloadTextarea, { target: { value: 'not json' } });
    expect(screen.getByText('Please enter valid JSON')).toBeInTheDocument();
    
    // Test valid JSON
    fireEvent.change(payloadTextarea, { target: { value: '{"key": "value"}' } });
    expect(screen.queryByText('Please enter valid JSON')).not.toBeInTheDocument();
  });

  it('formats valid JSON payload', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');
    
    // Enter unformatted JSON
    fireEvent.change(payloadTextarea, { target: { value: '{"key":"value"}' } });
    
    // Check if it was formatted
    expect(payloadTextarea).toHaveValue('{\n  "key": "value"\n}');
  });

  it('calls onChange with correct payload when form is valid', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    const methodSelect = screen.getByLabelText('Request Method');
    const payloadTextarea = screen.getByPlaceholderText('Enter JSON payload');

    // Fill in the form
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/webhook' } });
    fireEvent.change(methodSelect, { target: { value: 'PUT' } });
    fireEvent.change(payloadTextarea, { target: { value: '{"key": "value"}' } });

    // Check if onChange was called with correct payload
    expect(mockOnChange).toHaveBeenCalledWith({
      url: 'https://api.example.com/webhook',
      method: 'PUT',
      payload: '{\n  "key": "value"\n}',
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
    expect(screen.getByPlaceholderText('Enter JSON payload')).toHaveValue(initialPayload.payload);
  });
}); 
