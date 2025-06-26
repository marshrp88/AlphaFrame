/**
 * Profile.jsx
 * 
 * Purpose: User profile page with Auth0 integration
 * 
 * This component provides:
 * - User profile display and management
 * - Role and permission information
 * - Account settings and preferences
 * - Session management
 * - Security settings display
 * 
 * Features:
 * - Real-time user data from Auth0
 * - Role-based UI elements
 * - Account management tools
 * - Session information display
 */

import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../shared/ui/Button.jsx';
import { Card } from '../shared/ui/Card.jsx';
import { config } from '../lib/config.js';

const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);

  // Handle logout
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  // Get fresh access token
  const handleRefreshToken = async () => {
    try {
      setIsRefreshingToken(true);
      const token = await getAccessTokenSilently();
      
      // Decode token to show information (JWT tokens are base64 encoded)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setTokenInfo({
          token: token.substring(0, 20) + '...',
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
          issuedAt: new Date(payload.iat * 1000).toLocaleString(),
          audience: payload.aud,
          issuer: payload.iss
        });
      }
    } catch (error) {
      setTokenInfo({ error: error.message });
    } finally {
      setIsRefreshingToken(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Not Authenticated</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Get user roles and permissions
  const userRoles = user['https://alphaframe.com/roles'] || [];
  const userPermissions = user['https://alphaframe.com/permissions'] || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account and view your information</p>
        </div>

        {/* Profile Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center space-x-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || user.email}
                  className="w-16 h-16 rounded-full border-4 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name || 'No name provided'}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                {user.email_verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Email Verified
                  </span>
                )}
              </div>
            </div>

            {/* User ID and Provider */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500" htmlFor="userId">User ID</label>
                <p className="text-sm text-gray-900 font-mono" id="userId">{user.sub}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500" htmlFor="provider">Provider</label>
                <p className="text-sm text-gray-900 capitalize" id="provider">
                  {user.sub.split('|')[0]}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Roles and Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Roles</h3>
            {userRoles.length > 0 ? (
              <div className="space-y-2">
                {userRoles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No roles assigned</p>
            )}
          </Card>

          {/* Permissions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Permissions</h3>
            {userPermissions.length > 0 ? (
              <div className="space-y-2">
                {userPermissions.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2 mb-2"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No permissions assigned</p>
            )}
          </Card>
        </div>

        {/* Session Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Session Information</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshToken}
              disabled={isRefreshingToken}
            >
              {isRefreshingToken ? 'Refreshing...' : 'Refresh Token'}
            </Button>
          </div>
          
          {tokenInfo ? (
            <div className="space-y-3">
              {tokenInfo.error ? (
                <p className="text-red-600 text-sm">{tokenInfo.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-gray-500" htmlFor="token">Token (truncated)</label>
                      <p className="font-mono text-gray-900" id="token">{tokenInfo.token}</p>
                    </div>
                    <div>
                      <label className="text-gray-500" htmlFor="expiresAt">Expires At</label>
                      <p className="text-gray-900" id="expiresAt">{tokenInfo.expiresAt}</p>
                    </div>
                    <div>
                      <label className="text-gray-500" htmlFor="issuedAt">Issued At</label>
                      <p className="text-gray-900" id="issuedAt">{tokenInfo.issuedAt}</p>
                    </div>
                    <div>
                      <label className="text-gray-500" htmlFor="audience">Audience</label>
                      <p className="text-gray-900" id="audience">{tokenInfo.audience}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Click &quot;Refresh Token&quot; to view current session information
            </p>
          )}
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('https://auth0.com/dashboard', '_blank')}
            >
              Manage Account
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Environment Information */}
        {config.env === 'development' && (
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">Development Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Environment:</strong> {config.env}</p>
              <p><strong>Auth0 Domain:</strong> {config.auth0.domain || '&quot;Not configured&quot;'}</p>
              <p><strong>Client ID:</strong> {config.auth0.clientId ? '&quot;Configured&quot;' : '&quot;Not configured&quot;'}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile; 