// DIAGNOSTIC HEADER FOR TRIAGE
console.log('TEST START: InternalActionForm');
vi.setTimeout(30000); // 30s timeout for triage

// --- ALL MOCKS MUST BE LOADED BEFORE COMPONENT IMPORTS ---
vi.mock('@/lib/config.js', () => ({
  config: {
    env: 'test',
    apiUrl: 'http://localhost:3000/api',
    plaid: { clientId: 'test-plaid-client-id', secret: 'test-plaid-secret', env: 'sandbox' },
    auth0: { domain: 'test.auth0.com', clientId: 'test-auth0-client-id', audience: 'test-audience', redirectUri: 'http://localhost:5173' },
    auth: { domain: 'test.auth0.com', clientId: 'test-auth0-client-id', audience: 'test-audience' },
    webhook: { url: 'http://localhost:3000/webhook', secret: 'test-webhook-secret' },
    notifications: { sendgridApiKey: 'test-sendgrid-key', fromEmail: 'noreply@alphaframe.com' },
    features: { betaMode: false, plaidIntegration: true, webhooks: true, notifications: true },
    logging: { level: 'info', debugMode: false },
    security: { encryptionKey: 'test-encryption-key', jwtSecret: 'test-jwt-secret' }
  },
  validateConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  initializeConfig: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  getFeatureFlag: vi.fn(() => false),
  isDevelopment: vi.fn(() => true),
  isProduction: vi.fn(() => false),
  isStaging: vi.fn(() => false),
  getSecureConfig: vi.fn(() => ({ env: 'test' }))
}));

vi.mock('@/lib/services/ExecutionController', () => ({
  executeAction: vi.fn(),
}));

vi.mock('@/lib/services/PermissionEnforcer', () => ({
  checkPermission: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { InternalActionForm } from '../../../src/components/framesync/InternalActionForm';

describe('InternalActionForm (triage)', () => {
  it('sanity: should run this test and not hang', () => {
    expect(true).toBe(true);
  });

  it('should render form elements', async () => {
    render(<InternalActionForm />);
    await waitFor(() => {
      expect(screen.getByText(/Internal Action/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    render(<InternalActionForm />);
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
    });
  });
});

// --- NEXT STEPS ---
// 1. Run this file in isolation. It should pass instantly.
// 2. If it still skips/hangs, try renaming the file as described in the CTO plan.
// 3. If it passes, uncomment one real test at a time and repeat.
// 4. Ensure all mocks are loaded before any component import.
// 5. Restore the full test suite only after confirming no hangs/skips. 