/**
 * PlaidActionForm.jsx
 * Configuration form for Plaid transfer actions
 * Refactored to use AlphaFrame Design System composite components
 */

import { useState, useEffect } from 'react';
import { useAppStore } from '@/core/store/useAppStore';
import CompositeCard from '../ui/CompositeCard.jsx';
import StyledButton from '../ui/StyledButton.jsx';
import './PlaidActionForm.css';

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

  // Validate form data after formData changes
  useEffect(() => {
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
    if (onChange && Object.keys(newErrors).length === 0) {
      onChange(formData);
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

  return (
    <CompositeCard 
      title="Transfer Configuration"
      subtitle="Configure your Plaid transfer settings"
      variant="elevated"
      className="plaid-action-form"
    >
      {/* Debug info in test mode */}
      {localStorage.getItem('test_mode') === 'true' && (
        <CompositeCard 
          variant="outlined" 
          className="debug-info"
          style={{ 
            backgroundColor: 'var(--color-primary-50)', 
            borderColor: 'var(--color-primary-300)',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-700)' }}>
            <div>🔍 PlaidForm Debug: formData = {JSON.stringify(formData)}</div>
            <div>🔍 PlaidForm Debug: errors = {JSON.stringify(errors)}</div>
          </div>
        </CompositeCard>
      )}
      
      <div className="form-section">
        <label htmlFor="from-account" className="form-label">From Account</label>
        <select
          id="from-account"
          value={formData.sourceAccount}
          onChange={(e) => handleChange('sourceAccount', e.target.value)}
          className={`form-select ${errors.sourceAccount ? 'form-select--error' : ''}`}
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
          <p className="form-error">{errors.sourceAccount}</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="to-account" className="form-label">To Account</label>
        <select
          id="to-account"
          value={formData.destinationAccount}
          onChange={(e) => handleChange('destinationAccount', e.target.value)}
          className={`form-select ${errors.destinationAccount ? 'form-select--error' : ''}`}
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
          <p className="form-error">{errors.destinationAccount}</p>
        )}
      </div>

      <div className="form-section">
        <label className="form-label">Amount Type</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              value="fixed"
              checked={formData.amountType === 'fixed'}
              onChange={(e) => handleChange('amountType', e.target.value)}
            />
            <span className="radio-label">Fixed Amount</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="surplus"
              checked={formData.amountType === 'surplus'}
              onChange={(e) => handleChange('amountType', e.target.value)}
            />
            <span className="radio-label">Surplus Above</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <label htmlFor="amount" className="form-label">
          {formData.amountType === 'fixed' ? 'Amount' : 'Surplus Threshold'}
        </label>
        <div className="amount-input-group">
          <span className="currency-symbol">$</span>
          <input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder={formData.amountType === 'fixed' ? '0.00' : 'Enter threshold'}
            className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
            min="0"
            step="0.01"
            data-testid="amount"
          />
        </div>
        {errors.amount && (
          <p className="form-error">{errors.amount}</p>
        )}
      </div>

      <div className="form-section">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter transfer description"
          className="form-input"
          data-testid="description"
        />
      </div>

      <div className="form-actions">
        <StyledButton 
          variant="primary" 
          size="lg"
          disabled={Object.keys(errors).length > 0}
          ariaLabel="Save transfer configuration"
        >
          Save Configuration
        </StyledButton>
      </div>
    </CompositeCard>
  );
}; 

