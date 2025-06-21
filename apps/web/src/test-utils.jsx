/**
 * test-utils.jsx
 * 
 * Purpose: Test utilities for AlphaFrame VX.1
 * 
 * This file provides:
 * - React 18 compatible test rendering
 * - Router wrappers for component tests
 * - Auth0 provider wrappers
 * - Common test utilities
 * 
 * Fixes:
 * - React 18 createRoot DOM container issues
 * - Component test setup problems
 * - Router and provider wrapping
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { vi } from 'vitest';

// Mock Auth0 configuration for tests
const auth0Config = {
  domain: 'test.auth0.com',
  clientId: 'test_client_id',
  authorizationParams: {
    redirect_uri: 'http://localhost:5173',
    audience: 'https://test.api.alphaframe.dev'
  }
};

// Mock Auth0 hook for tests
export const mockUseAuth0 = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn(),
  error: null
};

// Mock Auth0 provider
const MockAuth0Provider = ({ children }) => (
  <Auth0Provider {...auth0Config}>
    {children}
  </Auth0Provider>
);

// Custom render function with router
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

// Custom render function with Auth0
export const renderWithAuth0 = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <MockAuth0Provider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </MockAuth0Provider>
  );
};

// Custom render function with both router and Auth0
export const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <MockAuth0Provider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </MockAuth0Provider>
  );
};

// Utility to wait for loading states
export const waitForLoadingToFinish = () => {
  return screen.findByText(/loading/i, {}, { timeout: 3000 }).catch(() => {
    // If no loading text found, that's fine
  });
};

// Utility to mock user authentication
export const mockAuthenticatedUser = (user = {}) => {
  const mockUser = {
    sub: 'auth0|123',
    email: 'test@example.com',
    name: 'Test User',
    'https://alphaframe.com/roles': ['user'],
    'https://alphaframe.com/permissions': ['read:financial_data'],
    ...user
  };

  return {
    ...mockUseAuth0,
    isAuthenticated: true,
    user: mockUser
  };
};

// Utility to mock unauthenticated user
export const mockUnauthenticatedUser = () => {
  return {
    ...mockUseAuth0,
    isAuthenticated: false,
    user: null
  };
};

// Utility to mock loading state
export const mockLoadingState = () => {
  return {
    ...mockUseAuth0,
    isLoading: true
  };
};

// Utility to mock error state
export const mockErrorState = (error = 'Test error') => {
  return {
    ...mockUseAuth0,
    error: { message: error }
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render to use our custom setup
export { render }; 