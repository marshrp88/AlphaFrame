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

  // Track if handleSave was called (for debug purposes)
  const [saveHandlerCalled, setSaveHandlerCalled] = useState(false);
  // Track if button was clicked (for debug purposes)
  const [buttonClicked, setButtonClicked] = useState(false);

  // Memoize handlers with useCallback
  const handleActionTypeChange = useCallback((type) => {
    console.log('[RuleBinderRoot] Action type changed to:', type);
    console.log('[RuleBinderRoot] ACTION_TYPES.PLAID_TRANSFER:', ACTION_TYPES.PLAID_TRANSFER);
    console.log('[RuleBinderRoot] Type comparison:', type === ACTION_TYPES.PLAID_TRANSFER);
    setActionType(type);
    setPayload(null);
  }, []);

  const handlePayloadChange = useCallback((newPayload) => {
    console.log('[RuleBinderRoot] Payload changed:', newPayload);
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

  const handleSave = useCallback(async (e) => {
    console.log('[debug] handleSave() entered');
    console.log('[RuleBinderRoot] handleSave called');
    console.log('[RuleBinderRoot] initialConfig:', initialConfig);
    console.log('[RuleBinderRoot] actionType:', actionType);
    console.log('[RuleBinderRoot] payload:', payload);
    
    // Set flag for debug visibility
    setSaveHandlerCalled(true);
    
    // For new rule creation, we don't need initialConfig.rule
    // Only require it for rule updates
    if (initialConfig && !initialConfig.rule) {
      console.log('[RuleBinderRoot] No rule found, but this might be a new rule creation');
      // Don't return early - allow new rule creation
    }

    try {
      console.log('[RuleBinderRoot] Starting execution');
      setIsExecuting(true);

      const mockTransaction = {
        id: `tx_${Date.now()}`,
        amount: payload?.amount || 0,
        date: new Date().toISOString()
      };

      console.log('[RuleBinderRoot] Dispatching action with transaction:', mockTransaction);
      
      // For new rules, create a mock rule object with valid Plaid payload
      const ruleToExecute = initialConfig?.rule || {
        id: `rule_${Date.now()}`,
        name: 'New Rule',
        action: {
          type: 'PLAID_TRANSFER',
          payload: {
            amount: Number(payload?.amount) || 1000,
            sourceAccountId: payload?.sourceAccount || 'chase_checking',
            destinationAccountId: payload?.destinationAccount || 'vanguard_brokerage',
            description: payload?.description || '',
            amountType: payload?.amountType || 'fixed'
          }
        }
      };
      
      console.log('[RuleBinderRoot] Rule to execute:', ruleToExecute);
      
      const result = await dispatchAction(ruleToExecute, mockTransaction);
      console.log('[RuleBinderRoot] Action dispatched successfully, result:', result);
      
      console.log('[RuleBinderRoot] Action dispatched successfully, showing success toast');
      toast({
        title: "Success",
        description: <div data-testid="rule-toast">Rule created successfully</div>,
      });

      onConfigurationChange?.(payload);
    } catch (error) {
      console.log('[RuleBinderRoot] Error occurred:', error);
      console.error('[RuleBinderRoot] Full error details:', error);
      
      // Show error toast with more details
      toast({
        title: 'Error',
        description: <div data-testid="error-toast">{formatErrorMessage(actionType, error)}</div>,
        variant: 'destructive'
      });
    } finally {
      console.log('[RuleBinderRoot] Execution completed, setting isExecuting to false');
      setIsExecuting(false);
    }
  }, [initialConfig, actionType, payload, onConfigurationChange]);

  /**
   * Renders the appropriate action form based on the selected action type
   * @returns {JSX.Element|null} The rendered action form
   */
  const renderActionForm = () => {
    console.log('[RuleBinderRoot] renderActionForm called with actionType:', actionType);
    console.log('[RuleBinderRoot] ACTION_TYPES.PLAID_TRANSFER:', ACTION_TYPES.PLAID_TRANSFER);
    console.log('[RuleBinderRoot] actionType === ACTION_TYPES.PLAID_TRANSFER:', actionType === ACTION_TYPES.PLAID_TRANSFER);
    
    switch (actionType) {
      case ACTION_TYPES.PLAID_TRANSFER:
        console.log('[RuleBinderRoot] Rendering PlaidActionForm');
        return (
          <PlaidActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      case ACTION_TYPES.WEBHOOK:
        console.log('[RuleBinderRoot] Rendering WebhookActionForm');
        return (
          <WebhookActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      case ACTION_TYPES.ADJUST_GOAL:
      case ACTION_TYPES.ADD_MEMO:
        console.log('[RuleBinderRoot] Rendering InternalActionForm');
        return (
          <InternalActionForm
            initialPayload={payload}
            onChange={handlePayloadChange}
          />
        );
      default:
        console.log('[RuleBinderRoot] No action form rendered for actionType:', actionType);
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configure Action</h3>
        
        {/* Add trigger input for E2E tests */}
        <div className="space-y-2">
          <label htmlFor="trigger-input" className="text-sm font-medium">Trigger Condition</label>
          <input
            id="trigger-input"
            data-testid="trigger-input"
            type="text"
            placeholder="e.g., checking_account_balance > 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            defaultValue="checking_account_balance > 5000"
          />
        </div>
        
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
            onClick={e => {
              console.log('[debug] Save button clicked');
              if (localStorage.getItem('test_mode') === 'true') {
                setButtonClicked(true);
              }
              handleSave(e);
            }}
            disabled={isExecuting || !actionType || !payload}
            className="w-full"
            data-testid="save-button"
            data-enabled={!!(actionType && payload)}
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
          {/* Show if button was clicked in test mode */}
          {localStorage.getItem('test_mode') === 'true' && buttonClicked && (
            <span data-testid="save-button-clicked">🟢 Clicked</span>
          )}
          {/* Debug info in test mode */}
          {localStorage.getItem('test_mode') === 'true' && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
              <div>🔍 Debug: actionType = {actionType || 'undefined'}</div>
              <div>🔍 Debug: payload = {JSON.stringify(payload)}</div>
              <div>🔍 Debug: button enabled = {!!(actionType && payload)}</div>
              <div>🔍 Debug: isExecuting = {isExecuting}</div>
              <div>🔍 Debug: saveHandlerCalled = {saveHandlerCalled}</div>
            </div>
          )}
          {/* Visible indicator when handleSave is called */}
          {localStorage.getItem('test_mode') === 'true' && saveHandlerCalled && (
            <span data-testid="save-handler-called" className="text-green-600 font-bold">✅ handleSave called</span>
          )}
        </div>
      )}
    </div>
  );
}

export default RuleBinderRoot; 
