/**
 * test-utils.jsx - Reusable Test Utilities for AlphaFrame
 * 
 * Purpose: Provide standardized testing patterns and utilities for React 18 + Vitest + JSDOM
 * 
 * Procedure:
 * - DOM polyfills for JSDOM compatibility
 * - Service mocking utilities
 * - Common test setup and teardown
 * - Reusable assertion helpers
 * 
 * Conclusion: Centralized testing utilities ensure consistency and reduce duplication
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

// ============================================================================
// DOM POLYFILLS: JSDOM compatibility utilities
// ============================================================================

/**
 * Setup DOM polyfills for JSDOM environment
 * Handles file download operations, navigation, and browser APIs
 */
export const setupDOMPolyfills = () => {
  // Prevent JSDOM navigation errors
  HTMLAnchorElement.prototype.click = vi.fn();
  
  // Stub blob URL creation and cleanup
  global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
  global.URL.revokeObjectURL = vi.fn();
  
  // Mock Blob constructor
  global.Blob = vi.fn(() => ({
    size: 1024,
    type: 'application/json'
  }));
  
  // Mock Date.now for consistent timestamps
  vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  
  // Prevent default navigation behavior
  document.addEventListener('click', (e) => e.preventDefault());
};

/**
 * Clean up DOM polyfills and event listeners
 */
export const cleanupDOMPolyfills = () => {
  vi.restoreAllMocks();
  document.removeEventListener('click', (e) => e.preventDefault());
};

// ============================================================================
// SERVICE MOCKING UTILITIES: Standardized service mocks
// ============================================================================

/**
 * Create a mock for ExecutionLogService with realistic data
 */
export const createExecutionLogServiceMock = (customData = null) => {
  const defaultData = [
    {
      id: 'test-log-1',
      type: 'test.log',
      timestamp: Date.now(),
      payload: { test: 'mocked data' },
      severity: 'info',
      userId: 'test-user',
      sessionId: 'test-session',
      meta: { component: 'TestComponent', action: 'test' }
    }
  ];
  
  return {
    default: {
      queryLogs: vi.fn().mockResolvedValue(customData || defaultData),
      log: vi.fn().mockResolvedValue({ id: 'test-log' }),
      getSessionLogs: vi.fn().mockResolvedValue([]),
      getComponentLogs: vi.fn().mockResolvedValue([]),
      getPerformanceLogs: vi.fn().mockResolvedValue([]),
      clearOldLogs: vi.fn().mockResolvedValue(),
      exportLogs: vi.fn().mockResolvedValue([]),
      decryptPayload: vi.fn().mockResolvedValue({ decrypted: 'data' }),
      logRuleTriggered: vi.fn().mockResolvedValue({ id: 'rule-log' }),
      logSimulationRun: vi.fn().mockResolvedValue({ id: 'sim-log' }),
      logBudgetForecast: vi.fn().mockResolvedValue({ id: 'budget-log' }),
      logPortfolioAnalysis: vi.fn().mockResolvedValue({ id: 'portfolio-log' }),
      logError: vi.fn().mockResolvedValue({ id: 'error-log' })
    }
  };
};

/**
 * Create a mock for FeedbackUploader service
 */
export const createFeedbackUploaderMock = () => ({
  default: {
    uploadFeedback: vi.fn().mockResolvedValue({ success: true, id: 'upload-123' })
  }
});

/**
 * Create a mock for NotificationService
 */
export const createNotificationServiceMock = () => ({
  default: {
    showNotification: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn()
  }
});

// ============================================================================
// TEST SETUP UTILITIES: Common test lifecycle management
// ============================================================================

/**
 * Standard test setup with DOM polyfills and mock clearing
 */
export const setupTest = () => {
  setupDOMPolyfills();
  vi.clearAllMocks();
};

/**
 * Standard test teardown with cleanup
 */
export const teardownTest = () => {
  cleanupDOMPolyfills();
};

/**
 * Create spies for common DOM operations
 */
export const createDOMSpies = () => ({
  createObjectURL: vi.spyOn(global.URL, 'createObjectURL'),
  revokeObjectURL: vi.spyOn(global.URL, 'revokeObjectURL'),
  anchorClick: vi.spyOn(HTMLAnchorElement.prototype, 'click')
});

// ============================================================================
// ASSERTION HELPERS: Common test assertions
// ============================================================================

/**
 * Wait for async service call with timeout
 */
export const waitForServiceCall = async (serviceMethod, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const check = () => {
      if (serviceMethod.mock.calls.length > 0) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Service call timeout after ${timeout}ms`));
      } else {
        setTimeout(check, 10);
      }
    };
    const startTime = Date.now();
    check();
  });
};

/**
 * Verify DOM download operations were performed
 */
export const verifyDownloadOperations = (spies) => {
  expect(spies.createObjectURL).toHaveBeenCalled();
  expect(spies.anchorClick).toHaveBeenCalled();
  expect(spies.revokeObjectURL).toHaveBeenCalled();
};

// ============================================================================
// MOCK VERIFICATION: Ensure mocks are properly applied
// ============================================================================

/**
 * Verify that a service mock is properly applied
 */
export const verifyServiceMock = (service, methodName) => {
  return service[methodName].mock !== undefined;
};

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  // DOM utilities
  setupDOMPolyfills,
  cleanupDOMPolyfills,
  createDOMSpies,
  
  // Service mocks
  createExecutionLogServiceMock,
  createFeedbackUploaderMock,
  createNotificationServiceMock,
  
  // Test lifecycle
  setupTest,
  teardownTest,
  
  // Assertions
  waitForServiceCall,
  verifyDownloadOperations,
  verifyServiceMock
};

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  if (typeof globalThis.clearTimeout === 'function') {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  }
}); 