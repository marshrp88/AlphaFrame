/**
 * AuthStore.js - PHASE 1 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_2]:
 * This module is currently using localStorage-based authentication.
 * Will be upgraded to Firebase Auth in Phase 2 for production security.
 * 
 * Purpose: Provides Zustand store for authentication state management
 * with working localStorage-based authentication and user session handling.
 * 
 * Current Status: Functional authentication state management
 */

import { create } from 'zustand';
import { 
  initializeAuth, 
  login as authLogin, 
  logout as authLogout,
  register as authRegister,
  getCurrentUser, 
  isAuthenticated as checkAuth,
  getUserPermissions,
  hasPermission,
  updateProfile as authUpdateProfile
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
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authRegister(userData);
      
      // Update state after successful registration
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
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authLogin(credentials);
      
      // Update state after successful login
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
      
      // Clear state after logout
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
  
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authUpdateProfile(updates);
      
      // Update state after successful profile update
      const user = getCurrentUser();
      const permissions = getUserPermissions();
      
      set({
        user,
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
  
  checkAuth: async () => {
    try {
      const user = getCurrentUser();
      const authenticated = checkAuth();
      const permissions = getUserPermissions();
      
      set({
        user,
        isAuthenticated: authenticated,
        permissions
      });
      
      return authenticated;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
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
