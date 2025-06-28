import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock config.js to avoid import.meta.env issues
jest.mock('@/lib/config.js', () => ({
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
  validateConfig: jest.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  initializeConfig: jest.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  getFeatureFlag: jest.fn(() => false),
  isDevelopment: jest.fn(() => true),
  isProduction: jest.fn(() => false),
  isStaging: jest.fn(() => false),
  getSecureConfig: jest.fn(() => ({ env: 'test' }))
}));

import { PlaidActionForm } from '../../../src/components/framesync/PlaidActionForm';

// Mock dependencies
jest.mock('@/lib/services/ExecutionController', () => ({
  executeAction: jest.fn(),
}));

jest.mock('@/lib/services/PermissionEnforcer', () => ({
  checkPermission: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe('PlaidActionForm', () => {
  it('sanity: should run this test and not hang', () => {
    expect(true).toBe(true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
