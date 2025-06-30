/**
 * UI Card Component - A styled card component for the UI library
 * 
 * Purpose: Provides consistent card styling for the UI component library
 * Procedure: Renders a card container with predefined styles and variants
 * Conclusion: Ensures visual consistency across UI components
 */
import React from 'react';

/**
 * Card - AlphaFrame Design System
 * Props:
 * - variant: 'base' | 'dashboard' | 'rule'
 * - status: 'active' | 'inactive' | 'error' (for rule variant)
 * - header: ReactNode
 * - footer: ReactNode
 * - children: content
 * - className: string
 * - ...rest: other div props
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

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