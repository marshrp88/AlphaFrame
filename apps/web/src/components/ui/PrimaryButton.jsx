/**
 * PrimaryButton.jsx - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: A reusable primary button component that uses design tokens
 * for consistent styling across all AlphaFrame views.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Supports multiple states: default, hover, disabled, loading
 * 3. Implements proper accessibility attributes
 * 4. Provides consistent button sizing and spacing
 * 
 * Conclusion: Ensures consistent button styling and behavior
 * across all user interactions in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './PrimaryButton.css';

/**
 * PrimaryButton Component Props
 * @typedef {Object} PrimaryButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {string} [variant] - Button variant ('primary', 'secondary', 'outline', 'ghost')
 * @property {string} [size] - Button size ('sm', 'md', 'lg')
 * @property {boolean} [disabled] - Whether the button is disabled
 * @property {boolean} [loading] - Whether the button is in loading state
 * @property {string} [type] - Button type ('button', 'submit', 'reset')
 * @property {Function} [onClick] - Click handler
 * @property {string} [className] - Additional CSS classes
 * @property {string} [icon] - Icon to display (optional)
 * @property {string} [iconPosition] - Icon position ('left', 'right')
 */

/**
 * PrimaryButton Component
 * @param {PrimaryButtonProps} props - Component props
 * @returns {JSX.Element} The rendered button component
 */
export function PrimaryButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) {
  const buttonClasses = [
    'primary-button',
    `primary-button--${variant}`,
    `primary-button--${size}`,
    loading && 'primary-button--loading',
    disabled && 'primary-button--disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = [
      'primary-button__icon',
      `primary-button__icon--${iconPosition}`
    ].join(' ');

    return (
      <span className={iconClasses} aria-hidden="true">
        {icon}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="primary-button__spinner" aria-hidden="true" />
          <span className="primary-button__loading-text">Loading...</span>
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        <span className="primary-button__text">{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
}

// PropTypes for runtime validation
PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

// Default props
PrimaryButton.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  iconPosition: 'left',
  className: ''
};

export default PrimaryButton; 