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
import './Card.css';

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
export default function Card({
  variant = 'base',
  status,
  header,
  footer,
  children,
  className = '',
  ...rest
}) {
  const cardClass = [
    'card',
    `card--${variant}`,
    status ? `card--${status}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} tabIndex={0} {...rest}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__content">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
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