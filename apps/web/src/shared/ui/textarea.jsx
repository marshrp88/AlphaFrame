import React from 'react';

/**
 * Textarea Component - A multi-line text input component
 * 
 * Purpose: Provides consistent textarea functionality for longer text input
 * Procedure: Renders a textarea element with proper styling and accessibility
 * Conclusion: Enables uniform textarea behavior across the application
 */
const Textarea = ({ 
  placeholder,
  value,
  onChange,
  rows = 4,
  className = '', 
  ...props 
}) => {
  return (
    <textarea 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-vertical ${className}`}
      {...props}
    />
  );
};

export default Textarea; 
