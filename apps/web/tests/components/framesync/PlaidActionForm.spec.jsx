import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaidActionForm } from '@/components/framesync/PlaidActionForm';
import { useAppStore } from '@/store/useAppStore';

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

  it('renders account selectors with correct options', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Check if both selectors are rendered
    expect(screen.getByText('From Account')).toBeInTheDocument();
    expect(screen.getByText('To Account')).toBeInTheDocument();

    // Check if all account options are rendered
    mockAccounts.forEach(account => {
      const formattedBalance = account.balance.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      expect(screen.getByText(`${account.name} (${formattedBalance})`)).toBeInTheDocument();
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

  it('handles form validation correctly', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Try to submit without selecting accounts
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });

    // Check if error messages are displayed
    expect(screen.getByText('Source account is required')).toBeInTheDocument();
    expect(screen.getByText('Destination account is required')).toBeInTheDocument();
  });

  it('prevents selecting same account for source and destination', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Select same account for both source and destination
    const sourceSelect = screen.getByText('Select source account').closest('button');
    const destinationSelect = screen.getByText('Select destination account').closest('button');

    fireEvent.click(sourceSelect);
    fireEvent.click(screen.getByText('Chase Checking ($5,000.00)'));

    fireEvent.click(destinationSelect);
    fireEvent.click(screen.getByText('Chase Checking ($5,000.00)'));

    expect(screen.getByText('Source and destination accounts must be different')).toBeInTheDocument();
  });

  it('calls onChange with correct payload when form is valid', () => {
    render(<PlaidActionForm onChange={mockOnChange} />);

    // Fill in the form
    const sourceSelect = screen.getByText('Select source account').closest('button');
    const destinationSelect = screen.getByText('Select destination account').closest('button');
    const amountInput = screen.getByPlaceholderText('0.00');

    fireEvent.click(sourceSelect);
    fireEvent.click(screen.getByText('Chase Checking ($5,000.00)'));

    fireEvent.click(destinationSelect);
    fireEvent.click(screen.getByText('Vanguard Brokerage ($25,000.00)'));

    fireEvent.change(amountInput, { target: { value: '100' } });

    // Check if onChange was called with correct payload
    expect(mockOnChange).toHaveBeenCalledWith({
      sourceAccount: 'acc_123',
      destinationAccount: 'acc_456',
      amountType: 'fixed',
      amount: '100',
      description: ''
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

    // Check if initial values are set
    expect(screen.getByText('Chase Checking ($5,000.00)')).toBeInTheDocument();
    expect(screen.getByText('Vanguard Brokerage ($25,000.00)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test transfer')).toBeInTheDocument();
  });
}); 