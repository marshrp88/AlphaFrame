/**
 * Checkbox.jsx - AlphaFrame Phase X Sprint 2
 * 
 * Purpose: A reusable checkbox component that uses design tokens
 * for consistent styling and provides advanced selection patterns.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Implements proper accessibility with keyboard navigation and ARIA attributes
 * 3. Supports multiple states and validation
 * 4. Provides smooth animations and focus management
 * 
 * Conclusion: Creates a polished, accessible checkbox component
 * that maintains visual consistency throughout the application.
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

/**
 * Checkbox Component Props
 * @typedef {Object} CheckboxProps
 * @property {boolean} [checked] - Whether checkbox is checked
 * @property {Function} [onChange] - Change handler
 * @property {string} [label] - Label text
 * @property {boolean} [disabled] - Whether checkbox is disabled
 * @property {string} [size] - Checkbox size ('sm', 'md', 'lg')
 * @property {string} [className] - Additional CSS classes
 * @property {string} [error] - Error message
 * @property {boolean} [required] - Whether field is required
 * @property {string} [name] - Input name attribute
 * @property {string} [value] - Input value attribute
 * @property {boolean} [indeterminate] - Whether checkbox is in indeterminate state
 */

/**
 * Checkbox Component
 * @param {CheckboxProps} props - Component props
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} The rendered checkbox component
 */
export const Checkbox = forwardRef(({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  error,
  required = false,
  name,
  value,
  indeterminate = false,
  ...props
}, ref) => {
  const handleChange = (event) => {
    if (!disabled && onChange) {
      onChange(event);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled && onChange) {
        const newEvent = {
          ...event,
          target: {
            ...event.target,
            checked: !checked
          }
        };
        onChange(newEvent);
      }
    }
  };

  const checkboxClasses = [
    'checkbox',
    `checkbox--${size}`,
    checked && 'checkbox--checked',
    disabled && 'checkbox--disabled',
    indeterminate && 'checkbox--indeterminate',
    error && 'checkbox--error',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'checkbox__input',
    `checkbox__input--${size}`,
    checked && 'checkbox__input--checked',
    disabled && 'checkbox__input--disabled',
    indeterminate && 'checkbox__input--indeterminate',
    error && 'checkbox__input--error'
  ].filter(Boolean).join(' ');

  const renderCheckmark = () => {
    if (indeterminate) {
      return (
        <span className="checkbox__indeterminate" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="7" width="10" height="2" rx="1" />
          </svg>
        </span>
      );
    }
    
    if (checked) {
      return (
        <span className="checkbox__checkmark" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="checkbox__container">
      <label className={checkboxClasses}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        <span className="checkbox__control">
          {renderCheckmark()}
        </span>
        
        {label && (
          <span className="checkbox__label">
            {label}
            {required && <span className="checkbox__required" aria-label="required">*</span>}
          </span>
        )}
      </label>
      
      {error && (
        <div className="checkbox__error">
          {error}
        </div>
      )}
    </div>
  );
});

// PropTypes for runtime validation
Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  indeterminate: PropTypes.bool
};

// Default props
Checkbox.defaultProps = {
  checked: false,
  disabled: false,
  size: 'md',
  className: '',
  required: false,
  indeterminate: false
};

// Display name for debugging
Checkbox.displayName = 'Checkbox';

export default Checkbox; 