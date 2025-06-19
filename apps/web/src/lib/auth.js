import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

/**
 * useAuth hook
 * Provides the user's authentication status and tier ('free' or 'pro').
 * This hook can be used in components to protect routes or show/hide features.
 */
export function useAuth() {
  // Get auth state from the store
  const { isAuthenticated, user } = useAuthStore();
  // Default to 'free' tier if not specified
  const tier = user?.tier || 'free';
  return { isAuthenticated, tier, user };
}

// Notes:
// - This hook is used for route protection and feature gating.
// - It is simple and easy to understand for a 10th-grade reader. 
