/**
 * Profile.jsx - Modern User Profile Management
 * 
 * Purpose: Provides users with a clean, intuitive profile page with
 * Auth0 integration and modern UI components.
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
 * - Modern UI components and design tokens
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import StyledButton from '../components/ui/StyledButton';
import CompositeCard from '../components/ui/CompositeCard';
import PageLayout from '../components/PageLayout';
import { useToast } from '../components/ui/use-toast.jsx';
import { 
  User, 
  Shield, 
  Settings, 
  RefreshCw, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Calendar,
  Key
} from 'lucide-react';
import './Profile.css';

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
  const { toast } = useToast();

  // Handle logout
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default"
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
        
        toast({
          title: "Token Refreshed",
          description: "Access token has been refreshed successfully.",
          variant: "default"
        });
      }
    } catch (error) {
      setTokenInfo({ error: error.message });
      toast({
        title: "Token Refresh Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRefreshingToken(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout>
        <motion.div 
          className="profile-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-container">
            <RefreshCw className="loading-spinner" />
            <h2>Loading Profile</h2>
            <p>Please wait while we load your profile information...</p>
          </div>
        </motion.div>
      </PageLayout>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <PageLayout>
        <motion.div 
          className="profile-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="error-container">
            <AlertCircle className="error-icon" />
            <h2>Not Authenticated</h2>
            <p>Please log in to view your profile.</p>
            <StyledButton onClick={() => window.location.href = '/'}>
              Go to Login
            </StyledButton>
          </div>
        </motion.div>
      </PageLayout>
    );
  }

  // Get user roles and permissions
  const userRoles = user['https://alphaframe.com/roles'] || [];
  const userPermissions = user['https://alphaframe.com/permissions'] || [];

  return (
    <PageLayout>
      <motion.div 
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>User Profile</h1>
          <p>Manage your account and view your information</p>
        </motion.div>

        {/* Profile Information */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CompositeCard>
            <div className="section-header">
              <User className="section-icon" />
              <h2>Profile Information</h2>
            </div>
            
            <div className="profile-grid">
              {/* User Avatar and Basic Info */}
              <div className="profile-avatar-section">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || user.email}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="profile-basic-info">
                  <h3>{user.name || 'No name provided'}</h3>
                  <p className="profile-email">{user.email}</p>
                  {user.email_verified && (
                    <span className="verification-badge">
                      <CheckCircle size={14} />
                      Email Verified
                    </span>
                  )}
                </div>
              </div>

              {/* User ID and Provider */}
              <div className="profile-details">
                <div className="detail-item">
                  <label>User ID</label>
                  <p className="detail-value">{user.sub}</p>
                </div>
                <div className="detail-item">
                  <label>Provider</label>
                  <p className="detail-value capitalize">
                    {user.sub.split('|')[0]}
                  </p>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Roles and Permissions */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="permissions-grid">
            {/* Roles */}
            <CompositeCard>
              <div className="section-header">
                <Shield className="section-icon" />
                <h3>Roles</h3>
              </div>
              {userRoles.length > 0 ? (
                <div className="tags-container">
                  {userRoles.map((role, index) => (
                    <span key={index} className="role-tag">
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No roles assigned</p>
              )}
            </CompositeCard>

            {/* Permissions */}
            <CompositeCard>
              <div className="section-header">
                <Settings className="section-icon" />
                <h3>Permissions</h3>
              </div>
              {userPermissions.length > 0 ? (
                <div className="tags-container">
                  {userPermissions.map((permission, index) => (
                    <span key={index} className="permission-tag">
                      {permission}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No permissions assigned</p>
              )}
            </CompositeCard>
          </div>
        </motion.div>

        {/* Session Information */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CompositeCard>
            <div className="section-header">
              <Key className="section-icon" />
              <h2>Session Information</h2>
            </div>
            
            <div className="session-actions">
              <StyledButton 
                onClick={handleRefreshToken}
                disabled={isRefreshingToken}
                variant="secondary"
              >
                <RefreshCw className={isRefreshingToken ? 'spinning' : ''} />
                {isRefreshingToken ? 'Refreshing...' : 'Refresh Token'}
              </StyledButton>
            </div>

            {tokenInfo && (
              <div className="token-info">
                {tokenInfo.error ? (
                  <div className="token-error">
                    <AlertCircle size={16} />
                    <span>Error: {tokenInfo.error}</span>
                  </div>
                ) : (
                  <div className="token-details">
                    <div className="token-item">
                      <label>Token (truncated)</label>
                      <p>{tokenInfo.token}</p>
                    </div>
                    <div className="token-item">
                      <label>Expires At</label>
                      <p>{tokenInfo.expiresAt}</p>
                    </div>
                    <div className="token-item">
                      <label>Issued At</label>
                      <p>{tokenInfo.issuedAt}</p>
                    </div>
                    <div className="token-item">
                      <label>Audience</label>
                      <p>{tokenInfo.audience}</p>
                    </div>
                    <div className="token-item">
                      <label>Issuer</label>
                      <p>{tokenInfo.issuer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CompositeCard>
        </motion.div>

        {/* Account Actions */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CompositeCard>
            <div className="section-header">
              <Settings className="section-icon" />
              <h2>Account Actions</h2>
            </div>
            
            <div className="account-actions">
              <StyledButton 
                onClick={handleLogout}
                variant="destructive"
                className="logout-button"
              >
                <LogOut size={16} />
                Logout
              </StyledButton>
            </div>
          </CompositeCard>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default Profile; 