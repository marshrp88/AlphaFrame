/**
 * FeatureGate.js - AlphaFrame VX.1
 * 
 * Purpose: Feature flag and beta mode management system
 * with controlled rollouts, user targeting, and analytics tracking.
 * 
 * Procedure:
 * 1. Manage feature flags from environment and user preferences
 * 2. Support beta mode activation and user targeting
 * 3. Track feature usage and adoption metrics
 * 4. Provide gradual rollout capabilities
 * 5. Handle feature deprecation and sunsetting
 * 
 * Conclusion: Enables safe feature deployment and beta testing
 * with comprehensive analytics and user experience control.
 */

import executionLogService from '../../core/services/ExecutionLogService.js';
import { getFeatureFlag } from '../config.js';

/**
 * Feature flag definitions
 */
const FEATURE_FLAGS = {
  // Core Features
  PLAID_INTEGRATION: {
    key: 'plaid_integration',
    name: 'Plaid Bank Integration',
    description: 'Real-time bank data synchronization via Plaid',
    default: false,
    beta: true,
    rollout: 0.1 // 10% of users
  },
  
  WEBHOOK_SYSTEM: {
    key: 'webhook_system',
    name: 'Webhook System',
    description: 'Real webhook execution and notification system',
    default: false,
    beta: true,
    rollout: 0.05 // 5% of users
  },
  
  NOTIFICATION_SERVICE: {
    key: 'notification_service',
    name: 'Email Notifications',
    description: 'SendGrid email notification system',
    default: false,
    beta: true,
    rollout: 0.1 // 10% of users
  },
  
  AUTH0_AUTHENTICATION: {
    key: 'auth0_authentication',
    name: 'Auth0 Authentication',
    description: 'Real OAuth authentication with Auth0',
    default: false,
    beta: true,
    rollout: 0.2 // 20% of users
  },
  
  BETA_MODE: {
    key: 'beta_mode',
    name: 'Beta Mode',
    description: 'Enable beta features and experimental functionality',
    default: false,
    beta: false,
    rollout: 1.0 // 100% of users
  },
  
  ADVANCED_REPORTING: {
    key: 'advanced_reporting',
    name: 'Advanced Reporting',
    description: 'Enhanced financial reports and analytics',
    default: true,
    beta: false,
    rollout: 1.0
  },
  
  RULE_ENGINE_V2: {
    key: 'rule_engine_v2',
    name: 'Rule Engine 2.0',
    description: 'Enhanced rule engine with advanced conditions',
    default: true,
    beta: false,
    rollout: 1.0
  },
  
  PORTFOLIO_ANALYZER: {
    key: 'portfolio_analyzer',
    name: 'Portfolio Analyzer',
    description: 'Advanced portfolio analysis and optimization',
    default: true,
    beta: false,
    rollout: 1.0
  }
};

/**
 * Beta user targeting rules
 */
const BETA_TARGETING = {
  // User segments
  segments: {
    early_adopters: {
      criteria: ['has_connected_bank', 'active_user', 'premium_subscriber'],
      weight: 0.8
    },
    power_users: {
      criteria: ['high_usage', 'multiple_accounts', 'rule_creator'],
      weight: 0.6
    },
    regular_users: {
      criteria: ['basic_usage', 'single_account'],
      weight: 0.3
    },
    new_users: {
      criteria: ['recent_signup', 'low_usage'],
      weight: 0.1
    }
  },
  
  // Feature-specific targeting
  features: {
    plaid_integration: ['early_adopters', 'power_users'],
    webhook_system: ['power_users'],
    notification_service: ['early_adopters', 'power_users', 'regular_users'],
    auth0_authentication: ['early_adopters', 'power_users']
  }
};

/**
 * Feature Gate Class
 */
export class FeatureGate {
  constructor() {
    this.userId = null;
    this.userSegment = null;
    this.enabledFeatures = new Set();
    this.featureUsage = new Map();
    this.initialized = false;
  }

  /**
   * Initialize feature gate system
   * @param {string} userId - Current user ID
   * @returns {Promise<void>}
   */
  async initialize(userId) {
    try {
      this.userId = userId;
      
      // Determine user segment
      this.userSegment = await this.determineUserSegment();
      
      // Load user-specific feature flags
      await this.loadUserFeatures();
      
      // Track initialization
      await executionLogService.log('feature_gate.initialized', {
        userId,
        userSegment: this.userSegment,
        enabledFeatures: Array.from(this.enabledFeatures)
      });
      
      this.initialized = true;
    } catch (error) {
      await executionLogService.logError('feature_gate.initialization.failed', error);
      throw error;
    }
  }

  /**
   * Check if a feature is enabled for the current user
   * @param {string} featureKey - Feature key to check
   * @returns {boolean} True if feature is enabled
   */
  isEnabled(featureKey) {
    if (!this.initialized) {
      return getFeatureFlag(featureKey) || false;
    }

    return this.enabledFeatures.has(featureKey);
  }

  /**
   * Check if beta mode is enabled
   * @returns {boolean} True if beta mode is enabled
   */
  isBetaMode() {
    return this.isEnabled('beta_mode') || getFeatureFlag('betaMode');
  }

  /**
   * Get all enabled features
   * @returns {Array} Array of enabled feature keys
   */
  getEnabledFeatures() {
    return Array.from(this.enabledFeatures);
  }

  /**
   * Get feature information
   * @param {string} featureKey - Feature key
   * @returns {Object|null} Feature information
   */
  getFeatureInfo(featureKey) {
    return FEATURE_FLAGS[featureKey] || null;
  }

  /**
   * Track feature usage
   * @param {string} featureKey - Feature key
   * @param {Object} usageData - Usage data
   * @returns {Promise<void>}
   */
  async trackUsage(featureKey, usageData = {}) {
    try {
      const timestamp = new Date().toISOString();
      const usage = {
        featureKey,
        userId: this.userId,
        timestamp,
        userSegment: this.userSegment,
        ...usageData
      };

      // Store usage locally
      this.featureUsage.set(`${featureKey}_${timestamp}`, usage);

      // Log usage
      await executionLogService.log('feature_gate.usage', usage);

      // Store in localStorage for analytics
      const usageHistory = JSON.parse(localStorage.getItem('feature_usage_history') || '[]');
      usageHistory.push(usage);
      
      // Keep only last 100 usage records
      if (usageHistory.length > 100) {
        usageHistory.splice(0, usageHistory.length - 100);
      }
      
      localStorage.setItem('feature_usage_history', JSON.stringify(usageHistory));

    } catch (error) {
      await executionLogService.logError('feature_gate.usage_tracking.failed', error);
    }
  }

  /**
   * Determine user segment based on behavior
   * @returns {Promise<string>} User segment
   */
  async determineUserSegment() {
    try {
      // Get user behavior data
      const userData = await this.getUserBehaviorData();
      
      // Score each segment
      const segmentScores = {};
      
      for (const [segmentName, segment] of Object.entries(BETA_TARGETING.segments)) {
        let score = 0;
        
        for (const criterion of segment.criteria) {
          if (userData[criterion]) {
            score += segment.weight;
          }
        }
        
        segmentScores[segmentName] = score;
      }
      
      // Return highest scoring segment
      const bestSegment = Object.entries(segmentScores)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      return bestSegment || 'regular_users';
      
    } catch (error) {
      await executionLogService.logError('feature_gate.segment_determination.failed', error);
      return 'regular_users';
    }
  }

  /**
   * Get user behavior data
   * @returns {Promise<Object>} User behavior data
   */
  async getUserBehaviorData() {
    try {
      // Get data from localStorage and IndexedDB
      const userSettings = JSON.parse(localStorage.getItem('alphaframe_user_settings') || '{}');
      const usageStats = JSON.parse(localStorage.getItem('alphaframe_usage_stats') || '{}');
      
      return {
        has_connected_bank: userSettings.hasConnectedBank || false,
        active_user: usageStats.lastActive && 
          (Date.now() - new Date(usageStats.lastActive).getTime()) < 7 * 24 * 60 * 60 * 1000,
        premium_subscriber: userSettings.subscriptionTier === 'premium',
        high_usage: usageStats.totalSessions > 50,
        multiple_accounts: userSettings.connectedAccounts > 1,
        rule_creator: usageStats.rulesCreated > 5,
        basic_usage: usageStats.totalSessions > 10,
        single_account: userSettings.connectedAccounts === 1,
        recent_signup: userSettings.signupDate && 
          (Date.now() - new Date(userSettings.signupDate).getTime()) < 30 * 24 * 60 * 60 * 1000,
        low_usage: usageStats.totalSessions <= 5
      };
    } catch (error) {
      return {
        has_connected_bank: false,
        active_user: false,
        premium_subscriber: false,
        high_usage: false,
        multiple_accounts: false,
        rule_creator: false,
        basic_usage: false,
        single_account: false,
        recent_signup: false,
        low_usage: true
      };
    }
  }

  /**
   * Load user-specific feature flags
   * @returns {Promise<void>}
   */
  async loadUserFeatures() {
    try {
      // Start with environment-based flags
      for (const [, feature] of Object.entries(FEATURE_FLAGS)) {
        const envEnabled = getFeatureFlag(feature.key);
        
        if (envEnabled) {
          this.enabledFeatures.add(feature.key);
          continue;
        }
        
        // Check beta targeting
        if (feature.beta && this.isBetaMode()) {
          const shouldEnable = await this.shouldEnableBetaFeature(feature);
          if (shouldEnable) {
            this.enabledFeatures.add(feature.key);
          }
        }
        
        // Check default state
        if (feature.default) {
          this.enabledFeatures.add(feature.key);
        }
      }
      
      // Load user-specific overrides
      const userOverrides = JSON.parse(localStorage.getItem('feature_flags_user_overrides') || '{}');
      for (const [featureKey, enabled] of Object.entries(userOverrides)) {
        if (enabled) {
          this.enabledFeatures.add(featureKey);
        } else {
          this.enabledFeatures.delete(featureKey);
        }
      }
      
    } catch (error) {
      await executionLogService.logError('feature_gate.load_features.failed', error);
    }
  }

  /**
   * Determine if beta feature should be enabled for user
   * @param {Object} feature - Feature definition
   * @returns {Promise<boolean>} True if should enable
   */
  async shouldEnableBetaFeature(feature) {
    try {
      // Check if user is in target segment
      const targetSegments = BETA_TARGETING.features[feature.key] || [];
      if (!targetSegments.includes(this.userSegment)) {
        return false;
      }
      
      // Check rollout percentage
      const userHash = this.hashUserId(this.userId);
      const rolloutThreshold = feature.rollout * 100;
      
      return userHash % 100 < rolloutThreshold;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Hash user ID for consistent rollout
   * @param {string} userId - User ID
   * @returns {number} Hash value
   */
  hashUserId(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Override feature flag for current user
   * @param {string} featureKey - Feature key
   * @param {boolean} enabled - Whether to enable
   * @returns {Promise<void>}
   */
  async overrideFeature(featureKey, enabled) {
    try {
      const overrides = JSON.parse(localStorage.getItem('feature_flags_user_overrides') || '{}');
      
      if (enabled) {
        overrides[featureKey] = true;
        this.enabledFeatures.add(featureKey);
      } else {
        delete overrides[featureKey];
        this.enabledFeatures.delete(featureKey);
      }
      
      localStorage.setItem('feature_flags_user_overrides', JSON.stringify(overrides));
      
      await executionLogService.log('feature_gate.override', {
        featureKey,
        enabled,
        userId: this.userId
      });
      
    } catch (error) {
      await executionLogService.logError('feature_gate.override.failed', error);
    }
  }

  /**
   * Get feature usage statistics
   * @returns {Object} Usage statistics
   */
  getUsageStats() {
    const usageHistory = JSON.parse(localStorage.getItem('feature_usage_history') || '[]');
    const stats = {};
    
    for (const usage of usageHistory) {
      if (!stats[usage.featureKey]) {
        stats[usage.featureKey] = {
          totalUsage: 0,
          uniqueUsers: new Set(),
          lastUsed: null
        };
      }
      
      stats[usage.featureKey].totalUsage++;
      stats[usage.featureKey].uniqueUsers.add(usage.userId);
      
      if (!stats[usage.featureKey].lastUsed || 
          usage.timestamp > stats[usage.featureKey].lastUsed) {
        stats[usage.featureKey].lastUsed = usage.timestamp;
      }
    }
    
    // Convert sets to counts
    for (const featureKey in stats) {
      stats[featureKey].uniqueUsers = stats[featureKey].uniqueUsers.size;
    }
    
    return stats;
  }

  /**
   * Reset feature flags to defaults
   * @returns {Promise<void>}
   */
  async resetToDefaults() {
    try {
      localStorage.removeItem('feature_flags_user_overrides');
      this.enabledFeatures.clear();
      await this.loadUserFeatures();
      
      await executionLogService.log('feature_gate.reset', {
        userId: this.userId
      });
      
    } catch (error) {
      await executionLogService.logError('feature_gate.reset.failed', error);
    }
  }
}

// Export singleton instance
export const featureGate = new FeatureGate(); 