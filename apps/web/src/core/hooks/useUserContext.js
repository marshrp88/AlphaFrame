// useUserContext.js
// Provides a userContext object for dashboard and app components
// Wraps useAuthStore to expose user info and preferences in a consistent shape

import { useAuthStore } from '../store/authStore';

/**
 * useUserContext - Returns a userContext object for dashboard and app components
 * This is a compatibility shim for components expecting userContext from a context hook.
 *
 * Returns:
 *   { userContext: { user, isAuthenticated, preferences, permissions, ... } }
 */
export function useUserContext() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const permissions = useAuthStore((state) => state.permissions);
  // You can expand this with more user fields as needed
  // For now, preferences is a placeholder (could be extended)
  const preferences = user?.preferences || {};

  return {
    userContext: {
      user,
      isAuthenticated,
      permissions,
      preferences,
    },
  };
}

// This hook is a drop-in replacement for legacy or context-based user logic.
// If you add more user fields to authStore, add them here for dashboard compatibility. 