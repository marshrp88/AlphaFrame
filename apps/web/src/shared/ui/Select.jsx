// Native HTML <select> for E2E test compatibility
// This is a TEMPORARY solution to unblock Playwright tests that use page.selectOption()
// Replace with a custom or design-system Select after E2E stabilization
// 10th grade level comments included

import React from 'react';
import { cn } from '@/lib/utils';
import './select.css';

/**
 * Select Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent select dropdown functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent select styling with proper states
 * 3. Support disabled states and accessibility
 * 4. Ensure proper focus management
 * 
 * Conclusion: Ensures uniform select behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
const Select = ({ 
  children, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '', 
  disabled = false,
  error = false,
  size = 'md',
  variant = 'default',
  ...props 
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        'select',
        `select-${size}`,
        `select-${variant}`,
        {
          'select-disabled': disabled,
          'select-error': error
        },
        className
      )}
      disabled={disabled}
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
