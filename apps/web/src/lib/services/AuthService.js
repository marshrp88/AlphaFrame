/**
 * AuthService.js - PHASE 1 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_2]:
 * This module is currently using localStorage-based authentication.
 * Will be upgraded to Firebase Auth in Phase 2 for production security.
 * 
 * Purpose: Provides working authentication service with secure session management
 * and role-based access control for the MVEP rebuild.
 * 
 * Current Status: Functional localStorage-based auth with proper security patterns
 */

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
 * Session storage keys
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'alphaframe_access_token',
  USER_PROFILE: 'alphaframe_user_profile',
  SESSION_EXPIRY: 'alphaframe_session_expiry',
  USER_ROLE: 'alphaframe_user_role'
};

/**
 * Current user session
 */
let currentUser = null;
let accessToken = null;
let userRole = 'TRIAL'; // Default role

/**
 * Generate a secure token
 * @returns {string} Secure token
 */
const generateSecureToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash password for security
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Initialize authentication
 * @returns {Promise<boolean>} True if initialization successful
 */
export const initializeAuth = async () => {
  try {
    // Load existing session
    await loadSession();
    
    // Check if session is still valid
    if (currentUser && accessToken) {
      const isValid = await validateSession();
      
      if (isValid) {
        console.log('Auth session restored successfully');
        return true;
      } else {
        // Session expired, clear it
        await clearSession();
      }
    }

    return true;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return false;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export const register = async (userData) => {
  try {
    const { email, password, name } = userData;
    
    // Validate input
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('alphaframe_users') || '[]');
    const existingUser = existingUsers.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      password: hashedPassword,
      role: 'TRIAL',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('alphaframe_users', JSON.stringify(existingUsers));
    
    // Auto-login after registration
    const loginResult = await login({ email, password });
    
    return {
      success: true,
      user: loginResult.user,
      message: 'Registration successful'
    };
    
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login result
 */
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Get users
    const users = JSON.parse(localStorage.getItem('alphaframe_users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Generate access token
    accessToken = generateSecureToken();
    
    // Update user profile
    currentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: new Date().toISOString()
    };
    
    userRole = user.role;
    
    // Update last login
    user.lastLogin = currentUser.lastLogin;
    localStorage.setItem('alphaframe_users', JSON.stringify(users));
    
    // Save session
    await saveSession();
    
    console.log('Login successful:', currentUser.email);
    
    return {
      success: true,
      user: currentUser,
      accessToken
    };
    
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout result
 */
export const logout = async () => {
  try {
    if (currentUser) {
      console.log('Logout successful:', currentUser.email);
    }

    // Clear session
    await clearSession();

    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return currentUser;
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return currentUser !== null && accessToken !== null;
};

/**
 * Get user permissions
 * @returns {Array} User permissions
 */
export const getUserPermissions = () => {
  if (!currentUser) return [];

  const roleConfig = USER_ROLES[userRole] || USER_ROLES.TRIAL;
  return roleConfig.permissions;
};

/**
 * Check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean} Permission status
 */
export const hasPermission = (permission) => {
  const permissions = getUserPermissions();
  return permissions.includes('*') || permissions.includes(permission);
};

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  return userRole;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} Role status
 */
export const hasRole = (role) => {
  return userRole === role;
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Update result
 */
export const updateProfile = async (updates) => {
  try {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    // Get users
    const users = JSON.parse(localStorage.getItem('alphaframe_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('alphaframe_users', JSON.stringify(users));
    
    // Update current user
    currentUser = { ...currentUser, ...updates };
    await saveSession();
    
    return {
      success: true,
      user: currentUser,
      message: 'Profile updated successfully'
    };
    
  } catch (error) {
    console.error('Profile update failed:', error);
    throw new Error(`Profile update failed: ${error.message}`);
  }
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

    return true;
  } catch {
    return false;
  }
};

/**
 * Save session to storage
 */
const saveSession = async () => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

/**
 * Load session from storage
 */
const loadSession = async () => {
  try {
    accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const storedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    
    if (userProfile) {
      currentUser = JSON.parse(userProfile);
    }
    
    if (storedRole) {
      userRole = storedRole;
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
};

/**
 * Clear session from storage
 */
export const clearSession = async () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    currentUser = null;
    accessToken = null;
    userRole = 'TRIAL';
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}; 