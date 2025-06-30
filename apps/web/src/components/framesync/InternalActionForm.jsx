/**
 * InternalActionForm Component
 * 
 * A form component for configuring internal FrameSync actions like goal adjustments
 * and memo additions. Provides a unified interface for these simpler action types.
 */

import React, { memo, useCallback, useState, useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Textarea from '@/shared/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

/**
 * InternalActionForm Component Props
 * @typedef {Object} InternalActionFormProps
 * @property {Object} [initialPayload] - Initial payload values
 * @property {Function} onChange - Callback when form values change
 */

/**
 * InternalActionForm Component
 * @param {InternalActionFormProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function InternalActionFormComponent({ initialPayload, onChange }) {
  // Always call hooks first, before any conditional logic
  const { toast } = useToast();

  // Defensive: ensure initialPayload is always an object
  const safeInitialPayload = initialPayload || {};

  // Defensive: always define formData
  const [formData, setFormData] = useState({
    amount: safeInitialPayload.amount || '',
    memo: safeInitialPayload.memo || '',
    goalId: safeInitialPayload.goalId || ''
  });

  const [errors, setErrors] = useState({});

  /**
   * Handles changes to form input values
   * @param {string} field - The field being changed
   * @param {string|number} value - The new value
   */
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * Validates the form data
   * @returns {boolean} Whether the form data is valid
   */
  const validateForm = useCallback(() => {
    if (formData.amount && isNaN(Number(formData.amount))) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid number for the amount',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  }, [formData.amount, toast]);

  // Validate form data after formData changes
  useEffect(() => {
    const newErrors = {};
    if (formData.amount && isNaN(Number(formData.amount))) {
      newErrors.amount = 'Please enter a valid number for the amount';
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid number for the amount',
        variant: 'destructive'
      });
    }
    setErrors(newErrors);
    if (onChange && Object.keys(newErrors).length === 0) {
      onChange(formData);
    }
  }, [formData, onChange, toast]);

  try {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memo">Memo</Label>
          <Textarea
            id="memo"
            data-testid="memo-text"
            value={formData.memo}
            onChange={(e) => handleChange('memo', e.target.value)}
            placeholder="Enter memo text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goalId">Goal ID</Label>
          <Input
            id="goalId"
            value={formData.goalId}
            onChange={(e) => handleChange('goalId', e.target.value)}
            placeholder="Enter goal ID"
          />
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div>
        <span data-testid="internal-form-error">{err?.message || "Unknown error in InternalActionForm"}</span>
        <pre>{err?.stack}</pre>
      </div>
    );
  }
}

// Export memoized component
export const InternalActionForm = memo(InternalActionFormComponent); 
