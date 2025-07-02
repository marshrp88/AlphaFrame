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
import notificationService from './NotificationService.js';

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
      const validationData = { type: actionType, payload };
      const parsed = ActionSchema.safeParse(validationData);
      if (!parsed.success) {
        throw new Error('Invalid action payload.');
      }

      // Check for sandbox mode
      const isSandboxMode = localStorage.getItem('sandbox_mode') === 'true';
      if (isSandboxMode) {
        return {
          success: true,
          message: 'Action executed in sandbox mode',
          sandbox: true,
          actionType,
          payload
        };
      }

      // Check permissions
      const permissionCheck = await canExecuteAction(actionType);
      if (!permissionCheck.allowed) {
        throw new Error(`Permission denied: ${permissionCheck.reason}`);
      }

      // Check if confirmation is required
      if (requiresConfirmation(actionType) && !confirmed) {
        const password = await promptForMasterPassword();
        if (!password) {
          throw new Error('Action cancelled by user');
        }
      }

      // Execute the action based on type
      let result;
      if (INTERNAL_ACTIONS.includes(actionType)) {
        result = await handleInternalAction({ type: actionType, payload });
      } else {
        switch (actionType) {
          case 'PLAID_TRANSFER':
            result = await handlePlaidTransfer({ payload });
            break;
          case 'WEBHOOK':
            result = await executeWebhook(payload);
            break;
          case 'SEND_EMAIL':
          case 'SEND_NOTIFICATION':
          case 'CREATE_ALERT':
            result = await handleCommunicationAction({ actionType, payload });
            break;
          default:
            throw new Error(`Unsupported action type: ${actionType}`);
        }
      }

      // Log the successful execution
      const logStore = useLogStore.getState();
      const logId = logStore.addLogEntry(actionType, payload);
      logStore.updateLogEntry(logId, {
        status: 'completed',
        result
      });

      // Return the result directly for backward compatibility
      return result;
    } catch (error) {
      // Log the failed execution
      const logStore = useLogStore.getState();
      const logId = logStore.addLogEntry(actionType, payload);
      logStore.updateLogEntry(logId, {
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Executes a Plaid transfer with proper error handling
   * @param {Object} payload - The transfer configuration
   * @returns {Promise<Object>} The transfer result
   */
  static async executePlaidTransfer(payload) {
    return this.executeAction('PLAID_TRANSFER', payload);
  }

  /**
   * Handles webhook execution
   * @param {Object} payload - The webhook configuration
   * @returns {Promise<Object>} The webhook result
   */
  static async handleWebhook(payload) {
    return this.executeAction('WEBHOOK', payload);
  }

  /**
   * Handles goal adjustment
   * @returns {Promise<Object>} The adjustment result
   */
  static async handleGoalAdjustment() {
    return this.executeAction('ADJUST_GOAL', {});
  }

  /**
   * Handles memo addition
   * @param {Object} payload - The memo configuration
   * @returns {Promise<Object>} The memo result
   */
  static async handleMemoAddition(payload) {
    return this.executeAction('ADD_MEMO', payload);
  }

  /**
   * Handles communication actions
   * @param {Object} params - The communication parameters
   * @returns {Promise<Object>} The communication result
   */
  static async handleCommunicationAction({ actionType, payload }) {
    return this.executeAction(actionType, payload);
  }
}

export default ExecutionController; 
