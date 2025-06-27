/**
 * InputField.jsx - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: A reusable input field component that uses design tokens
 * for consistent styling across all AlphaFrame forms and interfaces.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Supports multiple input types and states (focus, error, disabled)
 * 3. Implements proper accessibility attributes and labels
 * 4. Provides consistent input sizing and spacing
 * 
 * Conclusion: Ensures consistent form input styling and behavior
 * across all user interactions in the application.
 */

import React from 'react';
import './InputField.css';

/**
 * InputField - AlphaFrame Design System
 * Props:
 * - type: 'text' | 'email' | 'password' | 'number'
 * - label: string
 * - value: string
 * - onChange: function
 * - placeholder: string
 * - helperText: string
 * - error: string
 * - disabled: boolean
 * - required: boolean
 * - id: string
 * - ...rest: other input props
 */
export default function InputField({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  id,
  ...rest
}) {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="input-field">
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label} {required && <span aria-hidden="true" className="input-field__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field__input${error ? ' input-field__input--error' : ''}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${inputId}-help` : undefined}
        {...rest}
      />
      {helperText && !error && (
        <div id={`${inputId}-help`} className="input-field__helper">{helperText}</div>
      )}
      {error && (
        <div className="input-field__error" role="alert">{error}</div>
      )}
    </div>
  );
} 