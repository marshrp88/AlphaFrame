/**
 * Card Component
 * 
 * Purpose: A reusable card container component for organizing content
 * into visually distinct sections with consistent styling and spacing.
 * 
 * Procedure:
 * 1. Provide Card, CardHeader, CardContent, and CardTitle subcomponents
 * 2. Apply consistent styling using Tailwind CSS classes
 * 3. Support various content layouts and spacing options
 * 4. Include proper semantic HTML structure
 * 
 * Conclusion: Essential UI component for content organization and
 * consistent visual hierarchy throughout the AlphaFrame application.
 */

import React from 'react';

/**
 * Card Component Props
 * @typedef {Object} CardProps
 * @property {React.ReactNode} children - Card content
 * @property {string} [className] - Additional CSS classes
 * @property {string} [variant] - Visual variant (default, elevated, outlined)
 */

/**
 * Card Component
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} The rendered card component
 */
export function Card({ children, className = '', variant = 'default', ...props }) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  
  const variantClasses = {
    default: 'bg-white border-gray-200 shadow-sm',
    elevated: 'bg-white border-gray-200 shadow-lg',
    outlined: 'bg-white border-gray-300 shadow-none'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

/**
 * CardHeader Component Props
 * @typedef {Object} CardHeaderProps
 * @property {React.ReactNode} children - Header content
 * @property {string} [className] - Additional CSS classes
 */

/**
 * CardHeader Component
 * @param {CardHeaderProps} props - Component props
 * @returns {JSX.Element} The rendered card header component
 */
export function CardHeader({ children, className = '', ...props }) {
  const classes = `px-6 py-4 border-b border-gray-200 ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

/**
 * CardTitle Component Props
 * @typedef {Object} CardTitleProps
 * @property {React.ReactNode} children - Title content
 * @property {string} [className] - Additional CSS classes
 */

/**
 * CardTitle Component
 * @param {CardTitleProps} props - Component props
 * @returns {JSX.Element} The rendered card title component
 */
export function CardTitle({ children, className = '', ...props }) {
  const classes = `text-lg font-semibold text-gray-900 ${className}`.trim();

  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
}

/**
 * CardContent Component Props
 * @typedef {Object} CardContentProps
 * @property {React.ReactNode} children - Content
 * @property {string} [className] - Additional CSS classes
 */

/**
 * CardContent Component
 * @param {CardContentProps} props - Component props
 * @returns {JSX.Element} The rendered card content component
 */
export function CardContent({ children, className = '', ...props }) {
  const classes = `px-6 py-4 ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card; 