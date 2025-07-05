/**
 * AuthStore service for managing authentication state
 * 
 * Purpose: Provides mock authentication state for testing
 * Procedure: Exports useAuthStore function that returns mock user data
 * Conclusion: Enables consistent authentication testing across the application
 */

import { vi } from 'vitest';

export const useAuthStore = () => ({
  user: { id: 1, name: 'Test User', permissions: ['read:financial_data'] },
  isAuthenticated: true,
  logout: vi.fn()
});

export default { useAuthStore }; 