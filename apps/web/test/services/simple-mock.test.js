import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test with a simple mock
vi.mock('@/lib/services/AuthService', () => ({
  default: {
    isAuthenticated: vi.fn(() => true),
    getCurrentUser: vi.fn(() => ({ id: 1, email: 'test@example.com' })),
    login: vi.fn(() => Promise.resolve(true)),
    logout: vi.fn(() => Promise.resolve(true))
  }
}));

import AuthService from '@/lib/services/AuthService';

describe('Simple Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use manually injected mock', () => {
    const isAuth = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
    expect(AuthService.getCurrentUser).toHaveBeenCalled();
    expect(isAuth).toBe(true);
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });

  it('should mock async methods', async () => {
    const loginResult = await AuthService.login();
    const logoutResult = await AuthService.logout();
    
    expect(AuthService.login).toHaveBeenCalled();
    expect(AuthService.logout).toHaveBeenCalled();
    expect(loginResult).toBe(true);
    expect(logoutResult).toBe(true);
  });
}); 