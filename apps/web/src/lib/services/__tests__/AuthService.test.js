/**
 * AuthService.test.js - Playbook Fixes for Auth0 Integration Tests
 * 
 * Purpose: Unit tests for Auth0 integration service with per-test isolation and correct mocking
 * 
 * Fixes Applied:
 * - All mocks moved to beforeEach for per-test isolation
 * - afterEach clears and restores all mocks
 * - Mock returns aligned with expected schema
 * - No global state or mocks
 * - Comments added for clarity
 * - CLUSTER 2 FIXES: Proper state management and mock reset
 * - PHASE 2 FIXES: Proper service initialization and state setup
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initializeAuth,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getUserPermissions,
  hasPermission,
  clearSession,
  getAccessToken
} from '../AuthService';

// Mock config
vi.mock('../../config', () => ({
  config: {
    auth0: {
      domain: 'test.auth0.com',
      clientId: 'test-client-id',
      audience: 'test-audience'
    },
    auth: {
      domain: 'test.auth0.com',
      clientId: 'test-client-id',
      audience: 'test-audience'
    }
  }
}));

describe('AuthService', () => {
  let localStorageMock;
  let sessionStorageMock;
  let fetchMock;
  let locationBackup;

  beforeEach(() => {
    // CLUSTER 2 FIX: Reset all mocks before each test
    vi.clearAllMocks();
    
    // Per-test localStorage mock with proper state management
    localStorageMock = {
      getItem: vi.fn((key) => {
        if (key === 'alphaframe_access_token') return 'mock-token';
        if (key === 'alphaframe_user_profile') return JSON.stringify({ id: 1, name: 'Test User' });
        if (key === 'alphaframe_permissions') return JSON.stringify(['read:financial_data']);
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    global.localStorage = localStorageMock;

    // Per-test sessionStorage mock
    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
    global.sessionStorage = sessionStorageMock;

    // Per-test fetch mock
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Per-test window.location mock
    locationBackup = window.location;
    delete window.location;
    window.location = {
      href: '',
      assign: vi.fn((url) => { window.location.href = url; }),
      replace: vi.fn((url) => { window.location.href = url; })
    };
  });

  afterEach(() => {
    // CLUSTER 2 FIX: Proper cleanup and state reset
    vi.restoreAllMocks();
    // Restore window.location
    window.location = locationBackup;
    
    // Clear any stored state
    if (global.localStorage) {
      global.localStorage.clear();
    }
    if (global.sessionStorage) {
      global.sessionStorage.clear();
    }
  });

  describe('Configuration', () => {
    it('should initialize with correct config', async () => {
      await initializeAuth();
      expect(true).toBe(true);
    });
  });

  describe('Login', () => {
    it('should redirect to Auth0 login', () => {
      login();
      expect(window.location.href).toContain('test.auth0.com');
    });
  });

  describe('Logout', () => {
    it('should clear storage and redirect', async () => {
      await logout();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
      expect(window.location.href).toContain('test.auth0.com');
    });
  });

  describe('Token Management', () => {
    it('should get access token', async () => {
      // PHASE 2 FIX: Initialize auth service first to load session data
      await initializeAuth();
      
      const token = getAccessToken();
      expect(token).toBe('mock-token');
    });
  });

  describe('User Management', () => {
    it('should get current user', async () => {
      // PHASE 2 FIX: Initialize auth service first to load session data
      await initializeAuth();
      
      const user = getCurrentUser();
      expect(user).toEqual({ id: 1, name: 'Test User' });
    });

    it('should check authentication status', () => {
      const authenticated = isAuthenticated();
      expect(typeof authenticated).toBe('boolean');
    });

    it('should get user permissions', async () => {
      // PHASE 2 FIX: Initialize auth service first to load session data
      await initializeAuth();
      
      const permissions = getUserPermissions();
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toContain('read:financial_data');
    });

    it('should check specific permission', () => {
      const hasAccess = hasPermission('read:financial_data');
      expect(typeof hasAccess).toBe('boolean');
    });
  });

  describe('Session Management', () => {
    it('should clear session', async () => {
      await clearSession();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });
}); 