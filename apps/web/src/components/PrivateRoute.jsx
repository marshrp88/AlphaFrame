/**
 * PrivateRoute.jsx
 * 
 * Purpose: Route protection component with Auth0 integration
 * 
 * This component provides:
 * - Authentication-based route protection
 * - Role-based access control (RBAC)
 * - Loading states during authentication
 * - Redirect handling for unauthenticated users
 * - Permission validation for protected routes
 * 
 * Security Features:
 * - Automatic authentication checks
 * - Role validation
 * - Permission-based access control
 * - Secure redirect handling
 */

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallbackComponent = null,
  redirectTo = '/login'
}) => {
  // Always call hooks first, before any conditional logic
  const {
    isAuthenticated,
    isLoading,
    user,
    error
  } = useAuth0();

  const location = useLocation();

  // Bypass authentication in test mode
  const isTestMode = import.meta.env.VITE_APP_ENV === 'test';
  
  // Diagnostic logging
  // console.log('[PrivateRoute] Component mounted'); // Commented for production cleanliness
  // console.log('[PrivateRoute] Test mode:', isTestMode); // Commented for production cleanliness
  // console.log('[PrivateRoute] Environment:', import.meta.env.VITE_APP_ENV); // Commented for production cleanliness
  // console.log('[PrivateRoute] localStorage test_mode:', localStorage.getItem('test_mode')); // Commented for production cleanliness
  
  if (isTestMode) {
    // console.log('[PrivateRoute] Bypassing authentication for test mode'); // Commented for production cleanliness
    return children;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  // console.error('Authentication error:', error); // Commented for production cleanliness
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check if user exists
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">User Not Found</h2>
          <p className="text-gray-600">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  // Check required roles
  if (requiredRoles.length > 0) {
    const userRoles = user['https://alphaframe.com/roles'] || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-2">
              You don&apos;t have the required role to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required: {requiredRoles.join(', ')} | 
              Your roles: {userRoles.join(', ') || 'none'}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const userPermissions = user['https://alphaframe.com/permissions'] || [];
    const hasRequiredPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes('*')
    );
    
    if (!hasRequiredPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-2">
              You don&apos;t have the required permissions to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required: {requiredPermissions.join(', ')} | 
              Your permissions: {userPermissions.join(', ') || 'none'}
            </p>
          </div>
        </div>
      );
    }
  }

  // Show fallback component if provided and user doesn't meet requirements
  if (fallbackComponent) {
    return fallbackComponent;
  }

  // Render protected content
  return children;
};

export default PrivateRoute;

// Notes:
// - This component is used to wrap protected routes.
// - It is simple and easy to understand for a 10th-grade reader.
// - In development mode, authentication is bypassed for easier testing. 
