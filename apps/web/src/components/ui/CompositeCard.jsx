/**
 * CompositeCard.jsx - Enhanced with Accessibility & Mobile Optimization
 * 
 * Purpose: A reusable card container component that uses design tokens
 * for consistent styling across all AlphaFrame views with comprehensive
 * accessibility features and mobile optimization.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--card-padding, --card-border-radius, etc.)
 * 2. Supports title, subtitle, icon, and children props
 * 3. Implements hover effects with shadow transitions
 * 4. Provides grid layout and consistent spacing
 * 5. Implements ARIA labels and roles for screen readers
 * 6. Supports keyboard navigation and focus management
 * 7. Provides mobile-first responsive design
 * 
 * Conclusion: Ensures visual consistency and enables easy theme switching
 * across all card-based layouts while maintaining accessibility and mobile usability.
 */

import React from 'react';
import './CompositeCard.css';
import '../../styles/design-tokens.css';

/**
 * CompositeCard Component Props
 * @typedef {Object} CompositeCardProps
 * @property {React.ReactNode} children - Card content
 * @property {string} [title] - Card title
 * @property {string} [subtitle] - Card subtitle
 * @property {React.ReactNode} [icon] - Card icon
 * @property {string} [variant] - Visual variant ('default', 'elevated', 'outlined')
 * @property {boolean} [interactive] - Whether card is interactive (hover effects)
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [onClick] - Click handler for interactive cards
 * @property {Object} [style] - Additional styles for the card
 * @property {string} [ariaLabel] - Custom ARIA label for screen readers
 * @property {string} [ariaDescribedBy] - ID of element that describes the card
 * @property {string} [role] - ARIA role for the card
 * @property {boolean} [loading] - Whether to show loading state
 * @property {boolean} [disabled] - Whether the card is disabled
 */

/**
 * CompositeCard Component
 * @param {CompositeCardProps} props - Component props
 * @returns {JSX.Element} The rendered card component
 */
const CompositeCard = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  interactive = false,
  className = '',
  onClick,
  style = {},
  ariaLabel,
  ariaDescribedBy,
  role,
  loading = false,
  disabled = false,
  ...props
}) => {
  const cardClasses = [
    'composite-card',
    `composite-card--${variant}`,
    interactive && 'composite-card--interactive',
    loading && 'composite-card--loading',
    disabled && 'composite-card--disabled',
    className
  ].filter(Boolean).join(' ');

  // Generate ARIA label if not provided
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (title) return title;
    if (interactive) return 'Interactive card';
    return 'Card content';
  };

  // Determine ARIA role
  const getAriaRole = () => {
    if (role) return role;
    if (interactive) return 'button';
    if (title) return 'region';
    return undefined;
  };

  const handleClick = (event) => {
    if (interactive && onClick && !loading && !disabled) {
      onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if (interactive && onClick && !loading && !disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(event);
      }
    }
  };

  // Card attributes for accessibility
  const cardAttributes = {
    className: cardClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: getAriaRole(),
    'aria-label': getAriaLabel(),
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    tabIndex: interactive && !disabled && !loading ? 0 : undefined,
    style: {
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-light)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing)',
      ...style,
    },
    ...props
  };

  return (
    <div {...cardAttributes}>
      {(title || subtitle || icon) && (
        <div className="composite-card__header">
          {icon && (
            <div 
              className="composite-card__icon" 
              aria-hidden="true"
              role="img"
              aria-label={typeof icon === 'string' ? icon : 'Card icon'}
            >
              {icon}
            </div>
          )}
          <div className="composite-card__title-area">
            {title && (
              <h3 
                className="composite-card__title"
                id={title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p 
                className="composite-card__subtitle"
                id={subtitle ? `card-subtitle-${subtitle.replace(/\s+/g, '-').toLowerCase()}` : undefined}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="composite-card__content"
        aria-labelledby={title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
        aria-describedby={subtitle ? `card-subtitle-${subtitle.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      >
        {loading ? (
          <div 
            className="composite-card__loading"
            role="status"
            aria-live="polite"
            aria-label="Loading card content"
          >
            <div className="composite-card__loading-spinner" aria-hidden="true"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default CompositeCard; 