import React from 'react';

/**
 * Input Component - A reusable text input component
 * 
 * Purpose: Provides consistent text input functionality across the application
 * Procedure: Renders an input element with proper styling and accessibility
 * Conclusion: Ensures uniform input behavior and appearance
 */
const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '', 
  ...props 
}) => {
  return (
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${className}`}
      {...props}
    />
  );
};

export default Input; 
