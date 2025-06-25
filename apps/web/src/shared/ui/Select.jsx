// Native HTML <select> for E2E test compatibility
// This is a TEMPORARY solution to unblock Playwright tests that use page.selectOption()
// Replace with a custom or design-system Select after E2E stabilization
// 10th grade level comments included

import React from 'react';

// Main Select component using native <select>
export function Select({ value, onValueChange, children, ...props }) {
  // onValueChange is the handler for when the user picks a new option
  return (
    <select
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
      data-testid="action-selector"
      {...props}
    >
      {children}
    </select>
  );
}

// Trigger is not needed for native <select>, but export for API compatibility
export function SelectTrigger({ children }) {
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
