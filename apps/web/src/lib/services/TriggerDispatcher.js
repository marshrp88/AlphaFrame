// TriggerDispatcher.js
// Service for dispatching triggers to the ExecutionController
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { ExecutionController } from './ExecutionController';
import { create } from 'zustand';
import { useLogStore } from '../../core/store/logStore';

/**
 * Trigger Dispatcher Service - Manages rule execution triggers
 * 
 * Purpose: Handles dispatching of financial automation triggers and rule execution
 * Procedure: Processes trigger events and routes them to appropriate rule handlers
 * Conclusion: Enables automated financial actions based on configured rules
 */
class TriggerDispatcher {
  constructor() {
    this.triggers = new Map();
    this.isActive = false;
  }

  /**
   * Register a trigger handler for a specific event type
   */
  registerTrigger(eventType, handler) {
    this.triggers.set(eventType, handler);
  }

  /**
   * Dispatch a trigger event to registered handlers
   */
  async dispatch(eventType, payload) {
    const handler = this.triggers.get(eventType);
    if (handler) {
      try {
        return await handler(payload);
      } catch (error) {
        console.error(`Trigger dispatch error for ${eventType}:`, error);
        throw error;
      }
    }
    console.warn(`No handler registered for trigger: ${eventType}`);
  }

  /**
   * Start the trigger dispatcher
   */
  start() {
    this.isActive = true;
    console.log('Trigger dispatcher started');
  }

  /**
   * Stop the trigger dispatcher
   */
  stop() {
    this.isActive = false;
    console.log('Trigger dispatcher stopped');
  }
}

// Export singleton instance
const triggerDispatcher = new TriggerDispatcher();
export default triggerDispatcher;

/**
 * Formats an action payload according to the FrameSync specification
 * @param {Object} rule - The rule that triggered the action
 * @param {Object} transaction - The transaction that triggered the rule
 * @returns {Object} Formatted action payload
 */
const formatActionPayload = (rule, transaction) => ({
  ruleId: rule.id,
  actionType: rule.action.type,
  payload: {
    ...rule.action.payload,
    transactionId: transaction.id,
    amount: transaction.amount,
    timestamp: Date.now()
  }
});

/**
 * Updates the action status in the logStore
 * @param {string} actionId - The ID of the action to update
 * @param {Object} result - The execution result
 */
const updateActionStatus = (actionId, result) => {
  const logStore = useLogStore.getState();
  const actionLog = logStore.actionLog;
  const actionIndex = actionLog.findIndex(action => action.id === actionId);
  
  if (actionIndex !== -1) {
    const updatedAction = {
      ...actionLog[actionIndex],
      status: result.status,
      error: result.error,
      completedAt: Date.now()
    };
    
    logStore.updateAction(actionIndex, updatedAction);
  }
};

/**
 * Dispatches an action based on a rule and transaction
 * @param {Object} rule - The rule that was triggered
 * @param {Object} transaction - The transaction that triggered the rule
 * @returns {Promise<void>}
 */
export const dispatchAction = async (rule, transaction) => {
  // Format the action payload
  const payload = formatActionPayload(rule, transaction);
  
  // Queue the action in the logStore
  const logStore = useLogStore.getState();
  const actionId = logStore.queueAction(payload.actionType, payload.payload);
  
  // Execute the action immediately
  try {
    const result = await ExecutionController.executeAction(payload.actionType, payload.payload);
    updateActionStatus(actionId, { status: 'completed', result });
  } catch (error) {
    updateActionStatus(actionId, { status: 'failed', error: error.message });
  }
};

/**
 * Sets up event listeners for the rule engine service
 * @param {Object} ruleEngineService - The rule engine service instance
 */
export const listenForEvents = (ruleEngineService) => {
  // Implementation for setting up event listeners
  // This would connect the rule engine to the trigger dispatcher
};

// Export utility functions
export const queueAction = (action) => useTriggerStore.getState().queueAction(action.type, action);
export const getActionQueue = () => useTriggerStore.getState().actionQueue;
export const clearActionQueue = () => useTriggerStore.setState({ actionQueue: [] });
