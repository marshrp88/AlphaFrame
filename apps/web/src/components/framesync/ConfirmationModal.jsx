/**
 * ConfirmationModal.jsx
 * Modal component for confirming high-risk actions
 * Uses shadcn/ui Dialog component
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/Button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { runSimulation } from '@/lib/services/SimulationService';
import { useFinancialStateStore } from '@/lib/store/financialStateStore';

/**
 * Formats action details for display
 * @param {Object} action - The action to format
 * @returns {string} Formatted action details
 */
const formatActionDetails = (action) => {
  switch (action.actionType) {
    case 'PLAID_TRANSFER':
      return `Transfer $${action.payload.amount} from ${action.payload.sourceAccount} to ${action.payload.destinationAccount}`;
    case 'WEBHOOK':
      return `Send webhook to ${action.payload.url}`;
    case 'ADJUST_GOAL':
      return `Adjust goal "${action.payload.goalId}" by $${action.payload.adjustment}`;
    default:
      return `Execute ${action.actionType} action`;
  }
};

/**
 * Formats simulation results for display
 * @param {Object} action - The action that was simulated
 * @param {Object} result - The simulation result
 * @returns {string} Formatted simulation result
 */
const formatSimulationResult = (action, result) => {
  switch (action.actionType) {
    case 'PLAID_TRANSFER':
      return `After this transfer:
        • ${action.payload.sourceAccount} balance will be $${result.sourceBalance.toLocaleString()}
        • ${action.payload.destinationAccount} balance will be $${result.destinationBalance.toLocaleString()}`;
    case 'ADJUST_GOAL':
      return `After this adjustment:
        • Goal "${action.payload.goalId}" progress will be ${result.goalProgress}%
        • Remaining amount: $${result.remainingAmount.toLocaleString()}`;
    default:
      return 'Simulation completed successfully';
  }
};

/**
 * ConfirmationModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Object} props.action - The action to confirm
 * @param {Function} props.onConfirm - Callback when action is confirmed
 * @param {Function} props.onCancel - Callback when action is cancelled
 */
const ConfirmationModal = ({ isOpen, action, onConfirm, onCancel }) => {
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState(null);
  const financialState = useFinancialStateStore();

  // Run simulation when action changes
  useEffect(() => {
    if (isOpen && action) {
      runSimulationPreview();
    }
  }, [isOpen, action, runSimulationPreview]);

  const runSimulationPreview = useCallback(async () => {
    if (!action) return;
    setIsSimulating(true);
    setSimulationError(null);
    try {
      const result = await runSimulation(action, financialState);
      setSimulationResult(result);
    } catch (error) {
      // console.error('Simulation failed:', error); // Commented for production cleanliness
      setSimulationError('Failed to run simulation');
    } finally {
      setIsSimulating(false);
    }
  }, [action, financialState]);

  if (!action) return null;

  const actionDetails = formatActionDetails(action);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirm Action
          </DialogTitle>
          <DialogDescription>
            Please review the following action before proceeding:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">Action Details</h4>
            <p className="text-sm text-muted-foreground">{actionDetails}</p>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">Simulation Preview</h4>
            {isSimulating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Running simulation...
              </div>
            ) : simulationError ? (
              <p className="text-sm text-destructive">{simulationError}</p>
            ) : simulationResult ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {formatSimulationResult(action, simulationResult)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runSimulationPreview}
                  className="mt-2"
                >
                  Refresh Simulation
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No simulation results available
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isSimulating}
          >
            Confirm & Execute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal; 

