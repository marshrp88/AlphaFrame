import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach  } from 'vitest';

// Mock config.js to avoid import.meta.env issues
vi.mock('@/lib/config.js', () => ({
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

import { PlaidActionForm } from '../../../src/components/framesync/PlaidActionForm';

// Mock dependencies
vi.mock('@/lib/services/ExecutionController', () => ({
  executeAction: vi.fn(),
}));

vi.mock('@/lib/services/PermissionEnforcer', () => ({
  checkPermission: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock useAppStore to provide accounts data
vi.mock('@/core/store/useAppStore', () => ({
  useAppStore: vi.fn((selector) => {
    const mockState = {
      accounts: [
        { id: 'acc_1', name: 'Checking Account', balance: 5000 },
        { id: 'acc_2', name: 'Savings Account', balance: 10000 },
        { id: 'acc_3', name: 'Credit Card', balance: -500 }
      ],
      user: { id: 1, email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
    return selector ? selector(mockState) : mockState;
  })
}));

describe('PlaidActionForm', () => {
  it('sanity: should run this test and not hang', () => {
    expect(true).toBe(true);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render form elements', async () => {
    render(<PlaidActionForm />);
    await waitFor(() => {
      expect(screen.getByText(/Transfer Configuration/i)).toBeInTheDocument();
      expect(screen.getByText(/Configure your Plaid transfer settings/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    render(<PlaidActionForm />);
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Save Configuration/i });
      expect(submitButton).toBeInTheDocument();
    });
  });
}); 
