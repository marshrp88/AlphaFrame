/**
 * AuthService.js - PHASE 3 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_4]:
 * This module is now using Firebase Auth for production security.
 * Will be enhanced with real-time sync and advanced features in Phase 4.
 * 
 * Purpose: Provides Firebase Auth integration with secure session management
 * and role-based access control for the MVEP rebuild.
 * 
 * Current Status: Firebase Auth integration with proper security patterns
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/init.js';

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
let userRole = 'TRIAL'; // Default role

/**
 * Initialize authentication
 * @returns {Promise<boolean>} True if initialization successful
 */
export const initializeAuth = async () => {
  try {
    // Set up auth state listener
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        currentUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime
        };

        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userRole = userData.role || 'TRIAL';
            currentUser = { ...currentUser, ...userData };
          }
        } catch (error) {
          console.error('Failed to get user data:', error);
          userRole = 'TRIAL';
        }
      } else {
        // User is signed out
        currentUser = null;
        userRole = 'TRIAL';
      }
    });

    console.log('Firebase Auth initialized successfully');
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
    
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateFirebaseProfile(user, { displayName: name });
    
    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      email: user.email,
      name: name,
      role: 'TRIAL',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: false
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Update current user
    currentUser = userDoc;
    userRole = 'TRIAL';
    
    console.log('Registration successful:', user.email);
    
    return {
      success: true,
      user: currentUser,
      message: 'Registration successful. Please check your email for verification.'
    };
    
  } catch (error) {
    console.error('Registration failed:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please choose a stronger password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
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
    
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData = {};
    
    if (userDoc.exists()) {
      userData = userDoc.data();
      userRole = userData.role || 'TRIAL';
    }
    
    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString()
    });
    
    // Update current user
    currentUser = {
      id: user.uid,
      email: user.email,
      name: user.displayName || userData.name || user.email,
      role: userRole,
      createdAt: userData.createdAt || user.metadata.creationTime,
      lastLogin: new Date().toISOString(),
      emailVerified: user.emailVerified
    };
    
    console.log('Login successful:', currentUser.email);
    
    return {
      success: true,
      user: currentUser
    };
    
  } catch (error) {
    console.error('Login failed:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later');
    }
    
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

    // Sign out from Firebase Auth
    await signOut(auth);
    
    // Clear current user
    currentUser = null;
    userRole = 'TRIAL';

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
  return currentUser !== null;
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
export const updateUserProfile = async (updates) => {
  try {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    // Update Firebase Auth profile
    if (updates.name) {
      await updateFirebaseProfile(user, { displayName: updates.name });
    }
    
    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    // Update current user
    currentUser = { ...currentUser, ...updates };
    
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
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset result
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent successfully'
    };
  } catch (error) {
    console.error('Password reset failed:', error);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

/**
 * Validate current session
 * @returns {Promise<boolean>} True if session is valid
 */
export const validateSession = async () => {
  try {
    const user = auth.currentUser;
    return user !== null;
  } catch {
    return false;
  }
};

/**
 * Clear current session
 * @returns {Promise<boolean>} Success status
 */
export const clearSession = async () => {
  try {
    await signOut(auth);
    currentUser = null;
    userRole = 'TRIAL';
    return true;
  } catch (error) {
    console.error('Failed to clear session:', error);
    return false;
  }
}; 