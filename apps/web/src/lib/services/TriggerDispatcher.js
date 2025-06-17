// TriggerDispatcher.js
// Service for dispatching triggers to the ExecutionController
// Part of FrameSync - the execution and automation layer of AlphaFrame

import { create } from 'zustand';

// Action queue store
const useActionQueueStore = create((set) => ({
  queue: [],
  addToQueue: (action) => set((state) => ({ 
    queue: [...state.queue, { ...action, timestamp: Date.now() }] 
  })),
  removeFromQueue: (actionId) => set((state) => ({
    queue: state.queue.filter(action => action.id !== actionId)
  })),
  clearQueue: () => set({ queue: [] })
}));

// Mock ExecutionController for now
const ExecutionController = {
  executeAction: async (action) => {
    // TODO: Replace with actual ExecutionController implementation
    console.log('Executing action:', action);
    return { success: true, actionId: action.id };
  }
};

class TriggerDispatcher {
  constructor() {
    this.actionQueue = useActionQueueStore.getState();
    this.isProcessing = false;
  }

  // Listen for events from RuleEngineService
  listenForEvents(ruleEngineService) {
    ruleEngineService.on('ruleTriggered', (event) => {
      this.queueAction(event);
    });
  }

  // Queue an action for processing
  queueAction(action) {
    const actionWithId = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    this.actionQueue.addToQueue(actionWithId);
    this.processQueue();
  }

  // Process the action queue
  async processQueue() {
    if (this.isProcessing || this.actionQueue.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.actionQueue.queue.length > 0) {
        const action = this.actionQueue.queue[0];
        await this.dispatchAction(action);
        this.actionQueue.removeFromQueue(action.id);
      }
    } catch (error) {
      console.error('Error processing action queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Dispatch an action to the ExecutionController
  async dispatchAction(action) {
    try {
      const result = await ExecutionController.executeAction(action);
      if (!result.success) {
        throw new Error(`Action execution failed: ${action.id}`);
      }
      return result;
    } catch (error) {
      console.error('Error dispatching action:', error);
      throw error;
    }
  }

  // Get current queue status
  getQueueStatus() {
    return {
      queueLength: this.actionQueue.queue.length,
      isProcessing: this.isProcessing
    };
  }
}

// Export a singleton instance
export const triggerDispatcher = new TriggerDispatcher();

/**
 * Formats an action payload according to the FrameSync specification
 * @param {Object} action - The raw action data
 * @returns {Object} Formatted action payload
 */
const formatActionPayload = (action) => ({
  timestamp: Date.now(),
  ruleId: action.ruleId,
  actionType: action.type,
  payload: action.payload,
  status: 'queued'
});

/**
 * Queues an action for processing by adding it to the logStore
 * @param {Object} action - The action to queue
 * @param {Object} logStore - The Zustand store managing the action log
 */
export const queueAction = (action, logStore) => {
  const formattedAction = formatActionPayload(action);
  logStore.addAction(formattedAction);
};

/**
 * Listens for events from the RuleEngineService and queues them
 * @param {Object} ruleEngineService - The RuleEngineService instance
 * @param {Object} logStore - The Zustand store managing the action log
 */
export const listenForEvents = (ruleEngineService, logStore) => {
  ruleEngineService.on('ruleTriggered', (event) => {
    queueAction(event, logStore);
  });
}; 