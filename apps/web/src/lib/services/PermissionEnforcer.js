/**
 * PermissionEnforcer Service
 * 
 * A security service that mediates all external actions in FrameSync.
 * This service is responsible for enforcing permissions, validating actions,
 * and ensuring proper security measures are in place before any action execution.
 */

import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

/**
 * List of high-risk action types that require additional security measures
 * @type {string[]}
 */
const HIGH_RISK_ACTIONS = [
  'PLAID_TRANSFER',
  'WEBHOOK',
  'ADJUST_GOAL'
];

/**
 * List of action types that require specific permissions
 * @type {Object.<string, string[]>}
 */
const ACTION_PERMISSIONS = {
  'PLAID_TRANSFER': ['plaid:transfer'],
  'WEBHOOK': ['webhook:execute'],
  'ADJUST_GOAL': ['goals:modify'],
  'ADD_MEMO': ['transactions:modify']
};

/**
 * Checks if an action requires additional security measures
 * @param {Object} action - The action to check
 * @returns {boolean} Whether the action is high-risk
 */
const isHighRiskAction = (action) => {
  return HIGH_RISK_ACTIONS.includes(action.actionType);
};

/**
 * Prompts the user for their master password
 * @returns {Promise<string>} The entered password
 */
const promptForMasterPassword = async () => {
  return new Promise((resolve) => {
    const uiStore = useUIStore.getState();
    
    uiStore.showPasswordPrompt({
      onConfirm: (password) => resolve(password),
      onCancel: () => resolve(null)
    });
  });
};

/**
 * PermissionEnforcer Class
 * Main service class for handling permission checks and security validation
 */
export class PermissionEnforcer {
  /**
   * Checks if a user has permission to execute a specific action
   * @param {string} actionType - The type of action to check
   * @returns {Promise<Object>} The permission check result
   * @throws {Error} If the permission check fails
   */
  static async canExecuteAction(actionType) {
    try {
      // Check authentication
      const { isAuthenticated, user } = useAuthStore.getState();
      if (!isAuthenticated) {
        return {
          allowed: false,
          reason: 'User must be authenticated to execute actions'
        };
      }

      // Check if action requires specific permissions
      const requiredPermissions = ACTION_PERMISSIONS[actionType];
      if (requiredPermissions) {
        const hasPermission = requiredPermissions.every(permission =>
          user.permissions.includes(permission)
        );
        if (!hasPermission) {
          return {
            allowed: false,
            reason: 'User does not have required permissions'
          };
        }
      }

      // Check if action is high-risk
      if (HIGH_RISK_ACTIONS.includes(actionType)) {
        const password = await promptForMasterPassword();
        if (!password) {
          return {
            allowed: false,
            reason: 'Action cancelled by user'
          };
        }
        // TODO: Verify password against stored hash
      }

      return { allowed: true };
    } catch (error) {
      console.error('Permission check failed:', error);
      return {
        allowed: false,
        reason: 'Permission check failed'
      };
    }
  }

  /**
   * Validates an action payload against its type
   * @param {string} actionType - The type of action
   * @param {Object} payload - The action payload to validate
   * @returns {boolean} Whether the payload is valid
   */
  static validateActionPayload(actionType, payload) {
    switch (actionType) {
      case 'PLAID_TRANSFER':
        return this.validatePlaidTransferPayload(payload);
      case 'WEBHOOK':
        return this.validateWebhookPayload(payload);
      case 'ADJUST_GOAL':
        return this.validateGoalAdjustmentPayload(payload);
      case 'ADD_MEMO':
        return this.validateMemoPayload(payload);
      default:
        return false;
    }
  }

  /**
   * Validates a Plaid transfer payload
   * @param {Object} payload - The payload to validate
   * @returns {boolean} Whether the payload is valid
   * @private
   */
  static validatePlaidTransferPayload(payload) {
    return (
      payload &&
      typeof payload.amount === 'number' &&
      typeof payload.fromAccount === 'string' &&
      typeof payload.toAccount === 'string'
    );
  }

  /**
   * Validates a webhook payload
   * @param {Object} payload - The payload to validate
   * @returns {boolean} Whether the payload is valid
   * @private
   */
  static validateWebhookPayload(payload) {
    return (
      payload &&
      typeof payload.url === 'string' &&
      payload.url.startsWith('https://') &&
      typeof payload.method === 'string' &&
      ['POST', 'PUT', 'PATCH'].includes(payload.method)
    );
  }

  /**
   * Validates a goal adjustment payload
   * @param {Object} payload - The payload to validate
   * @returns {boolean} Whether the payload is valid
   * @private
   */
  static validateGoalAdjustmentPayload(payload) {
    return (
      payload &&
      typeof payload.goalId === 'string' &&
      typeof payload.amount === 'number'
    );
  }

  /**
   * Validates a memo payload
   * @param {Object} payload - The payload to validate
   * @returns {boolean} Whether the payload is valid
   * @private
   */
  static validateMemoPayload(payload) {
    return (
      payload &&
      typeof payload.memo === 'string' &&
      payload.memo.length <= 200
    );
  }
} 
