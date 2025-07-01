/**
 * StorageService.js - Enhanced localStorage Management
 * 
 * Purpose: Provides robust, type-safe localStorage management with
 * error handling, data validation, and automatic cleanup for AlphaFrame.
 * 
 * Procedure:
 * 1. Centralized storage management with consistent key naming
 * 2. Type-safe data serialization/deserialization
 * 3. Error handling for storage failures
 * 4. Automatic data validation and cleanup
 * 5. User-specific storage isolation
 * 
 * Conclusion: Ensures reliable data persistence across user sessions
 * with proper error handling and data integrity.
 */

/**
 * Storage keys for AlphaFrame
 */
const STORAGE_KEYS = {
  ONBOARDING_STATE: 'alphaframe_onboarding_state',
  USER_RULES: 'alphaframe_user_rules',
  USER_TRANSACTIONS: 'alphaframe_user_transactions',
  DASHBOARD_MODE: 'alphaframe_dashboard_mode',
  THEME_PREFERENCE: 'alphaframe-theme',
  PL AID_CONNECTION: 'plaid_connection',
  TEST_MODE: 'test_mode',
  USER_PREFERENCES: 'alphaframe_user_preferences',
  SESSION_DATA: 'alphaframe_session_data'
};

/**
 * Storage validation schemas
 */
const VALIDATION_SCHEMAS = {
  onboardingState: (data) => {
    return data && 
           typeof data === 'object' &&
           typeof data.userId === 'string' &&
           typeof data.completed === 'boolean' &&
           typeof data.currentStep === 'number';
  },
  
  userRules: (data) => {
    return Array.isArray(data) && 
           data.every(rule => 
             rule && 
             typeof rule === 'object' && 
             typeof rule.id === 'string' &&
             typeof rule.name === 'string'
           );
  },
  
  userPreferences: (data) => {
    return data && 
           typeof data === 'object' &&
           typeof data.theme === 'string' &&
           typeof data.notifications === 'boolean';
  }
};

/**
 * Storage Service Class
 */
class StorageService {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
    this.userId = null;
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} Storage availability
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }

  /**
   * Set current user ID for storage isolation
   * @param {string} userId - User identifier
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Generate user-specific storage key
   * @param {string} key - Base storage key
   * @returns {string} User-specific key
   */
  getUserKey(key) {
    return this.userId ? `${key}_${this.userId}` : key;
  }

  /**
   * Safely set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {Function} validator - Optional validation function
   * @returns {boolean} Success status
   */
  setItem(key, value, validator = null) {
    if (!this.isAvailable) {
      console.warn('Storage not available, cannot save:', key);
      return false;
    }

    try {
      // Validate data if validator provided
      if (validator && !validator(value)) {
        console.warn('Data validation failed for key:', key);
        return false;
      }

      const userKey = this.getUserKey(key);
      const serializedValue = JSON.stringify({
        value,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });

      localStorage.setItem(userKey, serializedValue);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Safely get item from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @param {Function} validator - Optional validation function
   * @returns {any} Retrieved value or default
   */
  getItem(key, defaultValue = null, validator = null) {
    if (!this.isAvailable) {
      console.warn('Storage not available, cannot retrieve:', key);
      return defaultValue;
    }

    try {
      const userKey = this.getUserKey(key);
      const stored = localStorage.getItem(userKey);
      
      if (!stored) {
        return defaultValue;
      }

      const parsed = JSON.parse(stored);
      
      // Check if data is too old (30 days)
      if (parsed.timestamp) {
        const age = Date.now() - new Date(parsed.timestamp).getTime();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (age > maxAge) {
          console.warn('Stored data is too old, removing:', key);
          this.removeItem(key);
          return defaultValue;
        }
      }

      // Validate data if validator provided
      if (validator && !validator(parsed.value)) {
        console.warn('Data validation failed for key:', key);
        this.removeItem(key);
        return defaultValue;
      }

      return parsed.value;
    } catch (error) {
      console.error('Failed to retrieve from localStorage:', error);
      this.removeItem(key);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const userKey = this.getUserKey(key);
      localStorage.removeItem(userKey);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all user-specific data
   * @returns {boolean} Success status
   */
  clearUserData() {
    if (!this.isAvailable || !this.userId) {
      return false;
    }

    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`_${this.userId}`)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear user data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    if (!this.isAvailable) {
      return { available: false };
    }

    try {
      const stats = {
        available: true,
        totalKeys: localStorage.length,
        userKeys: 0,
        totalSize: 0
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        stats.totalSize += (key?.length || 0) + (value?.length || 0);
        
        if (this.userId && key?.includes(`_${this.userId}`)) {
          stats.userKeys++;
        }
      }

      return stats;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { available: false, error: error.message };
    }
  }

  // Convenience methods for specific data types
  setOnboardingState(state) {
    return this.setItem(STORAGE_KEYS.ONBOARDING_STATE, state, VALIDATION_SCHEMAS.onboardingState);
  }

  getOnboardingState() {
    return this.getItem(STORAGE_KEYS.ONBOARDING_STATE, null, VALIDATION_SCHEMAS.onboardingState);
  }

  setUserRules(rules) {
    return this.setItem(STORAGE_KEYS.USER_RULES, rules, VALIDATION_SCHEMAS.userRules);
  }

  getUserRules() {
    return this.getItem(STORAGE_KEYS.USER_RULES, [], VALIDATION_SCHEMAS.userRules);
  }

  setUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences, VALIDATION_SCHEMAS.userPreferences);
  }

  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      notifications: true
    }, VALIDATION_SCHEMAS.userPreferences);
  }

  setThemePreference(theme) {
    return this.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
  }

  getThemePreference() {
    return this.getItem(STORAGE_KEYS.THEME_PREFERENCE, 'light');
  }

  setDashboardMode(mode) {
    return this.setItem(STORAGE_KEYS.DASHBOARD_MODE, mode);
  }

  getDashboardMode() {
    return this.getItem(STORAGE_KEYS.DASHBOARD_MODE, 'default');
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;

// Export for direct use
export { STORAGE_KEYS, VALIDATION_SCHEMAS }; 