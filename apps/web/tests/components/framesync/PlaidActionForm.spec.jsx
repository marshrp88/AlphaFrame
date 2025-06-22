import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaidActionForm } from '@/components/framesync/PlaidActionForm';
import { useAppStore } from '@/core/store/useAppStore';
import React from 'react';

// Mock the useAppStore
vi.mock('@/core/store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

// Mock the toast
vi.mock('@/shared/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the Select component for testability
vi.mock('@/shared/ui/Select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <select
      data-testid="select"
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
    >
      {React.Children.map(children, child => {
        if (child && child.props && child.props.children) {
          return React.Children.map(child.props.children, grandChild => {
            if (grandChild && grandChild.props && grandChild.props.value) {
              return (
                <option key={grandChild.props.value} value={grandChild.props.value}>
                  {grandChild.props.children}
                </option>
              );
            }
            return null;
          });
        }
        return null;
      })}
    </select>
  ),
  SelectItem: ({ value, children }) => <>{children}</>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
}));

// Mock other UI components
vi.mock('@/shared/ui/Input', () => ({
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

vi.mock('@/shared/ui/Label', () => ({
  Label: ({ children, htmlFor, ...props }) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  )
}));

vi.mock('@/shared/ui/radio-group', () => ({
  RadioGroup: ({ value, onValueChange, children, ...props }) => (
    <div role="radiogroup" {...props}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id, ...props }) => (
    <input
      type="radio"
      value={value}
      id={id}
      {...props}
    />
  )
}));

describe('PlaidActionForm', () => {
  const mockAccounts = [
    { id: 'acc_123', name: 'Chase Checking', balance: 5000 },
    { id: 'acc_456', name: 'Vanguard Brokerage', balance: 25000 },
    { id: 'acc_789', name: 'Savings Account', balance: 10000 }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.mockImplementation((selector) => selector({ accounts: mockAccounts }));
  });

  it('renders form fields correctly', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Check if form fields are rendered
    expect(screen.getByText('From Account')).toBeInTheDocument();
    expect(screen.getByText('To Account')).toBeInTheDocument();
    expect(screen.getByText('Amount Type')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders account selectors', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Check if select elements are rendered
    const selects = screen.getAllByTestId('select');
    expect(selects).toHaveLength(2);
  });

  it('renders amount input with correct attributes', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    const amountInput = screen.getByPlaceholderText('0.00');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('type', 'number');
    expect(amountInput).toHaveAttribute('min', '0');
    expect(amountInput).toHaveAttribute('step', '0.01');
  });

  it('renders radio buttons for amount type', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    expect(screen.getByText('Fixed Amount')).toBeInTheDocument();
    expect(screen.getByText('Surplus Above')).toBeInTheDocument();
  });

  it('handles initial payload correctly', () => {
    const initialPayload = {
      sourceAccount: 'acc_123',
      destinationAccount: 'acc_456',
      amount: '100',
      description: 'Test transfer'
    };

    render(<PlaidActionForm initialPayload={initialPayload} onChange={mockOnChange} />);

    // Check if initial values are set
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test transfer')).toBeInTheDocument();
  });

  it('calls onChange when form values change', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);
    
    // Set up valid form state by selecting accounts and entering amount
    const selects = screen.getAllByTestId('select');
    const [fromSelect, toSelect] = selects;
    
    // Select different accounts (required for validation)
    fireEvent.change(fromSelect, { target: { value: 'acc_123' } });
    fireEvent.change(toSelect, { target: { value: 'acc_456' } });
    
    // Enter a valid amount (required for validation)
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });
    
    // The onChange should be called with the updated form data
    expect(mockOnChange).toHaveBeenCalledWith({
      sourceAccount: 'acc_123',
      destinationAccount: 'acc_456',
      amountType: 'fixed',
      amount: '100',
      description: ''
    });
  });
}); 
