import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InternalActionForm } from '@/components/framesync/InternalActionForm';

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the app store
vi.mock('@/core/store/useAppStore', () => ({
  useAppStore: () => ({
    goals: [
      { id: '1', name: 'Emergency Fund' },
      { id: '2', name: 'Vacation Savings' }
    ]
  })
}));

// Mock the UI components with simple implementations
vi.mock('@/components/ui/Label', () => ({
  Label: ({ children, htmlFor, ...props }) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  )
}));

vi.mock('@/components/ui/Input', () => ({
  Input: ({ id, type = 'text', value, onChange, placeholder, ...props }) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  )
}));

vi.mock('@/components/ui/textarea', () => ({
  default: ({ id, value, onChange, placeholder, ...props }) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  )
}));

describe('InternalActionForm', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Check for form fields using placeholder text
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter memo text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter goal ID')).toBeInTheDocument();
  });

  it('handles amount input changes', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '500' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      amount: '500',
      memo: '',
      goalId: ''
    });
  });

  it('handles memo input changes', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    const memoInput = screen.getByPlaceholderText('Enter memo text');
    fireEvent.change(memoInput, { target: { value: 'Test memo' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      amount: '',
      memo: 'Test memo',
      goalId: ''
    });
  });

  it('handles goal ID input changes', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    const goalIdInput = screen.getByPlaceholderText('Enter goal ID');
    fireEvent.change(goalIdInput, { target: { value: 'goal_123' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      amount: '',
      memo: '',
      goalId: 'goal_123'
    });
  });

  it('handles initial payload correctly', () => {
    const initialPayload = {
      amount: '1000',
      memo: 'Initial memo',
      goalId: 'goal_456'
    };

    render(<InternalActionForm initialPayload={initialPayload} onChange={mockOnChange} />);

    // Check if initial values are set
    expect(screen.getByPlaceholderText('Enter amount')).toHaveValue(1000);
    expect(screen.getByPlaceholderText('Enter memo text')).toHaveValue('Initial memo');
    expect(screen.getByPlaceholderText('Enter goal ID')).toHaveValue('goal_456');
  });
}); 
