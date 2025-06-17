/**
 * ActionSelector.jsx
 * A Select component for choosing the action type
 * Uses shadcn/ui Select component
 */

import React, { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/Label';

// Action categories and their options
const ACTION_CATEGORIES = {
  'External Actions': [
    { value: 'PLAID_TRANSFER', label: 'Plaid Transfer' },
    { value: 'WEBHOOK', label: 'Send Webhook' }
  ],
  'Communication Actions': [
    { value: 'SEND_EMAIL', label: 'Send Email' },
    { value: 'SEND_NOTIFICATION', label: 'Send Notification' },
    { value: 'CREATE_ALERT', label: 'Create Alert' }
  ],
  'Internal Actions': [
    { value: 'ADJUST_GOAL', label: 'Adjust Goal' },
    { value: 'UPDATE_BUDGET', label: 'Update Budget' },
    { value: 'MODIFY_CATEGORY', label: 'Modify Category' }
  ]
};

/**
 * Available Action Types
 * @type {Object.<string, {label: string, description: string}>}
 */
const ACTION_TYPES = {
  PLAID_TRANSFER: {
    label: 'Plaid Transfer',
    description: 'Transfer funds between connected bank accounts'
  },
  WEBHOOK: {
    label: 'Webhook',
    description: 'Send data to an external service via webhook'
  },
  ADJUST_GOAL: {
    label: 'Adjust Goal',
    description: 'Modify financial goal parameters'
  },
  ADD_MEMO: {
    label: 'Add Memo',
    description: 'Add a note to a transaction'
  }
};

/**
 * ActionSelector Component
 * 
 * A dropdown component for selecting the type of action to be executed
 * in the FrameSync system. Provides a user-friendly interface for choosing
 * between different action types with descriptions and icons.
 */

/**
 * ActionSelector Component Props
 * @typedef {Object} ActionSelectorProps
 * @property {string} value - Currently selected action type
 * @property {Function} onChange - Callback when selection changes
 */

/**
 * ActionSelector Component
 * @param {ActionSelectorProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function ActionSelectorComponent({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="action-type">Action Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="action-type">
          <SelectValue placeholder="Select an action type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ACTION_TYPES).map(([type, { label, description }]) => (
            <SelectItem key={type} value={type}>
              <div className="flex flex-col">
                <span className="font-medium">{label}</span>
                <span className="text-sm text-muted-foreground">{description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Export memoized component
export const ActionSelector = memo(ActionSelectorComponent); 