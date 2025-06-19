import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaidActionForm } from '@/components/framesync/PlaidActionForm';
import { useAppStore } from '@/store/useAppStore';
import React from 'react';

// Mock the useAppStore
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the Select component for testability
vi.mock('@/components/ui/Select', () => {
  // Helper to recursively find all SelectItem children
  function extractOptions(children) {
    const options = [];
    React.Children.forEach(children, child => {
      if (!child) return;
      if (child.type && child.type.name === 'SelectItem') {
        options.push(child);
      } else if (child.props && child.props.children) {
        options.push(...extractOptions(child.props.children));
      }
    });
    return options;
  }
  return {
    Select: ({ value, onValueChange, children }) => (
      <select
        data-testid="select"
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
      >
        {extractOptions(children).map(option => (
          <option key={option.props.value} value={option.props.value}>
            {option.props.children}
          </option>
        ))}
      </select>
    ),
    SelectItem: ({ value, children }) => <>{children}</>,
    SelectTrigger: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
  };
});

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

  it('renders account selectors with correct options', async () => {
    render(<PlaidActionForm onChange={mockOnChange} />);
    screen.debug();

    // Check if both selectors are rendered
    expect(screen.getByText('From Account')).toBeInTheDocument();
    expect(screen.getByText('To Account')).toBeInTheDocument();

    // Check if all account options are rendered in both selects
    mockAccounts.forEach(account => {
      const formattedBalance = account.balance.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      // There should be two options per account (one in each select)
      const options = screen.getAllByRole('option', { name: `${account.name} (${formattedBalance})` });
      expect(options.length).toBe(2);
    });

    // Use getAllByTestId for selects
    const [fromSelect, toSelect] = screen.getAllByTestId('select');
    fireEvent.change(fromSelect, { target: { value: 'acc_123' } });
    fireEvent.change(toSelect, { target: { value: 'acc_456' } });
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.blur(amountInput);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456',
        amountType: 'fixed',
        amount: '100',
        description: ''
      });
    });
  });

  it('renders amount input with correct type and validation', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    const amountInput = screen.getByPlaceholderText('0.00');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('type', 'number');
    expect(amountInput).toHaveAttribute('min', '0');
    expect(amountInput).toHaveAttribute('step', '0.01');
  });

  it('handles form validation correctly', async () => {
    render(<PlaidActionForm onChange={mockOnChange} />);
    screen.debug();
    // Use getAllByTestId for selects
    const [fromSelect, toSelect] = screen.getAllByTestId('select');
    fireEvent.change(fromSelect, { target: { value: '' } });
    fireEvent.change(toSelect, { target: { value: '' } });
    // Trigger blur on amount input
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.blur(amountInput);
    await waitFor(() => {
      expect(screen.getByText('Source account is required')).toBeInTheDocument();
      // Accept either the destination required or the combined error message
      expect(
        screen.getByText(
          (text) =>
            text === 'Destination account is required' ||
            text === 'Source and destination accounts must be different'
        )
      ).toBeInTheDocument();
    });
  });

  it('prevents selecting same account for source and destination', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Use getAllByRole for selects
    const [fromSelect, toSelect] = screen.getAllByRole('combobox');

    // Select same account for both source and destination
    fireEvent.change(fromSelect, { target: { value: 'acc_123' } });
    fireEvent.change(toSelect, { target: { value: 'acc_123' } });

    expect(screen.getByText('Source and destination accounts must be different')).toBeInTheDocument();
  });

  it('calls onChange with correct payload when form is valid', async () => {
    render(<PlaidActionForm onChange={mockOnChange} />);
    const [fromSelect, toSelect] = screen.getAllByTestId('select');
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(fromSelect, { target: { value: 'acc_123' } });
    fireEvent.change(toSelect, { target: { value: 'acc_456' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.blur(amountInput);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456',
        amountType: 'fixed',
        amount: '100',
        description: ''
      });
    });
  });

  it('handles initial payload correctly', () => {
    const initialPayload = {
      sourceAccount: 'acc_123',
      destinationAccount: 'acc_456',
      amount: '100',
      description: 'Test transfer'
    };

    render(<PlaidActionForm initialPayload={initialPayload} onChange={mockOnChange} />);

    // Use getAllByRole for option
    const chaseOptions = screen.getAllByRole('option', { name: 'Chase Checking ($5,000.00)' });
    expect(chaseOptions.length).toBe(2);
    const vanguardOptions = screen.getAllByRole('option', { name: 'Vanguard Brokerage ($25,000.00)' });
    expect(vanguardOptions.length).toBe(2);
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test transfer')).toBeInTheDocument();
  });
}); 
