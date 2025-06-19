/**
 * CardSection.jsx
 * 
 * Purpose: Reusable section wrapper component for organizing content
 * into consistent card-based layouts across AlphaPro features.
 * 
 * Procedure:
 * - Provides standardized header with optional icon and title
 * - Supports flexible content area with consistent spacing
 * - Implements theme-aware styling and accessibility features
 * - Includes loading states and error handling
 * 
 * Conclusion: Ensures visual consistency and improved content organization
 */

import React from 'react';
import { Icon } from './Icon.jsx';
import './CardSection.css';

/**
 * CardSection - Reusable section wrapper with header and content area
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} [props.icon] - Icon name to display
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.variant] - Visual variant ('default', 'highlighted', 'compact')
 * @param {boolean} [props.loading] - Whether to show loading state
 * @param {boolean} [props.collapsible] - Whether section can be collapsed
 * @param {boolean} [props.defaultCollapsed] - Whether section starts collapsed
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.headerProps] - Props to pass to header element
 */
export const CardSection = ({
  title,
  icon,
  children,
  variant = 'default',
  loading = false,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  headerProps = {},
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isExpanded, setIsExpanded] = React.useState(!defaultCollapsed);

  // Handle collapse/expand functionality
  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
      setIsExpanded(!isExpanded);
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <section 
      className={`card-section card-section--${variant} ${className}`}
      aria-expanded={isExpanded}
      {...props}
    >
      <header 
        className={`card-section__header ${collapsible ? 'card-section__header--collapsible' : ''}`}
        {...headerProps}
      >
        <div className="card-section__title-area">
          {icon && (
            <Icon 
              name={icon} 
              className="card-section__icon"
              aria-hidden="true"
            />
          )}
          <h2 className="card-section__title">
            {title}
          </h2>
        </div>
        
        {collapsible && (
          <button
            type="button"
            className="card-section__toggle"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
          >
            <Icon 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              className="card-section__toggle-icon"
              aria-hidden="true"
            />
          </button>
        )}
      </header>
      
      <div 
        className={`card-section__content ${isCollapsed ? 'card-section__content--collapsed' : ''}`}
        aria-hidden={isCollapsed}
      >
        {loading ? (
          <div className="card-section__loading" role="status" aria-live="polite">
            <div className="card-section__loading-spinner" aria-hidden="true"></div>
            <span>Loading {title.toLowerCase()}...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

// Export for use in other components
export default CardSection; 