/**
 * test-smoke.js
 * 
 * Purpose: Smoke test to verify test infrastructure fixes
 * 
 * This file tests:
 * - React 18 createRoot compatibility
 * - Auth0 mocking setup
 * - Plaid mocking setup
 * - Environment variable access
 * 
 * Used to validate infrastructure fixes before running full test suite
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Test React 18 createRoot compatibility
describe('React 18 Test Infrastructure', () => {
  it('should render a simple component without createRoot errors', () => {
    const TestComponent = () => <div data-testid="test">Hello World</div>;
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should access environment variables without errors', () => {
    expect(import.meta.env.VITE_APP_ENV).toBe('test');
    expect(import.meta.env.VITE_AUTH0_DOMAIN).toBe('test.auth0.com');
    expect(import.meta.env.VITE_PLAID_CLIENT_ID).toBe('test_plaid_client_id');
  });

  it('should have localStorage mocked', () => {
    expect(window.localStorage).toBeDefined();
    expect(typeof window.localStorage.getItem).toBe('function');
    expect(typeof window.localStorage.setItem).toBe('function');
  });

  it('should have sessionStorage mocked', () => {
    expect(window.sessionStorage).toBeDefined();
    expect(typeof window.sessionStorage.getItem).toBe('function');
    expect(typeof window.sessionStorage.setItem).toBe('function');
  });

  it('should have fetch mocked', () => {
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  it('should have crypto mocked', () => {
    expect(window.crypto).toBeDefined();
    expect(typeof window.crypto.getRandomValues).toBe('function');
  });
});

// Test Auth0 mocking
describe('Auth0 Mocking', () => {
  it('should mock Auth0 hooks', async () => {
    const { useAuth0 } = await import('@auth0/auth0-react');
    const auth0 = useAuth0();
    
    expect(auth0.isAuthenticated).toBe(false);
    expect(auth0.isLoading).toBe(false);
    expect(auth0.user).toBeNull();
    expect(typeof auth0.loginWithRedirect).toBe('function');
    expect(typeof auth0.logout).toBe('function');
  });
});

// Test Plaid mocking
describe('Plaid Mocking', () => {
  it('should mock Plaid SDK', async () => {
    const { PlaidApi, Configuration, PlaidEnvironments } = await import('plaid');
    
    expect(typeof PlaidApi).toBe('function');
    expect(typeof Configuration).toBe('function');
    expect(PlaidEnvironments.sandbox).toBe('sandbox');
    expect(PlaidEnvironments.development).toBe('development');
    expect(PlaidEnvironments.production).toBe('production');
  });
});

// Test react-plaid-link mocking
describe('React Plaid Link Mocking', () => {
  it('should mock usePlaidLink hook', async () => {
    const { usePlaidLink } = await import('react-plaid-link');
    const plaidLink = usePlaidLink({});
    
    expect(typeof plaidLink.open).toBe('function');
    expect(plaidLink.ready).toBe(true);
  });
});

console.log('✅ Smoke test infrastructure validation complete'); 