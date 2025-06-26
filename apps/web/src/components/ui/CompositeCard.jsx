/**
 * CompositeCard.jsx - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: A reusable card container component that uses design tokens
 * for consistent styling across all AlphaFrame views.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--card-padding, --card-border-radius, etc.)
 * 2. Supports title, subtitle, icon, and children props
 * 3. Implements hover effects with shadow transitions
 * 4. Provides grid layout and consistent spacing
 * 
 * Conclusion: Ensures visual consistency and enables easy theme switching
 * across all card-based layouts in the application.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './CompositeCard.css';

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
 */

/**
 * CompositeCard Component
 * @param {CompositeCardProps} props - Component props
 * @returns {JSX.Element} The rendered card component
 */
export function CompositeCard({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  interactive = false,
  className = '',
  onClick,
  ...props
}) {
  const cardClasses = [
    'composite-card',
    `composite-card--${variant}`,
    interactive && 'composite-card--interactive',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (interactive && onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(event) => {
        if (interactive && onClick && event.key === 'Enter') {
          onClick(event);
        }
      }}
      {...props}
    >
      {(title || subtitle || icon) && (
        <div className="composite-card__header">
          {icon && (
            <div className="composite-card__icon" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="composite-card__title-area">
            {title && (
              <h3 className="composite-card__title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="composite-card__subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="composite-card__content">
        {children}
      </div>
    </div>
  );
}

// PropTypes for runtime validation
CompositeCard.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  interactive: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

// Default props
CompositeCard.defaultProps = {
  variant: 'default',
  interactive: false,
  className: ''
};

export default CompositeCard; 