// ExecutionController.js
// Service for executing FrameSync actions
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { useFinancialStateStore } from '../store/financialStateStore';

/**
 * Handles internal actions that modify the financial state
 * @param {Object} action - The action to execute
 * @returns {Promise<Object>} Result of the action
 */
const handleInternalAction = async (action) => {
  const store = useFinancialStateStore.getState();
  
  switch (action.actionType) {
    case 'ADJUST_GOAL':
      return store.adjustGoal(action.payload);
    case 'UPDATE_BUDGET':
      return store.updateBudget(action.payload);
    case 'MODIFY_CATEGORY':
      return store.modifyCategory(action.payload);
    default:
      throw new Error(`Unsupported internal action type: ${action.actionType}`);
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
 * Executes a FrameSync action based on its type
 * @param {Object} action - The action to execute
 * @returns {Promise<Object>} Result of the action execution
 */
export const executeAction = async (action) => {
  try {
    // Determine action class and route to appropriate handler
    if (action.actionType.startsWith('ADJUST_') || 
        action.actionType.startsWith('UPDATE_') || 
        action.actionType.startsWith('MODIFY_')) {
      return await handleInternalAction(action);
    }
    
    if (action.actionType.startsWith('SEND_') || 
        action.actionType.startsWith('CREATE_')) {
      return await handleCommunicationAction(action);
    }

    throw new Error(`Unsupported action type: ${action.actionType}`);
  } catch (error) {
    console.error('Action execution failed:', error);
    throw error;
  }
}; 