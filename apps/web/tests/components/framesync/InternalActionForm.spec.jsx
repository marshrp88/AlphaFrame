import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InternalActionForm from '@/components/framesync/InternalActionForm';

// Mock the toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the app store
vi.mock('@/lib/store/appStore', () => ({
  useAppStore: () => ({
    goals: [
      { id: '1', name: 'Emergency Fund' },
      { id: '2', name: 'Vacation Savings' }
    ]
  })
}));

describe('InternalActionForm', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders action type selector with correct options', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    const actionTypeSelect = screen.getByText('Select an action type');
    expect(actionTypeSelect).toBeInTheDocument();

    // Open the select dropdown
    fireEvent.click(actionTypeSelect);

    // Check for action type options
    expect(screen.getByText('Adjust Goal')).toBeInTheDocument();
    expect(screen.getByText('Add Memo to Transaction')).toBeInTheDocument();
  });

  it('renders goal adjustment fields when ADJUST_GOAL is selected', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADJUST_GOAL action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Adjust Goal'));

    // Check for goal selection
    const goalSelect = screen.getByText('Select a goal');
    expect(goalSelect).toBeInTheDocument();

    // Check for amount input
    const amountInput = screen.getByPlaceholderText('Enter amount (e.g., 500)');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('type', 'number');
  });

  it('renders memo input when ADD_MEMO is selected', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADD_MEMO action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Add Memo to Transaction'));

    // Check for memo input
    const memoInput = screen.getByPlaceholderText('Enter memo text');
    expect(memoInput).toBeInTheDocument();
  });

  it('validates goal adjustment fields', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADJUST_GOAL action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Adjust Goal'));

    // Test empty amount
    const amountInput = screen.getByPlaceholderText('Enter amount (e.g., 500)');
    fireEvent.change(amountInput, { target: { value: '' } });
    expect(screen.getByText('Amount is required')).toBeInTheDocument();

    // Test invalid amount
    fireEvent.change(amountInput, { target: { value: 'not-a-number' } });
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();

    // Test valid amount
    fireEvent.change(amountInput, { target: { value: '500' } });
    expect(screen.queryByText('Please enter a valid number')).not.toBeInTheDocument();
  });

  it('validates memo input', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADD_MEMO action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Add Memo to Transaction'));

    // Test empty memo
    const memoInput = screen.getByPlaceholderText('Enter memo text');
    fireEvent.change(memoInput, { target: { value: '' } });
    expect(screen.getByText('Memo is required')).toBeInTheDocument();

    // Test memo length
    fireEvent.change(memoInput, { target: { value: 'a'.repeat(201) } });
    expect(screen.getByText('Memo must be less than 200 characters')).toBeInTheDocument();

    // Test valid memo
    fireEvent.change(memoInput, { target: { value: 'Valid memo' } });
    expect(screen.queryByText('Memo is required')).not.toBeInTheDocument();
  });

  it('calls onChange with correct payload for goal adjustment', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADJUST_GOAL action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Adjust Goal'));

    // Select goal
    const goalSelect = screen.getByText('Select a goal');
    fireEvent.click(goalSelect);
    fireEvent.click(screen.getByText('Emergency Fund'));

    // Enter amount
    const amountInput = screen.getByPlaceholderText('Enter amount (e.g., 500)');
    fireEvent.change(amountInput, { target: { value: '500' } });

    // Check if onChange was called with correct payload
    expect(mockOnChange).toHaveBeenCalledWith({
      type: 'ADJUST_GOAL',
      goalId: '1',
      amount: 500
    });
  });

  it('calls onChange with correct payload for memo addition', () => {
    render(<InternalActionForm onChange={mockOnChange} />);

    // Select ADD_MEMO action type
    const actionTypeSelect = screen.getByText('Select an action type');
    fireEvent.click(actionTypeSelect);
    fireEvent.click(screen.getByText('Add Memo to Transaction'));

    // Enter memo
    const memoInput = screen.getByPlaceholderText('Enter memo text');
    fireEvent.change(memoInput, { target: { value: 'Test memo' } });

    // Check if onChange was called with correct payload
    expect(mockOnChange).toHaveBeenCalledWith({
      type: 'ADD_MEMO',
      memo: 'Test memo'
    });
  });

  it('handles initial payload correctly', () => {
    const initialPayload = {
      type: 'ADJUST_GOAL',
      goalId: '2',
      amount: 1000
    };

    render(<InternalActionForm initialPayload={initialPayload} onChange={mockOnChange} />);

    // Check if action type is selected
    expect(screen.getByText('Adjust Goal')).toBeInTheDocument();

    // Check if goal is selected
    expect(screen.getByText('Vacation Savings')).toBeInTheDocument();

    // Check if amount is set
    const amountInput = screen.getByPlaceholderText('Enter amount (e.g., 500)');
    expect(amountInput).toHaveValue('1000');
  });
}); 