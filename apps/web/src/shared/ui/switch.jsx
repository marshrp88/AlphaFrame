import React from 'react';

/**
 * Switch Component - A toggle switch component
 * 
 * Purpose: Provides toggle functionality with visual feedback
 * Procedure: Renders a custom switch element with proper accessibility
 * Conclusion: Enables consistent toggle behavior across the application
 */
const Switch = ({ 
  checked,
  onChange,
  disabled = false,
  className = '', 
  ...props 
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked 
          ? 'bg-blue-600 dark:bg-blue-500' 
          : 'bg-gray-200 dark:bg-gray-700'
      } ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default Switch; 
