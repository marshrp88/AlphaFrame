import { vi } from 'vitest';

// Mock UI components
export const mockUIComponents = {
  Select: vi.fn(({ children, value, onValueChange }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  )),
  SelectTrigger: vi.fn(({ children }) => <div>{children}</div>),
  SelectValue: vi.fn(({ placeholder }) => <span>{placeholder}</span>),
  SelectContent: vi.fn(({ children }) => <div>{children}</div>),
  SelectItem: vi.fn(({ children, value }) => <option value={value}>{children}</option>),
  Input: vi.fn(({ value, onChange, ...props }) => (
    <input value={value} onChange={onChange} {...props} />
  )),
  Label: vi.fn(({ children }) => <label>{children}</label>),
  RadioGroup: vi.fn(({ children, value, onValueChange }) => (
    <div onChange={(e) => onValueChange?.(e.target.value)}>{children}</div>
  )),
  RadioGroupItem: vi.fn(({ value, children }) => (
    <div>
      <input type="radio" value={value} />
      {children}
    </div>
  ))
};

// Mock stores
export const mockStores = {
  useAppStore: vi.fn((selector) => {
    // Provide a realistic mock for selector usage
    const state = {
      counter: 0,
      accounts: [
        { id: '1', name: 'Checking', balance: 1000 },
        { id: '2', name: 'Savings', balance: 5000 }
      ],
      increment: vi.fn(),
      reset: vi.fn(),
    };
    return selector ? selector(state) : state.counter; // Default to counter if no selector
  }),
  useAuthStore: vi.fn(() => ({
    isAuthenticated: true,
    user: {
      permissions: ['plaid:transfer', 'webhook:execute']
    }
  })),
  useUIStore: vi.fn(() => ({
    showPasswordPrompt: vi.fn()
  }))
};

// Setup function to be called in test files
export const setupTest = () => {
  // Mock all UI components
  vi.mock('@/components/ui/Select', () => ({
    Select: mockUIComponents.Select,
    SelectTrigger: mockUIComponents.SelectTrigger,
    SelectValue: mockUIComponents.SelectValue,
    SelectContent: mockUIComponents.SelectContent,
    SelectItem: mockUIComponents.SelectItem
  }));

  vi.mock('@/components/ui/Input', () => ({
    Input: mockUIComponents.Input
  }));

  vi.mock('@/components/ui/Label', () => ({
    Label: mockUIComponents.Label
  }));

  vi.mock('@/components/ui/radio-group', () => ({
    RadioGroup: mockUIComponents.RadioGroup,
    RadioGroupItem: mockUIComponents.RadioGroupItem
  }));

  // Mock stores
  vi.mock('@/store/useAppStore', () => ({
    useAppStore: mockStores.useAppStore
  }));

  vi.mock('@/store/authStore', () => ({
    useAuthStore: mockStores.useAuthStore
  }));

  vi.mock('@/store/uiStore', () => ({
    useUIStore: mockStores.useUIStore
  }));
}; 
