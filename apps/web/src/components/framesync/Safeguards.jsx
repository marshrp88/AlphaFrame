/**
 * Safeguards.jsx
 * Configuration component for action safeguards
 * Uses shadcn/ui form components
 */

import React, { memo, useCallback } from 'react';
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Switch } from "@/shared/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * Safeguards Component
 * 
 * A component that manages safety settings for FrameSync actions.
 * Provides toggles for various safety features like confirmation requirements
 * and simulation previews.
 */

/**
 * Safeguards Component Props
 * @typedef {Object} SafeguardsProps
 * @property {Object} value - Current safeguards configuration
 * @property {boolean} value.requireConfirmation - Whether to require confirmation for high-risk actions
 * @property {boolean} value.runSimulation - Whether to run a simulation preview before execution
 * @property {Function} onChange - Callback when safeguards configuration changes
 */

/**
 * Safeguards Component
 * @param {SafeguardsProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function SafeguardsComponent({ value, onChange }) {
  /**
   * Handles changes to individual safeguard settings
   * @param {string} key - The safeguard setting key
   * @param {boolean} checked - The new value for the setting
   */
  const handleChange = useCallback((key, checked) => {
    onChange({
      ...value,
      [key]: checked
    });
  }, [value, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Maximum Amount</Label>
          <div className="flex space-x-2">
            <span className="flex items-center text-muted-foreground">$</span>
            <Input
              type="number"
              value={value.maxAmount}
              onChange={(e) => handleChange('maxAmount', e.target.value)}
              placeholder="Enter maximum amount"
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="require-confirmation">Require Confirmation</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show a confirmation dialog for high-risk actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="require-confirmation"
            data-testid="require-confirmation"
            checked={value.requireConfirmation}
            onCheckedChange={(checked) => handleChange('requireConfirmation', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Cooldown Period (hours)</Label>
          <Input
            type="number"
            value={value.cooldownPeriod}
            onChange={(e) => handleChange('cooldownPeriod', e.target.value)}
            placeholder="Enter cooldown period"
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Frequency (per day)</Label>
          <Input
            type="number"
            value={value.maxFrequency}
            onChange={(e) => handleChange('maxFrequency', e.target.value)}
            placeholder="Enter maximum frequency"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifyOnExecution">Notify on Execution</Label>
          <Switch
            id="notifyOnExecution"
            checked={value.notifyOnExecution}
            onCheckedChange={(checked) => handleChange('notifyOnExecution', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="run-simulation">Run Simulation Preview</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show a preview of the action&apos;s impact before execution</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="run-simulation"
            data-testid="run-simulation"
            checked={value.runSimulation}
            onCheckedChange={(checked) => handleChange('runSimulation', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Export memoized component
export const Safeguards = memo(SafeguardsComponent); 

