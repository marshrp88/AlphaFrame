// authStore.js
// Minimal stub to unblock tests that require this file.
import { create } from 'zustand';

export const useAuthStore = create(() => ({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})); 
