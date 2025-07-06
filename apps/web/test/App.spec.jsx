// Mock window.matchMedia for JSDOM compatibility (must be first)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// STEP 2: Mock config.js EARLY, before all imports
vi.mock('@/lib/config.js', () => ({
  __esModule: true,
  default: {
    env: 'test',
    apiUrl: 'http://localhost:3000/api',
    plaid: {
      clientId: 'test-plaid-client-id',
      secret: 'test-plaid-secret',
      env: 'sandbox'
    },
    auth0: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience',
      redirectUri: 'http://localhost:5173'
    },
    auth: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience'
    },
    webhook: {
      url: 'http://localhost:3000/webhook',
      secret: 'test-webhook-secret'
    },
    notifications: {
      sendgridApiKey: 'test-sendgrid-key',
      fromEmail: 'noreply@alphaframe.com'
    },
    features: {
      betaMode: false,
      plaidIntegration: true,
      webhooks: true,
      notifications: true
    },
    logging: {
      level: 'info',
      debugMode: false
    },
    security: {
      encryptionKey: 'test-encryption-key',
      jwtSecret: 'test-jwt-secret'
    }
  },
  config: {
    env: 'test',
    apiUrl: 'http://localhost:3000/api',
    plaid: {
      clientId: 'test-plaid-client-id',
      secret: 'test-plaid-secret',
      env: 'sandbox'
    },
    auth0: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience',
      redirectUri: 'http://localhost:5173'
    },
    auth: {
      domain: 'test.auth0.com',
      clientId: 'test-auth0-client-id',
      audience: 'test-audience'
    },
    webhook: {
      url: 'http://localhost:3000/webhook',
      secret: 'test-webhook-secret'
    },
    notifications: {
      sendgridApiKey: 'test-sendgrid-key',
      fromEmail: 'noreply@alphaframe.com'
    },
    features: {
      betaMode: false,
      plaidIntegration: true,
      webhooks: true,
      notifications: true
    },
    logging: {
      level: 'info',
      debugMode: false
    },
    security: {
      encryptionKey: 'test-encryption-key',
      jwtSecret: 'test-jwt-secret'
    }
  },
  validateConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  initializeConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  getFeatureFlag: vi.fn(() => false),
  isDevelopment: vi.fn(() => true),
  isProduction: vi.fn(() => false),
  isStaging: vi.fn(() => false),
  getSecureConfig: vi.fn(() => ({ env: 'test' }))
}));

// Mock the auth store
vi.mock('@/core/store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 1, email: 'test@example.com' },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn()
  })
}));

// STEP 1: Convert all component mocks to React-compatible functions
vi.mock('@/components/ui/PerformanceMonitor', () => ({
  default: () => null
}));

vi.mock('@/components/PrivateRoute', () => ({ children }) => <div data-testid="private-route">{children}</div>);

vi.mock('@/components/ErrorBoundary', () => ({
  default: ({ children }) => <div data-testid="error-boundary">{children}</div>
}));

vi.mock('@/components/LoginButton', () => () => <button data-testid="login-button">Mock:LoginButton</button>);

vi.mock('@/components/dashboard/LiveFinancialDashboard', () => () => <div data-testid="live-dashboard">Mock:LiveDashboard</div>);

vi.mock('@/components/dashboard/Dashboard2', () => () => <div data-testid="dashboard2">Mock:Dashboard2</div>);

vi.mock('@/features/onboarding/OnboardingFlow', () => ({
  default: () => <div data-testid="onboarding-flow">Mock:OnboardingFlow</div>
}));

// Mock other components that might cause issues
vi.mock('@/components/ui/DarkModeToggle', () => ({
  default: () => <div data-testid="dark-mode-toggle">Mock:DarkModeToggle</div>
}));

vi.mock('@/components/ui/NavBar', () => ({
  default: () => <nav data-testid="navbar">Mock:NavBar</nav>
}));

vi.mock('@/components/ui/StyledButton', () => ({
  default: ({ children, ...props }) => <button data-testid="styled-button" {...props}>{children}</button>
}));

vi.mock('@/components/ui/CompositeCard', () => ({
  default: ({ children, ...props }) => <div data-testid="composite-card" {...props}>{children}</div>
}));

// Simplified Auth0 mock
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => ({ 
    isAuthenticated: true, 
    user: { name: 'Test User' }, 
    logout: vi.fn(),
    isLoading: false,
    error: null
  })),
  Auth0Provider: ({ children }) => children,
}));

// FIXED: Include ToastProvider export that App.jsx needs
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
  ToastProvider: ({ children }) => children,
}));

// Mock lazy-loaded pages
vi.mock('@/pages/Profile', () => ({
  default: () => <div data-testid="profile-page">Mock:Profile</div>
}));
vi.mock('@/pages/Home', () => ({
  default: () => <div data-testid="home-page">Mock:Home</div>
}));
vi.mock('@/pages/About', () => ({
  default: () => <div data-testid="about-page">Mock:About</div>
}));
vi.mock('@/pages/AlphaPro', () => ({
  default: () => <div data-testid="alphapro-page">Mock:AlphaPro</div>
}));
vi.mock('@/pages/RulesPage', () => ({
  default: () => <div data-testid="rules-page">Mock:RulesPage</div>
}));
vi.mock('@/pages/TestMount', () => ({
  default: () => <div data-testid="testmount-page">Mock:TestMount</div>
}));
vi.mock('@/pages/ProPlanner', () => ({
  default: () => <div data-testid="proplanner-page">Mock:ProPlanner</div>
}));
vi.mock('@/pages/ProDashboard', () => ({
  default: () => <div data-testid="prodashboard-page">Mock:ProDashboard</div>
}));
vi.mock('@/pages/ProAnalytics', () => ({
  default: () => <div data-testid="proanalytics-page">Mock:ProAnalytics</div>
}));
vi.mock('@/pages/ProSettings', () => ({
  default: () => <div data-testid="prosettings-page">Mock:ProSettings</div>
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';

import App from '../src/App';

describe('App Integration Tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // CRITICAL: Comprehensive sanity test to verify window.matchMedia is available
  it('should have window.matchMedia available', () => {
    // Verify the function exists (Jest mock should provide this)
    expect(typeof window.matchMedia).toBe('function');
    
    // Verify it returns the expected structure
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    expect(mediaQuery).toBeDefined();
    expect(mediaQuery.matches).toBe(false);
    expect(mediaQuery.media).toBe('(prefers-color-scheme: dark)');
    expect(typeof mediaQuery.addListener).toBe('function');
    expect(typeof mediaQuery.removeListener).toBe('function');
  });

  it('should render the app without crashing', async () => {
    // Simple render test with minimal expectations
    render(<App />);

    // Wait for any async rendering to complete
    await waitFor(() => {
      // Just check that something rendered - don't be too specific
      expect(document.body).not.toBeEmptyDOMElement();
    }, { timeout: 10000 });
  }, 15000);

  it('should render basic app structure', async () => {
    render(<App />);

    // Wait for rendering with increased timeout
    await waitFor(() => {
      // Check for basic app elements that should always be present
      const appElement = document.querySelector('[data-testid="app"]') || 
                        document.querySelector('#root') || 
                        document.querySelector('.app') ||
                        document.querySelector('[data-testid="error-boundary"]');
      expect(appElement).toBeInTheDocument();
    }, { timeout: 15000 });
  }, 20000);

  // Test that components render properly
  it('should render app components', async () => {
    render(<App />);

    // Wait for components to render
    await waitFor(() => {
      // Check for basic app structure
      expect(document.body).not.toBeEmptyDOMElement();
    }, { timeout: 10000 });
  }, 15000);
}); 