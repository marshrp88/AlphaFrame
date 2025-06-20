/**
 * PlaidActionForm.jsx
 * Configuration form for Plaid transfer actions
 * Uses shadcn/ui form components
 */

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/Select";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useAppStore } from '@/store/useAppStore';
import { useToast } from "@/shared/ui/use-toast";

/**
 * PlaidActionForm Component
 * @param {Object} props
 * @param {Object} props.initialPayload - Initial form values
 * @param {Function} props.onChange - Callback when form values change
 */
export const PlaidActionForm = ({ initialPayload = {}, onChange }) => {
  const { toast } = useToast();
  const accounts = useAppStore((state) => state.accounts) || [];
  
  const [formData, setFormData] = useState({
    sourceAccount: initialPayload.sourceAccount || '',
    destinationAccount: initialPayload.destinationAccount || '',
    amountType: initialPayload.amountType || 'fixed',
    amount: initialPayload.amount || '',
    description: initialPayload.description || ''
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

  // Notify parent of changes
  useEffect(() => {
    if (validateForm()) {
      onChange?.(formData);
    }
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      <div className="space-y-2">
        <Label>From Account</Label>
        <Select
          value={formData.sourceAccount}
          onValueChange={(value) => handleChange('sourceAccount', value)}
        >
          <SelectTrigger className={errors.sourceAccount ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select source account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {formatAccountOption(account)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sourceAccount && (
          <p className="text-sm text-red-500">{errors.sourceAccount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>To Account</Label>
        <Select
          value={formData.destinationAccount}
          onValueChange={(value) => handleChange('destinationAccount', value)}
        >
          <SelectTrigger className={errors.destinationAccount ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select destination account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {formatAccountOption(account)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label>
          {formData.amountType === 'fixed' ? 'Amount' : 'Surplus Threshold'}
        </Label>
        <div className="flex space-x-2">
          <span className="flex items-center text-muted-foreground">$</span>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder={formData.amountType === 'fixed' ? '0.00' : 'Enter threshold'}
            className={`flex-1 ${errors.amount ? 'border-red-500' : ''}`}
            min="0"
            step="0.01"
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter transfer description"
        />
      </div>
    </div>
  );
}; 

