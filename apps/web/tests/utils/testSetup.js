import { vi, beforeEach, afterEach } from 'vitest';

// Mock window.matchMedia (common source of test hangs)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver (another common source of hangs)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock crypto for secure operations
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
      decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

// Mock Zustand stores with proper cleanup
const mockStores = {
  authStore: {
    isAuthenticated: true,
    user: {
      id: 'test-user',
      permissions: ['plaid:transfer', 'webhook:execute', 'goals:modify'],
    },
    login: vi.fn().mockResolvedValue({ success: true }),
    logout: vi.fn().mockResolvedValue({ success: true }),
  },
  uiStore: {
    showPasswordPrompt: vi.fn().mockImplementation(({ onConfirm }) => {
      onConfirm('test-password');
      return Promise.resolve();
    }),
    showToast: vi.fn(),
    isSandboxMode: true,
  },
  appStore: {
    accounts: [
      { id: 'acc_1', name: 'Checking', balance: 1000, type: 'checking' },
      { id: 'acc_2', name: 'Savings', balance: 5000, type: 'savings' },
    ],
    selectedAccount: null,
    setSelectedAccount: vi.fn(),
  },
};

// Mock UI components with proper cleanup
const mockComponents = {
  Select: vi.fn(({ children, value, onValueChange }) => (
    <select value={value} onChange={(e) => onValueChange?.(e.target.value)}>
      {children}
    </select>
  )),
  SelectTrigger: vi.fn(({ children }) => <div>{children}</div>),
  SelectValue: vi.fn(({ placeholder }) => <span>{placeholder}</span>),
  SelectContent: vi.fn(({ children }) => <div>{children}</div>),
  SelectItem: vi.fn(({ children }) => <option>{children}</option>),
  Input: vi.fn(({ value, onChange, ...props }) => (
    <input value={value} onChange={onChange} {...props} />
  )),
  Label: vi.fn(({ children }) => <label>{children}</label>),
  RadioGroup: vi.fn(({ children, onValueChange }) => (
    <div onChange={(e) => onValueChange?.(e.target.value)}>{children}</div>
  )),
  RadioGroupItem: vi.fn(({ children }) => (
    <div>
      <input type="radio" />
      {children}
    </div>
  )),
};

// Setup function to be called before each test
export const setupTest = () => {
  // Mock all stores
  vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn(() => mockStores.authStore),
  }));

  vi.mock('@/store/uiStore', () => ({
    useUIStore: vi.fn(() => mockStores.uiStore),
  }));

  vi.mock('@/store/useAppStore', () => ({
    useAppStore: vi.fn(() => mockStores.appStore),
  }));

  // Mock all UI components
  vi.mock('@/components/ui/Select', () => ({
    Select: mockComponents.Select,
    SelectTrigger: mockComponents.SelectTrigger,
    SelectValue: mockComponents.SelectValue,
    SelectContent: mockComponents.SelectContent,
    SelectItem: mockComponents.SelectItem,
  }));

  vi.mock('@/components/ui/Input', () => ({
    Input: mockComponents.Input,
  }));

  vi.mock('@/components/ui/Label', () => ({
    Label: mockComponents.Label,
  }));

  vi.mock('@/components/ui/radio-group', () => ({
    RadioGroup: mockComponents.RadioGroup,
    RadioGroupItem: mockComponents.RadioGroupItem,
  }));

  // Mock secure vault operations
  vi.mock('@/lib/services/secureVault', () => ({
    unlock: vi.fn().mockResolvedValue(true),
    lock: vi.fn().mockResolvedValue(true),
    isLocked: vi.fn().mockReturnValue(false),
  }));
};

// Cleanup function to be called after each test
export const cleanupTest = () => {
  vi.clearAllMocks();
  vi.resetModules();
};

// Setup and cleanup hooks
beforeEach(() => {
  setupTest();
});

afterEach(() => {
  cleanupTest();
}); 
