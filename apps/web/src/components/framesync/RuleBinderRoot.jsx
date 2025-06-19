/**
 * RuleBinderRoot.jsx
 * The main container component for the FrameSync Rule Binder UI
 * Orchestrates the action configuration flow and maintains the overall state
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useLogStore } from '@/lib/store/logStore';
import { dispatchAction } from '@/lib/services/TriggerDispatcher';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';
import { ActionSelector } from './ActionSelector';
import { PlaidActionForm } from './PlaidActionForm';
import { WebhookActionForm } from './WebhookActionForm';
import { InternalActionForm } from './InternalActionForm';
import { Safeguards } from './Safeguards';
import { Loader2 } from 'lucide-react';
import { SimulationPreview } from './SimulationPreview';

/**
 * Action Type Constants
 * @type {Object.<string, string>}
 */
const ACTION_TYPES = {
  PLAID_TRANSFER: 'PLAID_TRANSFER',
  WEBHOOK: 'WEBHOOK',
  SEND_EMAIL: 'SEND_EMAIL',
  SEND_NOTIFICATION: 'SEND_NOTIFICATION',
  CREATE_ALERT: 'CREATE_ALERT',
  ADJUST_GOAL: 'ADJUST_GOAL',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  MODIFY_CATEGORY: 'MODIFY_CATEGORY',
  ADD_MEMO: 'ADD_MEMO'
};

/**
 * RuleBinderRoot Component
 * 
 * The main orchestrator component for the FrameSync Rule Binder UI.
 * This component manages the state and flow of action configuration,
 * coordinating between different action forms and the parent rule editor.
 */

/**
 * RuleBinderRoot Component Props
 * @typedef {Object} RuleBinderRootProps
 * @property {Object} [initialConfig] - Initial configuration for the rule
 * @property {Function} onConfigurationChange - Callback when configuration changes
 */

/**
 * RuleBinderRoot Component
 * @param {RuleBinderRootProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function RuleBinderRoot({ initialConfig, onConfigurationChange }) {
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Optimize Zustand selector to only get the latest action
  const latestAction = useLogStore(state => state.actionLog[state.actionLog.length - 1]);

  // Local state for action configuration
  const [actionType, setActionType] = useState(initialConfig?.actionType || '');
  const [payload, setPayload] = useState(initialConfig?.payload || null);
  const [safeguards, setSafeguards] = useState(initialConfig?.safeguards || {
    requireConfirmation: true,
    runSimulation: true
  });

  // Memoize handlers with useCallback
  const handleActionTypeChange = useCallback((type) => {
    setActionType(type);
    setPayload(null);
  }, []);

  const handlePayloadChange = useCallback((newPayload) => {
    setPayload(newPayload);
  }, []);

  const handleSafeguardsChange = useCallback((newSafeguards) => {
    setSafeguards(newSafeguards);
  }, []);

  /**
   * Formats a success message based on the action type and payload
   * @param {string} type - The action type
   * @param {Object} payload - The action payload
   * @returns {string} Formatted success message
   */
  const formatSuccessMessage = (type, payload) => {
    switch (type) {
      case ACTION_TYPES.PLAID_TRANSFER:
        return `Success: Transferred $${payload.amount} to ${payload.toAccount}`;
      case ACTION_TYPES.WEBHOOK:
        return `Success: Webhook sent to ${payload.url}`;
      case ACTION_TYPES.ADJUST_GOAL:
        return `Success: Goal "${payload.goalId}" adjusted by $${payload.amount}`;
      case ACTION_TYPES.ADD_MEMO:
        return `Success: Memo added to transaction`;
      default:
        return 'Action completed successfully';
    }
  };

  /**
   * Formats an error message based on the action type and error
   * @param {string} type - The action type
   * @param {Error} error - The error object
   * @returns {string} Formatted error message
   */
  const formatErrorMessage = (type, error) => {
    switch (type) {
      case ACTION_TYPES.PLAID_TRANSFER:
        return `Error: Plaid transfer failed. ${error.message}`;
      case ACTION_TYPES.WEBHOOK:
        return `Error: Webhook request failed. ${error.message}`;
      case ACTION_TYPES.ADJUST_GOAL:
        return `Error: Goal adjustment failed. ${error.message}`;
      case ACTION_TYPES.ADD_MEMO:
        return `Error: Failed to add memo. ${error.message}`;
      default:
        return `Error: ${error.message}`;
    }
  };

  const handleSave = useCallback(async () => {
    if (!initialConfig?.rule) {
      toast({
        title: 'Error',
        description: 'No rule selected',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsExecuting(true);

      const mockTransaction = {
        id: `tx_${Date.now()}`,
        amount: payload?.amount || 0,
        date: new Date().toISOString()
      };

      await dispatchAction(initialConfig.rule, mockTransaction);
      
      toast({
        title: "Success",
        description: <div data-testid="rule-toast">Rule created successfully</div>,
      });

      onConfigurationChange?.(payload);
    } catch (error) {
      toast({
        title: 'Error',
        description: formatErrorMessage(actionType, error),
        variant: 'destructive'
      });
    } finally {
      setIsExecuting(false);
    }
  }, [initialConfig, actionType, payload, onConfigurationChange]);

  /**
   * Renders the appropriate action form based on the selected action type
   * @returns {JSX.Element|null} The rendered action form
   */
  const renderActionForm = () => {
    switch (actionType) {
      case ACTION_TYPES.PLAID_TRANSFER:
        return (
          <PlaidActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      case ACTION_TYPES.WEBHOOK:
        return (
          <WebhookActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      case ACTION_TYPES.ADJUST_GOAL:
      case ACTION_TYPES.ADD_MEMO:
        return (
          <InternalActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configure Action</h3>
        <ActionSelector
          value={actionType}
          onChange={handleActionTypeChange}
        />
      </div>

      {actionType && (
        <div className="space-y-4">
          {renderActionForm()}
          <Safeguards
            value={safeguards}
            onChange={handleSafeguardsChange}
          />
          {safeguards.runSimulation && (
            <SimulationPreview
              actionType={actionType}
              payload={payload}
              currentState={initialConfig?.currentState}
            />
          )}
          <Button
            onClick={handleSave}
            disabled={isExecuting || !actionType || !payload}
            className="w-full"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              'Save Rule'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RuleBinderRoot; 
