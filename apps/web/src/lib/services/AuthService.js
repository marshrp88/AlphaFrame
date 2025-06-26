/**
 * AuthService.js - AlphaFrame VX.1
 * 
 * Purpose: Real authentication service with Auth0 integration,
 * secure session management, and role-based access control.
 * 
 * Procedure:
 * 1. Initialize Auth0 client with environment configuration
 * 2. Handle OAuth login/logout flows
 * 3. Manage secure session storage and refresh tokens
 * 4. Validate user permissions and roles
 * 5. Provide user profile management
 * 
 * Conclusion: Provides enterprise-grade authentication
 * with comprehensive security and user management.
 */

import { config } from '../config.js';
import executionLogService from '../../core/services/ExecutionLogService.js';

/**
 * Auth0 configuration
 */
const AUTH0_CONFIG = {
  domain: config.auth0.domain || config.auth.domain,
  clientId: config.auth0.clientId || config.auth.clientId,
  audience: config.auth0.audience || config.auth.audience,
  redirectUri: config.auth0.redirectUri || window.location.origin,
  responseType: 'code',
  scope: 'openid profile email read:financial_data write:financial_data'
};

/**
 * Session storage keys
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'alphaframe_access_token',
  REFRESH_TOKEN: 'alphaframe_refresh_token',
  USER_PROFILE: 'alphaframe_user_profile',
  SESSION_EXPIRY: 'alphaframe_session_expiry'
};

/**
 * User roles and permissions
 */
const USER_ROLES = {
  ADMIN: {
    permissions: ['*'],
    description: 'Full system access'
  },
  PREMIUM: {
    permissions: [
      'read:financial_data',
      'write:financial_data',
      'execute:rules',
      'manage:budgets',
      'view:reports',
      'send:notifications'
    ],
    description: 'Premium user with full financial features'
  },
  BASIC: {
    permissions: [
      'read:financial_data',
      'execute:rules',
      'manage:budgets',
      'view:reports'
    ],
    description: 'Basic user with core features'
  },
  TRIAL: {
    permissions: [
      'read:financial_data',
      'execute:rules',
      'view:reports'
    ],
    description: 'Trial user with limited features'
  }
};

/**
 * Current user session
 */
let currentUser = null;
let accessToken = null;
let refreshToken = null;

/**
 * Initialize Auth0 authentication
 * @returns {Promise<boolean>} True if initialization successful
 */
export const initializeAuth = async () => {
  try {
    // Check if Auth0 is configured
    if (!AUTH0_CONFIG.domain || !AUTH0_CONFIG.clientId) {
      return false;
    }

    // Load existing session
    await loadSession();
    
    // Check if session is still valid
    if (currentUser && accessToken) {
      const isValid = await validateSession();
      
      if (isValid) {
        await executionLogService.log('auth.session.restored', {
          userId: currentUser.sub,
          email: currentUser.email
        });
        return true;
      } else {
        // Session expired, try to refresh
        await refreshSession();
      }
    }

    return true;
  } catch (error) {
    await executionLogService.logError('auth.initialization.failed', error);
    return false;
  }
};

/**
 * Login user with Auth0
 * @param {Object} options - Login options
 * @returns {Promise<Object>} Login result
 */
export const login = async (options = {}) => {
  try {
    // Build Auth0 authorization URL
    const authUrl = new URL(`https://${AUTH0_CONFIG.domain}/authorize`);
    authUrl.searchParams.set('client_id', AUTH0_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', AUTH0_CONFIG.redirectUri);
    authUrl.searchParams.set('response_type', AUTH0_CONFIG.responseType);
    authUrl.searchParams.set('scope', AUTH0_CONFIG.scope);
    authUrl.searchParams.set('state', generateState());
    
    if (AUTH0_CONFIG.audience) {
      authUrl.searchParams.set('audience', AUTH0_CONFIG.audience);
    }

    // Store login options for callback
    sessionStorage.setItem('auth_login_options', JSON.stringify(options));

    // Redirect to Auth0
    window.location.href = authUrl.toString();

    return { success: true, redirecting: true };
  } catch (error) {
    await executionLogService.logError('auth.login.failed', error);
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Handle Auth0 callback
 * @param {string} code - Authorization code
 * @param {string} state - State parameter
 * @returns {Promise<Object>} Authentication result
 */
export const handleCallback = async (code, state) => {
  try {
    // Validate state parameter
    if (!validateState(state)) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${AUTH0_CONFIG.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: AUTH0_CONFIG.clientId,
        code_verifier: sessionStorage.getItem('code_verifier'),
        code,
        redirect_uri: AUTH0_CONFIG.redirectUri
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    
    // Store tokens
    accessToken = tokenData.access_token;
    refreshToken = tokenData.refresh_token;
    
    // Get user profile
    const userProfile = await getUserProfile(accessToken);
    currentUser = userProfile;

    // Save session
    await saveSession();

    // Log successful login
    await executionLogService.log('auth.login.success', {
      userId: currentUser.sub,
      email: currentUser.email,
      provider: currentUser.sub.split('|')[0]
    });

    return {
      success: true,
      user: currentUser,
      accessToken
    };

  } catch (error) {
    await executionLogService.logError('auth.callback.failed', error);
    throw new Error(`Authentication callback failed: ${error.message}`);
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout result
 */
export const logout = async () => {
  try {
    if (currentUser) {
      await executionLogService.log('auth.logout', {
        userId: currentUser.sub,
        email: currentUser.email
      });
    }

    // Clear session
    await clearSession();

    // Redirect to Auth0 logout
    const logoutUrl = new URL(`https://${AUTH0_CONFIG.domain}/v2/logout`);
    logoutUrl.searchParams.set('client_id', AUTH0_CONFIG.clientId);
    logoutUrl.searchParams.set('returnTo', window.location.origin);
    
    window.location.href = logoutUrl.toString();

    return { success: true, redirecting: true };
  } catch (error) {
    await executionLogService.logError('auth.logout.failed', error);
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Get current user
 * @returns {Object|null} Current user object
 */
export const getCurrentUser = () => {
  return currentUser;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return currentUser !== null && accessToken !== null;
};

/**
 * Get user permissions
 * @returns {Array} Array of user permissions
 */
export const getUserPermissions = () => {
  if (!currentUser) return [];

  // Get user role from Auth0 metadata or default to BASIC
  const userRole = currentUser['https://alphaframe.com/roles'] || 'BASIC';
  const roleConfig = USER_ROLES[userRole] || USER_ROLES.BASIC;

  return roleConfig.permissions;
};

/**
 * Check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes('*') || permissions.includes(permission);
};

/**
 * Get user profile from Auth0
 * @param {string} token - Access token
 * @returns {Promise<Object>} User profile
 */
const getUserProfile = async (token) => {
  const response = await fetch(`https://${AUTH0_CONFIG.domain}/userinfo`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }

  return response.json();
};

/**
 * Validate current session
 * @returns {Promise<boolean>} True if session is valid
 */
const validateSession = async () => {
  try {
    if (!accessToken) return false;

    // Check if token is expired
    const expiry = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
    if (expiry && Date.now() > parseInt(expiry)) {
      return false;
    }

    // Validate token with Auth0
    const response = await fetch(`https://${AUTH0_CONFIG.domain}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Refresh access token
 * @returns {Promise<boolean>} True if refresh successful
 */
const refreshSession = async () => {
  try {
    if (!refreshToken) return false;

    const response = await fetch(`https://${AUTH0_CONFIG.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: AUTH0_CONFIG.clientId,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) return false;

    const tokenData = await response.json();
    accessToken = tokenData.access_token;
    
    if (tokenData.refresh_token) {
      refreshToken = tokenData.refresh_token;
    }

    await saveSession();
    return true;
  } catch (error) {
    await executionLogService.logError('auth.session.refresh.failed', error);
    return false;
  }
};

/**
 * Save session to storage
 */
const saveSession = async () => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, (Date.now() + 3600000).toString()); // 1 hour
  } catch (error) {
    await executionLogService.logError('auth.session.save.failed', error);
  }
};

/**
 * Load session from storage
 */
const loadSession = async () => {
  try {
    accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    const userProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (userProfile) {
      currentUser = JSON.parse(userProfile);
    }
  } catch (error) {
    await executionLogService.logError('auth.session.load.failed', error);
  }
};

/**
 * Clear session from storage
 */
export const clearSession = async () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    currentUser = null;
    accessToken = null;
    refreshToken = null;
  } catch (error) {
    await executionLogService.logError('auth.session.clear.failed', error);
  }
};

/**
 * Generate state parameter for OAuth
 * @returns {string} State parameter
 */
const generateState = () => {
  const state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('auth_state', state);
  return state;
};

/**
 * Validate state parameter
 * @param {string} state - State parameter to validate
 * @returns {boolean} True if valid
 */
const validateState = (state) => {
  const storedState = sessionStorage.getItem('auth_state');
  sessionStorage.removeItem('auth_state');
  return state === storedState;
};

/**
 * Get access token for API calls
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
  return accessToken;
}; 