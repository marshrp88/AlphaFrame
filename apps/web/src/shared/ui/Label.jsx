import React from 'react';

/**
 * Label Component - A form label component with accessibility support
 * 
 * Purpose: Provides accessible labels for form inputs
 * Procedure: Renders a label element with proper association to form controls
 * Conclusion: Ensures form accessibility and consistent labeling
 */
const Label = ({ 
  children, 
  htmlFor,
  className = '', 
  ...props 
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label; 