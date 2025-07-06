import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the AuthService mock
vi.mock('@/lib/services/AuthService', () => ({
  default: {
    isAuthenticated: vi.fn(() => true),
    getCurrentUser: vi.fn(() => ({
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    })),
    login: vi.fn(() => Promise.resolve(true)),
    logout: vi.fn(() => Promise.resolve(true))
  }
}));

import AuthService from '@/lib/services/AuthService';

describe('Basic Service Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mocked AuthService instead of real implementation', () => {
    const isAuth = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    
    expect(AuthService.isAuthenticated).toHaveBeenCalled();
    expect(AuthService.getCurrentUser).toHaveBeenCalled();
    expect(isAuth).toBe(true);
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
  });

  it('should mock async methods', async () => {
    const loginResult = await AuthService.login({ email: 'test@example.com', password: 'password' });
    const logoutResult = await AuthService.logout();
    
    expect(AuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(AuthService.logout).toHaveBeenCalled();
    expect(loginResult).toBe(true);
    expect(logoutResult).toBe(true);
  });
}); 