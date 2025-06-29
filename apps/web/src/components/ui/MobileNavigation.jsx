/**
 * MobileNavigation.jsx - AlphaFrame VX.1 Mobile-First Navigation
 * 
 * Purpose: A mobile-optimized bottom navigation component that provides
 * touch-friendly navigation with clear visual hierarchy and accessibility.
 * 
 * Procedure:
 * 1. Uses bottom navigation pattern for mobile devices
 * 2. Implements touch-friendly 44px minimum touch targets
 * 3. Provides clear visual feedback and active states
 * 4. Supports keyboard navigation and screen readers
 * 5. Includes haptic feedback patterns for mobile
 * 
 * Conclusion: Delivers an intuitive, accessible mobile navigation
 * that follows mobile UX best practices and WCAG guidelines.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Settings, 
  User, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import './MobileNavigation.css';

/**
 * MobileNavigation Component Props
 * @typedef {Object} MobileNavigationProps
 * @property {Array} items - Navigation items array
 * @property {boolean} [showFloatingAction] - Whether to show floating action button
 * @property {Function} [onFloatingAction] - Floating action button handler
 * @property {string} [floatingActionIcon] - Floating action icon
 * @property {string} [className] - Additional CSS classes
 */

/**
 * MobileNavigation Component
 * @param {MobileNavigationProps} props - Component props
 * @returns {JSX.Element} The rendered mobile navigation component
 */
const MobileNavigation = ({ 
  items = [], 
  showFloatingAction = false,
  onFloatingAction,
  floatingActionIcon = Plus,
  className = '',
  ...props 
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  // Handle floating action button
  const handleFloatingAction = () => {
    if (onFloatingAction) {
      onFloatingAction();
    }
  };

  // Handle haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration for feedback
    }
  };

  // Handle navigation item click
  const handleNavClick = (path) => {
    triggerHapticFeedback();
    setActiveTab(path);
    setIsMenuOpen(false);
  };

  // Default navigation items if none provided
  const defaultItems = [
    { path: '/', label: 'Home', icon: Home, badge: null },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { path: '/rules', label: 'Rules', icon: Settings, badge: null },
    { path: '/profile', label: 'Profile', icon: User, badge: null }
  ];

  const navigationItems = items.length > 0 ? items : defaultItems;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <motion.nav
        className={`mobile-navigation ${className}`}
        role="navigation"
        aria-label="Mobile navigation"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...props}
      >
        <div className="mobile-navigation__container">
          {/* Navigation Items */}
          <div className="mobile-navigation__items">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  className="mobile-navigation__item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `mobile-navigation__link ${isActive ? 'mobile-navigation__link--active' : ''}`
                    }
                    onClick={() => handleNavClick(item.path)}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="mobile-navigation__icon-container">
                      <IconComponent 
                        size={24} 
                        className="mobile-navigation__icon"
                        aria-hidden="true"
                      />
                      {item.badge && (
                        <span className="mobile-navigation__badge" aria-hidden="true">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="mobile-navigation__label">{item.label}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </div>

          {/* Floating Action Button */}
          {showFloatingAction && (
            <motion.div
              className="mobile-navigation__fab"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button
                className="mobile-navigation__fab-button"
                onClick={() => {
                  triggerHapticFeedback();
                  handleFloatingAction();
                }}
                aria-label="Quick action"
              >
                <Plus size={24} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay (for additional navigation) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-navigation__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="mobile-navigation__menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-navigation__menu-header">
                <h3>Menu</h3>
                <button
                  className="mobile-navigation__menu-close"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-navigation__menu-content">
                {/* Additional menu items can be added here */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation; 