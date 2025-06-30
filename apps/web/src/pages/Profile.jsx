/**
 * Profile.jsx - AlphaFrame VX.1 Consumer-Ready Profile Management
 * 
 * Purpose: Provides users with a clean, intuitive profile page with
 * Auth0 integration and modern design system components.
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
 * - Modern design system components
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import StyledButton from '../components/ui/StyledButton';
import CompositeCard from '../components/ui/CompositeCard';
import InputField from '../components/ui/InputField';
import StatusBadge from '../components/ui/StatusBadge';
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
  Key,
  Edit,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

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
  const [isEditing, setIsEditing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <CompositeCard>
            <div className="loading-container">
              <RefreshCw className="loading-spinner" />
              <h2>Loading Profile</h2>
              <p>Please wait while we load your profile information...</p>
            </div>
          </CompositeCard>
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
          <CompositeCard>
            <div className="error-container">
              <AlertCircle className="error-icon" />
              <h2>Not Authenticated</h2>
              <p>Please log in to view your profile.</p>
              <StyledButton onClick={() => navigate('/')}>
                Go to Login
              </StyledButton>
            </div>
          </CompositeCard>
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
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-subtitle">Manage your account and view your information</p>
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
              <h2 className="section-title">Profile Information</h2>
              <StyledButton
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="edit-button"
              >
                {isEditing ? <Save size={16} /> : <Edit size={16} />}
                {isEditing ? 'Save' : 'Edit'}
              </StyledButton>
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
                  <h3 className="profile-name">{user.name || 'No name provided'}</h3>
                  <p className="profile-email">{user.email}</p>
                  <div className="profile-status">
                    <StatusBadge variant="success" size="sm">
                      <CheckCircle size={12} />
                      Email Verified
                    </StatusBadge>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="profile-details">
                <div className="detail-row">
                  <label className="detail-label">Full Name</label>
                  {isEditing ? (
                    <InputField
                      type="text"
                      value={user.name || ''}
                      placeholder="Enter your full name"
                      size="md"
                    />
                  ) : (
                    <span className="detail-value">{user.name || 'Not provided'}</span>
                  )}
                </div>

                <div className="detail-row">
                  <label className="detail-label">Email Address</label>
                  <span className="detail-value">{user.email}</span>
                </div>

                <div className="detail-row">
                  <label className="detail-label">User ID</label>
                  <span className="detail-value user-id">{user.sub}</span>
                </div>

                <div className="detail-row">
                  <label className="detail-label">Account Type</label>
                  <StatusBadge variant="primary" size="sm">
                    {userRoles.includes('admin') ? 'Administrator' : 'Standard User'}
                  </StatusBadge>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Security & Session Information */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CompositeCard>
            <div className="section-header">
              <Shield className="section-icon" />
              <h2 className="section-title">Security & Session</h2>
            </div>
            
            <div className="security-grid">
              {/* Token Information */}
              <div className="token-section">
                <h3 className="subsection-title">Access Token</h3>
                <div className="token-info">
                  {tokenInfo ? (
                    <div className="token-details">
                      <div className="token-row">
                        <span className="token-label">Token:</span>
                        <div className="token-value-container">
                          <span className="token-value">
                            {showToken ? tokenInfo.token : '••••••••••••••••••••'}
                          </span>
                          <StyledButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowToken(!showToken)}
                            className="token-toggle"
                          >
                            {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                          </StyledButton>
                        </div>
                      </div>
                      <div className="token-row">
                        <span className="token-label">Expires:</span>
                        <span className="token-value">{tokenInfo.expiresAt}</span>
                      </div>
                      <div className="token-row">
                        <span className="token-label">Issued:</span>
                        <span className="token-value">{tokenInfo.issuedAt}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="no-token">No token information available</p>
                  )}
                  
                  <StyledButton
                    onClick={handleRefreshToken}
                    disabled={isRefreshingToken}
                    className="refresh-token-button"
                  >
                    <RefreshCw className={`refresh-icon ${isRefreshingToken ? 'spinning' : ''}`} />
                    {isRefreshingToken ? 'Refreshing...' : 'Refresh Token'}
                  </StyledButton>
                </div>
              </div>

              {/* Session Information */}
              <div className="session-section">
                <h3 className="subsection-title">Session Information</h3>
                <div className="session-info">
                  <div className="session-row">
                    <span className="session-label">Login Time:</span>
                    <span className="session-value">
                      {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'Unknown'}
                    </span>
                  </div>
                  <div className="session-row">
                    <span className="session-label">Provider:</span>
                    <span className="session-value">{user.sub?.split('|')[0] || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Roles & Permissions */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CompositeCard>
            <div className="section-header">
              <Settings className="section-icon" />
              <h2 className="section-title">Roles & Permissions</h2>
            </div>
            
            <div className="permissions-grid">
              {/* Roles */}
              <div className="roles-section">
                <h3 className="subsection-title">User Roles</h3>
                <div className="roles-list">
                  {userRoles.length > 0 ? (
                    userRoles.map((role, index) => (
                      <StatusBadge key={index} variant="primary" size="sm">
                        {role}
                      </StatusBadge>
                    ))
                  ) : (
                    <p className="no-roles">No roles assigned</p>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="permissions-section">
                <h3 className="subsection-title">Permissions</h3>
                <div className="permissions-list">
                  {userPermissions.length > 0 ? (
                    userPermissions.map((permission, index) => (
                      <StatusBadge key={index} variant="secondary" size="sm">
                        {permission}
                      </StatusBadge>
                    ))
                  ) : (
                    <p className="no-permissions">No permissions assigned</p>
                  )}
                </div>
              </div>
            </div>
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
              <Key className="section-icon" />
              <h2 className="section-title">Account Actions</h2>
            </div>
            
            <div className="actions-grid">
              <StyledButton
                variant="secondary"
                onClick={() => window.open('https://auth0.com', '_blank')}
              >
                Manage Account
              </StyledButton>
              
              <StyledButton
                variant="destructive"
                onClick={handleLogout}
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