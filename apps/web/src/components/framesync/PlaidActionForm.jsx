/**
 * PlaidActionForm.jsx
 * Configuration form for Plaid transfer actions
 * Uses native HTML form components for better E2E test compatibility
 */

import { useState, useEffect } from 'react';
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useAppStore } from '@/core/store/useAppStore';

/**
 * PlaidActionForm Component
 * @param {Object} props
 * @param {Object} props.initialPayload - Initial form values
 * @param {Function} props.onChange - Callback when form values change
 */
export const PlaidActionForm = ({ initialPayload, onChange }) => {
  const accounts = useAppStore((state) => state.accounts) || [];
  
  // Ensure initialPayload is never null/undefined
  const safeInitialPayload = initialPayload || {};
  
  const [formData, setFormData] = useState({
    sourceAccount: safeInitialPayload.sourceAccount || '',
    destinationAccount: safeInitialPayload.destinationAccount || '',
    amountType: safeInitialPayload.amountType || 'fixed',
    amount: safeInitialPayload.amount || '',
    description: safeInitialPayload.description || ''
  });

  const [errors, setErrors] = useState({});

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sourceAccount) {
      newErrors.sourceAccount = 'Source account is required';
    }
    
    if (!formData.destinationAccount) {
      newErrors.destinationAccount = 'Destination account is required';
    }
    
    if (formData.sourceAccount === formData.destinationAccount) {
      newErrors.destinationAccount = 'Source and destination accounts must be different';
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Notify parent of changes
  useEffect(() => {
    onChange?.(formData);
    validateForm();
  }, [formData, onChange, validateForm]);

  const formatAccountOption = (account) => {
    const balance = account.balance?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return `${account.name} (${balance})`;
  };

  // Before rendering the Select, log the options
  console.log('PlaidActionForm account options', accounts);

  return (
    <div className="space-y-4">
      {/* Debug info in test mode */}
      {localStorage.getItem('test_mode') === 'true' && (
        <div className="p-2 bg-blue-100 border border-blue-300 rounded text-xs">
          <div>🔍 PlaidForm Debug: formData = {JSON.stringify(formData)}</div>
          <div>🔍 PlaidForm Debug: errors = {JSON.stringify(errors)}</div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="from-account">From Account</Label>
        <select
          id="from-account"
          value={formData.sourceAccount}
          onChange={(e) => handleChange('sourceAccount', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${errors.sourceAccount ? 'border-red-500' : 'border-gray-300'}`}
          data-testid="from-account"
        >
          <option value="">Select source account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {formatAccountOption(account)}
            </option>
          ))}
        </select>
        {errors.sourceAccount && (
          <p className="text-sm text-red-500">{errors.sourceAccount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="to-account">To Account</Label>
        <select
          id="to-account"
          value={formData.destinationAccount}
          onChange={(e) => handleChange('destinationAccount', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${errors.destinationAccount ? 'border-red-500' : 'border-gray-300'}`}
          data-testid="to-account"
        >
          <option value="">Select destination account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {formatAccountOption(account)}
            </option>
          ))}
        </select>
        {errors.destinationAccount && (
          <p className="text-sm text-red-500">{errors.destinationAccount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Amount Type</Label>
        <RadioGroup
          value={formData.amountType}
          onValueChange={(value) => handleChange('amountType', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Fixed Amount</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="surplus" id="surplus" />
            <Label htmlFor="surplus">Surplus Above</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          {formData.amountType === 'fixed' ? 'Amount' : 'Surplus Threshold'}
        </Label>
        <div className="flex space-x-2">
          <span className="flex items-center text-muted-foreground">$</span>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder={formData.amountType === 'fixed' ? '0.00' : 'Enter threshold'}
            className={`flex-1 ${errors.amount ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
            data-testid="amount"
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter transfer description"
        />
      </div>
    </div>
  );
}; 

