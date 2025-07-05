import { vi } from 'vitest';

const AuthService = {
  initializeAuth: vi.fn().mockResolvedValue(true),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
  getCurrentUser: vi.fn().mockReturnValue({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    sub: 'auth0|123',
    'https://alphaframe.com/roles': 'BASIC'
  }),
  isAuthenticated: vi.fn().mockReturnValue(true),
  getUserPermissions: vi.fn().mockReturnValue(['read:financial_data']),
  hasPermission: vi.fn().mockReturnValue(true),
  clearSession: vi.fn().mockResolvedValue(true),
  login: vi.fn().mockResolvedValue(true),
  logout: vi.fn().mockResolvedValue(true),
  getUser: vi.fn().mockReturnValue({
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  })
};

// Make all methods spyable
Object.keys(AuthService).forEach(key => {
  if (typeof AuthService[key] === 'function') {
    AuthService[key] = vi.fn(AuthService[key]);
  }
});

export default AuthService;
export { AuthService }; 