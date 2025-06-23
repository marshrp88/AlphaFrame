/**
 * Button Component
 * 
 * Purpose: A reusable button component with consistent styling and
 * behavior across the AlphaFrame application.
 * 
 * Procedure:
 * 1. Support multiple variants (primary, secondary, outline, destructive)
 * 2. Handle different sizes (sm, md, lg)
 * 3. Apply consistent styling using Tailwind CSS classes
 * 4. Include proper accessibility attributes and keyboard navigation
 * 
 * Conclusion: Essential UI component for user interactions and
 * consistent button styling throughout the application.
 */

import React from 'react';

/**
 * Button Component Props
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {string} [variant] - Visual variant (default, destructive, outline, secondary, ghost, link)
 * @property {string} [size] - Size variant (default, sm, lg, icon)
 * @property {boolean} [disabled] - Whether the button is disabled
 * @property {Function} [onClick] - Click handler
 * @property {string} [className] - Additional CSS classes
 * @property {string} [type] - Button type (button, submit, reset)
 */

/**
 * Button Component
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} The rendered button component
 */
export function Button({ 
  children, 
  variant = 'default', 
  size = 'default',
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary'
  };

  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  };

  // Fallback to basic styling if Tailwind classes aren't available
  const fallbackClasses = 'bg-blue-500 text-white hover:bg-blue-600 border border-gray-300 rounded px-4 py-2 font-medium';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button; 