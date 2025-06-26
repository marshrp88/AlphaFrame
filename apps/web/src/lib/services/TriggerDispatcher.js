// TriggerDispatcher.js
// Service for dispatching triggers to the ExecutionController
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { ExecutionController } from './ExecutionController';
import { create } from 'zustand';
import { useLogStore } from '../../core/store/logStore';

/**
 * TriggerDispatcher Service
 * 
 * A client-side service that listens for events from the RuleEngineService and passes
 * action payloads to the ExecutionController. This is the central router for handling
 * action execution in FrameSync.
 * 
 * The service maintains an action queue and ensures actions are executed in the correct
 * order with proper error handling and retry logic.
 */

/**
 * Action Queue Item Type
 * @typedef {Object} ActionQueueItem
 * @property {string} id - Unique identifier for the action
 * @property {string} type - Type of action to execute
 * @property {Object} payload - Action-specific configuration
 * @property {number} retryCount - Number of retry attempts
 * @property {string} status - Current status of the action
 */

/**
 * TriggerDispatcher Store
 * Manages the state of the action queue and execution status
 */
const useTriggerStore = create((set, get) => ({
  actionQueue: [],
  isProcessing: false,

  /**
   * Adds a new action to the queue
   * @param {string} type - The type of action to execute
   * @param {Object} payload - The action configuration
   * @returns {string} The ID of the queued action
   */
  queueAction: (type, payload) => {
    const actionId = crypto.randomUUID();
    set(state => ({
      actionQueue: [...state.actionQueue, {
        id: actionId,
        type,
        payload,
        retryCount: 0,
        status: 'queued'
      }]
    }));
    return actionId;
  },

  /**
   * Processes the next action in the queue
   * @returns {Promise<void>}
   */
  processNextAction: async () => {
    const { actionQueue, isProcessing } = get();
    if (isProcessing || actionQueue.length === 0) return;

    set({ isProcessing: true });
    const action = actionQueue[0];

    try {
      await ExecutionController.executeAction(action.type, action.payload);
      set(state => ({
        actionQueue: state.actionQueue.slice(1),
        isProcessing: false
      }));
    } catch (error) {
      if (action.retryCount < 3) {
        set(state => ({
          actionQueue: state.actionQueue.map(a =>
            a.id === action.id
              ? { ...a, retryCount: a.retryCount + 1, status: 'retrying' }
              : a
          ),
          isProcessing: false
        }));
      } else {
        set(state => ({
          actionQueue: state.actionQueue.slice(1),
          isProcessing: false
        }));
      }
    }
  }
}));

/**
 * TriggerDispatcher Class
 * Main service class for handling action triggers and execution
 */
export class TriggerDispatcher {
  /**
   * Creates a new trigger for a specific event
   * @param {string} eventType - The type of event to listen for
   * @param {Function} condition - Function that evaluates if the action should trigger
   * @param {string} actionType - The type of action to execute
   * @param {Object} actionPayload - The configuration for the action
   * @returns {string} The ID of the created trigger
   */
  static createTrigger(eventType, condition, actionType, actionPayload) {
    const handler = async (event) => {
      if (condition(event)) {
        const actionId = useTriggerStore.getState().queueAction(actionType, actionPayload);
        await useTriggerStore.getState().processNextAction();
        return actionId;
      }
      return null;
    };

    // Register the event handler
    window.addEventListener(eventType, handler);
    return crypto.randomUUID();
  }

  /**
   * Removes a previously created trigger
   * @param {string} triggerId - The ID of the trigger to remove
   * @returns {boolean} Whether the trigger was successfully removed
   */
  static removeTrigger(triggerId) {
    // Implementation for removing triggers
    return true;
  }

  /**
   * Gets the current status of the action queue
   * @returns {Object} The current state of the action queue
   */
  static getQueueStatus() {
    return {
      queueLength: useTriggerStore.getState().actionQueue.length,
      isProcessing: useTriggerStore.getState().isProcessing
    };
  }
}

// Export a singleton instance
export const triggerDispatcher = new TriggerDispatcher();

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
  const actionId = logStore.queueAction(payload);
  
  // Execute the action immediately
  const result = await ExecutionController.executeAction(payload.actionType, payload.payload);
  
  // Update the action status in the logStore
  updateActionStatus(actionId, result);
  
  return result;
};

/**
 * Listens for events from the RuleEngineService and queues them
 * @param {Object} ruleEngineService - The RuleEngineService instance
 */
export const listenForEvents = (ruleEngineService) => {
  ruleEngineService.on('ruleTriggered', async (event) => {
    await dispatchAction(event.rule, event.transaction);
  });
};

// Utility functions for testing and queue management
export const queueAction = (action) => useTriggerStore.getState().queueAction(action.type, action);
export const getActionQueue = () => useTriggerStore.getState().actionQueue;
export const clearActionQueue = () => useTriggerStore.setState({ actionQueue: [] });

// Comment out all console statements
// console.log('Trigger dispatcher initialized'); 
