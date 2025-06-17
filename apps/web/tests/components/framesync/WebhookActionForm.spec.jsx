import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WebhookActionForm } from '@/components/framesync/WebhookActionForm';

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('WebhookActionForm', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

  it('validates URL input', () => {
    render(<WebhookActionForm onChange={mockOnChange} />);

    const urlInput = screen.getByPlaceholderText('https://api.example.com/webhook');
    
    // Test empty URL
    fireEvent.change(urlInput, { target: { value: '' } });
    expect(screen.getByText('Webhook URL is required')).toBeInTheDocument();
    
    // Test invalid URL
    fireEvent.change(urlInput, { target: { value: 'not-a-url' } });
    expect(screen.getByText('Please enter a valid HTTPS URL')).toBeInTheDocument();
    
    // Test HTTP URL
    fireEvent.change(urlInput, { target: { value: 'http://example.com' } });
    expect(screen.getByText('Please enter a valid HTTPS URL')).toBeInTheDocument();
    
    // Test valid HTTPS URL
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/webhook' } });
    expect(screen.queryByText(/Please enter a valid HTTPS URL/)).not.toBeInTheDocument();
  });

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