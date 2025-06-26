/**
 * ExecutionController Service
 * 
 * A client-side service responsible for executing different types of actions in FrameSync.
 * This service acts as the central coordinator for all action executions, handling
 * high-risk actions, confirmations, and error management.
 */

import { useFinancialStateStore } from '../../core/store/financialStateStore';
import { useUIStore } from '../../core/store/uiStore';
import { get } from '../../core/services/SecureVault';
import { canExecuteAction } from './PermissionEnforcer';
import { useLogStore } from '../../core/store/logStore';
import { ActionSchema } from '../validation/schemas';
import { executeWebhook } from './WebhookService.js';
import { sendEmail } from './NotificationService.js';

const PLAID_API_BASE = 'https://api.plaid.com';

/**
 * List of internal actions that modify the financial state
 * @type {string[]}
 */
const INTERNAL_ACTIONS = ['ADJUST_GOAL', 'UPDATE_BUDGET', 'MODIFY_CATEGORY'];

/**
 * List of action types that require user confirmation before execution
 * @type {string[]}
 */
const HIGH_RISK_ACTIONS = [
  'PLAID_TRANSFER',
  'WEBHOOK',
  'ADJUST_GOAL'
];

/**
 * Checks if an action requires user confirmation
 * @param {string} actionType - The type of action to check
 * @returns {boolean} Whether the action requires confirmation
 */
const requiresConfirmation = (actionType) => {
  return HIGH_RISK_ACTIONS.includes(actionType);
};

/**
 * Handles internal actions that modify the financial state
 * @param {Object} action - The action to execute
 * @returns {Promise<Object>} Result of the action
 */
const handleInternalAction = async (action) => {
  const store = useFinancialStateStore.getState();
  
  switch (action.type) {
    case 'ADJUST_GOAL':
      return store.adjustGoal(action.payload);
    case 'UPDATE_BUDGET':
      return store.updateBudget(action.payload);
    case 'MODIFY_CATEGORY':
      return store.modifyCategory(action.payload);
    default:
      throw new Error(`Unhandled internal action: ${action.type}`);
  }
};

/**
 * Handles communication actions that send notifications
 * @param {Object} action - The action to execute
 * @returns {Promise<Object>} Result of the action
 */
const handleCommunicationAction = async (action) => {
  const endpoints = {
    SEND_EMAIL: '/api/send-email',
    SEND_NOTIFICATION: '/api/send-notification',
    CREATE_ALERT: '/api/create-alert'
  };

  const endpoint = endpoints[action.actionType];
  if (!endpoint) {
    throw new Error(`Unsupported communication action type: ${action.actionType}`);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(action.payload)
  });

  if (!response.ok) {
    throw new Error(`Communication action failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Handles Plaid transfer actions
 * @param {Object} action - The action to execute
 * @returns {Promise<Object>} Result of the transfer
 */
const handlePlaidTransfer = async (action) => {
  try {
    // Get Plaid API token from secure vault
    const plaidToken = await get('plaid_api_token');
    if (!plaidToken) {
      throw new Error('Plaid API token not found in secure vault');
    }

    const { amount, sourceAccount, destinationAccount, description } = action.payload;

    // Step 1: Create transfer authorization
    const authResponse = await fetch(`${PLAID_API_BASE}/transfer/authorization/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Plaid-Version': '2020-09-14',
        'Authorization': `Bearer ${plaidToken}`
      },
      body: JSON.stringify({
        access_token: plaidToken,
        account_id: sourceAccount,
        type: 'credit',
        network: 'ach',
        amount: amount.toString(),
        description: description || 'AlphaFrame automated transfer'
      })
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      throw new Error(`Transfer authorization failed: ${error.error_message || authResponse.statusText}`);
    }

    const { authorization_id } = await authResponse.json();

    // Step 2: Create the transfer
    const transferResponse = await fetch(`${PLAID_API_BASE}/transfer/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Plaid-Version': '2020-09-14',
        'Authorization': `Bearer ${plaidToken}`
      },
      body: JSON.stringify({
        access_token: plaidToken,
        authorization_id,
        account_id: destinationAccount,
        description: description || 'AlphaFrame automated transfer'
      })
    });

    if (!transferResponse.ok) {
      const error = await transferResponse.json();
      throw new Error(`Transfer creation failed: ${error.error_message || transferResponse.statusText}`);
    }

    return transferResponse.json();
  } catch (error) {
    throw new Error(`Plaid transfer failed: ${error.message}`);
  }
};

/**
 * Prompts the user for their master password
 * @returns {Promise<string>} The entered password
 */
const promptForMasterPassword = async () => {
  return new Promise((resolve) => {
    useUIStore.getState().showPasswordPrompt({
      onConfirm: (password) => resolve(password),
      onCancel: () => resolve(null)
    });
  });
};

/**
 * ExecutionController Class
 * Main service class for handling action execution
 */
export class ExecutionController {
  /**
   * Executes an action with proper security checks and confirmation flow
   * @param {string} actionType - The type of action to execute
   * @param {Object} payload - The action configuration
   * @param {boolean} [confirmed=false] - Whether the action has been pre-confirmed
   * @returns {Promise<Object>} The result of the action execution
   * @throws {Error} If the action execution fails or is not permitted
   */
  static async executeAction(actionType, payload, confirmed = false) {
    try {
      // console.log('Executing action:', actionType, payload);
      
      const validationData = { type: actionType, payload };
      const parsed = ActionSchema.safeParse(validationData);
      if (!parsed.success) {
        throw new Error('Invalid action payload.');
      }

      // Check for sandbox mode
      const { isSandboxMode } = useUIStore.getState();
      if (isSandboxMode) {
        // In sandbox mode, log the action and return a mocked result
        console.log('[SANDBOX] Action execution simulated:', { actionType, payload });
        return { success: true, sandbox: true, actionType, payload };
      }

      // Check permissions
      const permissionResult = await canExecuteAction(actionType);
      if (!permissionResult.allowed) {
        throw new Error(permissionResult.reason || 'Permission denied');
      }

      // Handle high-risk actions
      if (requiresConfirmation(actionType) && !confirmed) {
        const password = await promptForMasterPassword();
        if (!password) {
          throw new Error('Action cancelled by user');
        }
        return this.executeAction(actionType, payload, true);
      }

      // Add diagnostic logs for internal action routing
      console.log('[DEBUG] INTERNAL_ACTIONS =', INTERNAL_ACTIONS);
      console.log('[DEBUG] actionType =', actionType);
      console.log('[DEBUG] isInternal =', INTERNAL_ACTIONS.includes(actionType));

      // Handle internal actions
      if (INTERNAL_ACTIONS.includes(actionType)) {
        console.log('[EXECUTION] Handling internal action:', actionType);
        return handleInternalAction({ type: actionType, payload });
      }

      // Execute the appropriate action handler for non-internal actions
      switch (actionType) {
        case 'PLAID_TRANSFER':
          return this.executePlaidTransfer(payload);
        case 'WEBHOOK':
          return this.handleWebhook(payload);
        case 'SEND_EMAIL':
        case 'SEND_NOTIFICATION':
        case 'CREATE_ALERT':
          return handleCommunicationAction({ actionType, payload });
        case 'ADD_MEMO':
          return this.handleMemoAddition(payload);
        default:
          console.warn('[EXECUTION] Unknown action type:', actionType);
          throw new Error(`Unsupported action type: ${actionType}`);
      }
    } catch (error) {
      throw new Error(`Action execution failed: ${error.message}`);
    }
  }

  /**
   * Handles Plaid transfer actions
   * @param {Object} payload - The transfer configuration
   * @returns {Promise<Object>} The result of the transfer
   * @private
   */
  static async executePlaidTransfer(payload) {
    return handlePlaidTransfer({ type: 'PLAID_TRANSFER', payload });
  }

  /**
   * Handles webhook actions
   * @param {Object} payload - The webhook configuration
   * @returns {Promise<Object>} The result of the webhook call
   * @private
   */
  static async handleWebhook(payload) {
    try {
      // Validate webhook payload
      if (!payload.url) {
        throw new Error('Webhook URL is required');
      }

      // Execute webhook using real service
      const result = await executeWebhook(payload);
      
      // Log successful webhook execution
      useLogStore.getState().queueAction({ 
        type: 'WEBHOOK_EXECUTED', 
        payload: { 
          url: payload.url, 
          result,
          timestamp: Date.now() 
        } 
      });

      return result;
    } catch (error) {
      // Log failed webhook execution
      useLogStore.getState().queueAction({ 
        type: 'WEBHOOK_FAILED', 
        payload: { 
          url: payload.url, 
          error: error.message,
          timestamp: Date.now() 
        } 
      });
      
      throw error;
    }
  }

  /**
   * Handles goal adjustment actions
   * @returns {Promise<Object>} The result of the goal adjustment
   * @private
   */
  static async handleGoalAdjustment() {
    // Implementation for goal adjustments
    return { success: true, adjustmentId: 'mock_adjustment_id' };
  }

  /**
   * Handles memo addition actions
   * @param {Object} payload - The memo configuration
   * @returns {Promise<Object>} The result of the memo addition
   * @private
   */
  static async handleMemoAddition(payload) {
    // Implementation for memo additions
    useLogStore.getState().queueAction({ type: 'ADD_MEMO', payload: { memo: payload.memo, timestamp: Date.now() } });
    return { success: true, memoId: 'mock_memo_id' };
  }

  /**
   * Handles communication actions (email, notifications)
   * @param {Object} payload - The communication configuration
   * @returns {Promise<Object>} The result of the communication
   * @private
   */
  static async handleCommunicationAction({ actionType, payload }) {
    try {
      switch (actionType) {
        case 'SEND_EMAIL':
          return await sendEmail(payload);
        
        case 'SEND_NOTIFICATION':
          // For now, treat notifications as emails
          return await sendEmail({
            ...payload,
            template: payload.template || 'notification'
          });
        
        case 'CREATE_ALERT':
          // Create in-app alert
          useUIStore.getState().showAlert({
            type: payload.type || 'info',
            message: payload.message,
            title: payload.title
          });
          return { success: true, alertId: `alert_${Date.now()}` };
        
        default:
          throw new Error(`Unsupported communication action: ${actionType}`);
      }
    } catch (error) {
      throw new Error(`Communication action failed: ${error.message}`);
    }
  }
} 
