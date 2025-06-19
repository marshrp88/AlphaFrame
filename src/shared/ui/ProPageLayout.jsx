/**
 * ProPageLayout.jsx
 * 
 * Purpose: Shared layout component for all AlphaPro pages with consistent
 * styling, accessibility features, and theme support.
 * 
 * Procedure:
 * - Provides consistent header, main content area, and footer
 * - Supports focus management and keyboard navigation
 * - Implements theme-aware styling with dark mode support
 * - Includes accessibility features for screen readers
 * 
 * Conclusion: Ensures consistent user experience across all Pro features
 */

import React from 'react';
import { ProHeader } from './ProHeader.jsx';
import { ProFooter } from './ProFooter.jsx';
import './ProPageLayout.css';

/**
 * ProPageLayout - Main layout wrapper for AlphaPro pages
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.mode] - Layout mode ('planner', 'investor', 'minimalist')
 * @param {boolean} [props.showHeader=true] - Whether to show the header
 * @param {boolean} [props.showFooter=true] - Whether to show the footer
 * @param {string} [props.className] - Additional CSS classes
 */
export const ProPageLayout = ({ 
  title, 
  children, 
  mode = 'planner',
  showHeader = true,
  showFooter = true,
  className = '',
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
      className={`layout-pro layout-pro--${mode} ${className}`}
      role="main"
      aria-label={`AlphaPro ${title} page`}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {showHeader && (
        <ProHeader 
          title={title} 
          mode={mode}
          aria-label="Page header"
        />
      )}
      
      <main 
        ref={mainRef}
        className="layout-pro__content"
        tabIndex="-1"
        aria-label="Main content"
      >
        {children}
      </main>
      
      {showFooter && (
        <ProFooter 
          mode={mode}
          aria-label="Page footer"
        />
      )}
    </div>
  );
};

// Export for use in other components
export default ProPageLayout; 