/**
 * AuthStore service for managing authentication state
 */

export const useAuthStore = jest.fn(() => ({
  getState: () => ({
    user: {
      id: 1,
      name: 'Test User',
      permissions: ['read:financial_data']
    },
    isAuthenticated: true
  })
}));

export default { useAuthStore }; 