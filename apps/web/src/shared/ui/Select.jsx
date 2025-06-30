// Native HTML <select> for E2E test compatibility
// This is a TEMPORARY solution to unblock Playwright tests that use page.selectOption()
// Replace with a custom or design-system Select after E2E stabilization
// 10th grade level comments included

import React from 'react';

/**
 * Select Component - A dropdown selection component
 * 
 * Purpose: Provides dropdown selection functionality with consistent styling
 * Procedure: Renders a select element with proper accessibility attributes
 * Conclusion: Enables consistent form input behavior across the application
 */
const Select = ({ 
  children, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '', 
  ...props 
}) => {
  return (
    <select 
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

export default Select;

// Trigger is not needed for native <select>, but export for API compatibility
export function SelectTrigger() {
  // Not used in native select, but kept for compatibility
  return null;
}

// Content is not needed for native <select>, but export for API compatibility
export function SelectContent({ children }) {
  // Not used in native select, but kept for compatibility
  return children;
}

// Each SelectItem becomes an <option>
export function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

// Value display for the select (renders placeholder or value)
export function SelectValue({ placeholder }) {
  // Native select shows value automatically, so just show placeholder if needed
  return placeholder ? <option value="">{placeholder}</option> : null;
}

// Note: This is a minimal native select for E2E. Replace after test stabilization. 
