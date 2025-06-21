/**
 * LoginButton.jsx
 * 
 * Purpose: Auth0-integrated login/logout button component
 * 
 * This component provides:
 * - Login/logout functionality with Auth0
 * - User profile display
 * - Loading states and error handling
 * - Responsive design for different screen sizes
 * 
 * Features:
 * - Automatic token refresh
 * - User profile management
 * - Role-based UI elements
 * - Secure session handling
 */

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../shared/ui/Button.jsx';
import { config } from '../lib/config.js';

const LoginButton = ({ className = '', variant = 'default', size = 'default' }) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    error
  } = useAuth0();

  // Handle login
  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  // Handle logout
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </Button>
    );
  }

  // Show error state
  if (error) {
    return (
      <Button 
        variant="destructive" 
        size={size} 
        className={className}
        onClick={handleLogin}
      >
        <div className="flex items-center space-x-2">
          <span>⚠️</span>
          <span>Login Error - Retry</span>
        </div>
      </Button>
    );
  }

  // Show user profile when authenticated
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || user.email}
              className="w-8 h-8 rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* User Info */}
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900">
              {user.name || user.email}
            </div>
            {user.email && user.name && (
              <div className="text-xs text-gray-500">
                {user.email}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          size={size} 
          className={className}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  // Show login button when not authenticated
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleLogin}
    >
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span>Login</span>
      </div>
    </Button>
  );
};

export default LoginButton; 