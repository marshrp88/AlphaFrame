/**
 * AuthStore.js - AlphaFrame VX.1
 * 
 * Purpose: Zustand store for authentication state management
 * with real Auth0 integration and user session handling.
 * 
 * Procedure:
 * 1. Initialize authentication state from AuthService
 * 2. Provide login/logout actions with proper state updates
 * 3. Handle authentication state changes and user profile
 * 4. Manage loading states and error handling
 * 5. Expose authentication status to components
 * 
 * Conclusion: Provides centralized authentication state
 * with real Auth0 integration and comprehensive user management.
 */

import { create } from 'zustand';
import { 
  initializeAuth, 
  login as authLogin, 
  logout as authLogout, 
  getCurrentUser, 
  isAuthenticated as checkAuth,
  getUserPermissions,
  hasPermission
} from '../../lib/services/AuthService.js';

/**
 * Authentication store state and actions
 */
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  permissions: [],
  
  // Actions
  initialize: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await initializeAuth();
      const user = getCurrentUser();
      const authenticated = checkAuth();
      const permissions = getUserPermissions();
      
      set({
        user,
        isAuthenticated: authenticated,
        permissions,
        isLoading: false
      });
      
      return success;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      return false;
    }
  },
  
  login: async (options = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authLogin(options);
      
      if (result.redirecting) {
        // Auth0 will handle the redirect
        set({ isLoading: false });
        return result;
      }
      
      // If not redirecting, update state
      const user = getCurrentUser();
      const authenticated = checkAuth();
      const permissions = getUserPermissions();
      
      set({
        user,
        isAuthenticated: authenticated,
        permissions,
        isLoading: false
      });
      
      return result;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authLogout();
      
      // Clear state
      set({
        user: null,
        isAuthenticated: false,
        permissions: [],
        isLoading: false
      });
      
      return result;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },
  
  checkAuth: () => {
    const user = getCurrentUser();
    const authenticated = checkAuth();
    const permissions = getUserPermissions();
    
    set({
      user,
      isAuthenticated: authenticated,
      permissions
    });
    
    return authenticated;
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  // Computed values
  hasPermission: (permission) => {
    return hasPermission(permission);
  },
  
  isAdmin: () => {
    const { permissions } = get();
    return permissions.includes('*');
  },
  
  isPremium: () => {
    const { permissions } = get();
    return permissions.includes('send:notifications');
  }
})); 
