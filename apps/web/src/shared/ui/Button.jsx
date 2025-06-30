// Button.jsx
// A reusable button component for the UI. Use this for all clickable actions.
// Exports a single named Button component.
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils.js";

/**
 * Button Component - A reusable button component with consistent styling
 * 
 * Purpose: Provides consistent button interactions across the application
 * Procedure: Renders a button element with configurable variants and states
 * Conclusion: Ensures uniform button behavior and appearance
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

// This is a simple, reusable button. Use it for all actions in the app. 
