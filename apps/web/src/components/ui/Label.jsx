/**
 * Label Component
 * 
 * Purpose: A reusable label component for form inputs and UI elements,
 * providing consistent styling and accessibility features across the app.
 * 
 * Procedure:
 * 1. Render a semantic label element with proper accessibility attributes
 * 2. Apply consistent styling using Tailwind CSS classes
 * 3. Support both controlled and uncontrolled usage patterns
 * 4. Include proper ARIA attributes for screen readers
 * 
 * Conclusion: Essential UI component for form accessibility and consistent
 * labeling throughout the AlphaFrame application.
 */

import React from 'react';

/**
 * Label Component Props
 * @typedef {Object} LabelProps
 * @property {string} [htmlFor] - ID of the associated form element
 * @property {React.ReactNode} children - Label text content
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [required] - Whether the associated field is required
 * @property {string} [variant] - Visual variant (default, error, success)
 */

/**
 * Label Component
 * @param {LabelProps} props - Component props
 * @returns {JSX.Element} The rendered label component
 */
export function Label({ 
  htmlFor, 
  children, 
  className = '', 
  required = false,
  variant = 'default',
  ...props 
}) {
  const baseClasses = 'block text-sm font-medium text-gray-700 mb-1';
  
  const variantClasses = {
    default: 'text-gray-700',
    error: 'text-red-600',
    success: 'text-green-600',
    disabled: 'text-gray-400'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <label 
      htmlFor={htmlFor}
      className={classes}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

export default Label; 