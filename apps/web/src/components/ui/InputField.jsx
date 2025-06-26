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

import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import './InputField.css';

/**
 * InputField Component Props
 * @typedef {Object} InputFieldProps
 * @property {string} [id] - Unique identifier for the input
 * @property {string} [name] - Name attribute for the input
 * @property {string} [type] - Input type ('text', 'email', 'password', 'number', etc.)
 * @property {string} [value] - Controlled input value
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [label] - Label text for the input
 * @property {string} [helperText] - Helper text below the input
 * @property {string} [error] - Error message to display
 * @property {boolean} [disabled] - Whether the input is disabled
 * @property {boolean} [required] - Whether the input is required
 * @property {string} [size] - Input size ('sm', 'md', 'lg')
 * @property {Function} [onChange] - Change handler
 * @property {Function} [onFocus] - Focus handler
 * @property {Function} [onBlur] - Blur handler
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [prefix] - Content to display before the input
 * @property {React.ReactNode} [suffix] - Content to display after the input
 * @property {number} [maxLength] - Maximum character length
 * @property {string} [autoComplete] - Autocomplete attribute
 */

/**
 * InputField Component
 * @param {InputFieldProps} props - Component props
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} The rendered input field component
 */
export const InputField = forwardRef(({
  id,
  name,
  type = 'text',
  value,
  placeholder,
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  size = 'md',
  onChange,
  onFocus,
  onBlur,
  className = '',
  prefix,
  suffix,
  maxLength,
  autoComplete,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    'input-field',
    `input-field--${size}`,
    isFocused && 'input-field--focused',
    error && 'input-field--error',
    disabled && 'input-field--disabled',
    prefix && 'input-field--has-prefix',
    suffix && 'input-field--has-suffix',
    className
  ].filter(Boolean).join(' ');

  const handleFocus = (event) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label 
        htmlFor={inputId} 
        className="input-field__label"
      >
        {label}
        {required && <span className="input-field__required" aria-label="required">*</span>}
      </label>
    );
  };

  const renderPrefix = () => {
    if (!prefix) return null;
    
    return (
      <span className="input-field__prefix" aria-hidden="true">
        {prefix}
      </span>
    );
  };

  const renderSuffix = () => {
    if (!suffix) return null;
    
    return (
      <span className="input-field__suffix" aria-hidden="true">
        {suffix}
      </span>
    );
  };

  const renderHelperText = () => {
    if (!helperText && !error) return null;
    
    return (
      <div className={`input-field__helper ${error ? 'input-field__helper--error' : ''}`}>
        {error || helperText}
      </div>
    );
  };

  return (
    <div className="input-field__container">
      {renderLabel()}
      
      <div className="input-field__wrapper">
        {renderPrefix()}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {renderSuffix()}
      </div>
      
      {renderHelperText()}
    </div>
  );
});

// PropTypes for runtime validation
InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  maxLength: PropTypes.number,
  autoComplete: PropTypes.string
};

// Default props
InputField.defaultProps = {
  type: 'text',
  disabled: false,
  required: false,
  size: 'md',
  className: ''
};

// Display name for debugging
InputField.displayName = 'InputField';

export default InputField; 