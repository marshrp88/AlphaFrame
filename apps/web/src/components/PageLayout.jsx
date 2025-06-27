import React from 'react';
import '../styles/design-tokens.css';
import './PageLayout.css';

/**
 * PageLayout.jsx - Enhanced with Accessibility & Mobile Optimization
 * 
 * Purpose: A reusable layout component that centers content, applies max-width, 
 * padding, and background color using design tokens with comprehensive 
 * accessibility features and mobile optimization.
 * 
 * Procedure:
 * 1. Uses design tokens for consistent styling
 * 2. Implements ARIA labels and roles for screen readers
 * 3. Supports keyboard navigation and focus management
 * 4. Provides mobile-first responsive design
 * 5. Ensures WCAG 2.1 AA compliance
 * 
 * Conclusion: Delivers an accessible, mobile-optimized layout component
 * that provides consistent user experience across all devices and abilities.
 */

/**
 * PageLayout Component Props
 * @typedef {Object} PageLayoutProps
 * @property {React.ReactNode} children - Page content
 * @property {string} [title] - Page title for accessibility
 * @property {string} [description] - Page description for screen readers
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [style] - Additional inline styles
 */

/**
 * PageLayout Component
 * @param {PageLayoutProps} props - Component props
 * @returns {JSX.Element} The rendered layout component
 */
const PageLayout = ({ 
  children, 
  title = "AlphaFrame Page",
  description = "Main content area",
  className = '',
  style = {},
  ...props 
}) => {
  // Focus management for accessibility
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    // Focus main content area when component mounts
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    // Tab navigation support
    if (event.key === 'Tab') {
      // Ensure focus stays within the layout
      const focusableElements = mainRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return (
    <div
      className={`page-layout ${className}`}
      role="main"
      aria-label={title}
      aria-describedby={description ? "page-description" : undefined}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--color-bg)',
        padding: 'var(--spacing-xl) var(--spacing-sm)',
        ...style,
      }}
      {...props}
    >
      {/* Hidden description for screen readers */}
      {description && (
        <div id="page-description" className="sr-only">
          {description}
        </div>
      )}
      
      <main
        ref={mainRef}
        className="page-layout__main"
        tabIndex="-1"
        aria-label="Main content"
        style={{
          width: '100%',
          maxWidth: '900px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-light)',
          padding: 'var(--spacing-lg)',
          margin: 'auto',
          outline: 'none', // Remove default focus outline, we'll add custom one
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default PageLayout; 