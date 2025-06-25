/**
 * Tabs.jsx - AlphaFrame Phase X Sprint 2
 * 
 * Purpose: A reusable tabs component that uses design tokens
 * for consistent styling and provides advanced navigation patterns.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Implements proper accessibility with keyboard navigation and ARIA attributes
 * 3. Supports multiple tab orientations and variants
 * 4. Provides smooth animations and focus management
 * 
 * Conclusion: Creates a polished, accessible tabs component
 * that maintains visual consistency throughout the application.
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

/**
 * Tabs Component Props
 * @typedef {Object} TabsProps
 * @property {Array} tabs - Array of tab objects
 * @property {string} [defaultTab] - Default active tab ID
 * @property {Function} [onTabChange] - Tab change handler
 * @property {string} [orientation] - Tab orientation ('horizontal', 'vertical')
 * @property {string} [variant] - Tab variant ('default', 'pills', 'underline')
 * @property {string} [size] - Tab size ('sm', 'md', 'lg')
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [disabled] - Whether tabs are disabled
 */

/**
 * Tabs Component
 * @param {TabsProps} props - Component props
 * @returns {JSX.Element} The rendered tabs component
 */
export function Tabs({
  tabs = [],
  defaultTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id || ''));

  // Handle tab selection
  const handleTabClick = useCallback((tabId) => {
    if (!disabled && tabId !== activeTab) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  }, [disabled, activeTab, onTabChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event, tabId) => {
    if (disabled) return;

    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabClick(tabId);
        return;
    }

    if (nextIndex !== currentIndex) {
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.id);
        onTabChange?.(nextTab.id);
      }
    }
  }, [disabled, tabs, handleTabClick, onTabChange]);

  // Get active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const tabsClasses = [
    'tabs',
    `tabs--${orientation}`,
    `tabs--${variant}`,
    `tabs--${size}`,
    disabled && 'tabs--disabled',
    className
  ].filter(Boolean).join(' ');

  const tabListClasses = [
    'tabs__list',
    `tabs__list--${orientation}`,
    `tabs__list--${variant}`,
    `tabs__list--${size}`
  ].filter(Boolean).join(' ');

  const renderTab = (tab) => {
    const isActive = tab.id === activeTab;
    const isDisabled = disabled || tab.disabled;

    const tabClasses = [
      'tabs__tab',
      `tabs__tab--${orientation}`,
      `tabs__tab--${variant}`,
      `tabs__tab--${size}`,
      isActive && 'tabs__tab--active',
      isDisabled && 'tabs__tab--disabled'
    ].filter(Boolean).join(' ');

    return (
      <button
        key={tab.id}
        className={tabClasses}
        onClick={() => handleTabClick(tab.id)}
        onKeyDown={(e) => handleKeyDown(e, tab.id)}
        disabled={isDisabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${tab.id}`}
        id={`tab-${tab.id}`}
        tabIndex={isActive ? 0 : -1}
      >
        {tab.icon && (
          <span className="tabs__tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
        )}
        <span className="tabs__tab-label">{tab.label}</span>
        {tab.badge && (
          <span className="tabs__tab-badge" aria-hidden="true">
            {tab.badge}
          </span>
        )}
      </button>
    );
  };

  const renderTabPanel = (tab) => {
    const isActive = tab.id === activeTab;

    const panelClasses = [
      'tabs__panel',
      `tabs__panel--${orientation}`,
      isActive && 'tabs__panel--active'
    ].filter(Boolean).join(' ');

    return (
      <div
        key={tab.id}
        className={panelClasses}
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
        hidden={!isActive}
      >
        {isActive && tab.content}
      </div>
    );
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={tabsClasses} {...props}>
      <div
        className={tabListClasses}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map(renderTab)}
      </div>
      
      <div className="tabs__content">
        {tabs.map(renderTabPanel)}
      </div>
    </div>
  );
}

// PropTypes for runtime validation
Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.node,
      disabled: PropTypes.bool
    })
  ).isRequired,
  defaultTab: PropTypes.string,
  onTabChange: PropTypes.func,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['default', 'pills', 'underline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool
};

// Default props
Tabs.defaultProps = {
  tabs: [],
  orientation: 'horizontal',
  variant: 'default',
  size: 'md',
  className: '',
  disabled: false
};

export default Tabs; 