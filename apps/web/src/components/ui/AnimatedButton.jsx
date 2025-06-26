import React from 'react';
import { motion } from 'framer-motion';
import { feedbackAnimations, transitions } from '../../lib/animations/animationPresets';
import './AnimatedButton.css';

/**
 * AnimatedButton - Enhanced button with motion feedback
 * 
 * Purpose: Provides engaging, responsive button interactions
 * with smooth animations and clear feedback states.
 * 
 * Procedure:
 * 1. Renders button with appropriate styling and variants
 * 2. Applies motion animations for hover, tap, and focus states
 * 3. Provides loading and disabled states with animations
 * 4. Ensures accessibility and performance compliance
 * 
 * Conclusion: Users receive clear, engaging feedback that
 * builds confidence in their interactions.
 */
const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonAnimation = () => {
    if (isDisabled) return {};
    
    return {
      ...feedbackAnimations.buttonPress,
      whileFocus: {
        scale: 1.02,
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
        transition: transitions.quick
      }
    };
  };

  const getLoadingAnimation = () => {
    if (!loading) return {};
    
    return {
      animate: {
        rotate: 360
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    };
  };

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`animated-button button-${variant} button-${size} ${className}`}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      {...getButtonAnimation()}
      {...props}
    >
      <div className="button-content">
        {icon && iconPosition === 'left' && (
          <motion.span 
            className="button-icon left"
            {...getLoadingAnimation()}
          >
            {icon}
          </motion.span>
        )}
        
        <span className="button-text">
          {loading ? 'Loading...' : children}
        </span>
        
        {icon && iconPosition === 'right' && (
          <motion.span 
            className="button-icon right"
            {...getLoadingAnimation()}
          >
            {icon}
          </motion.span>
        )}
      </div>
      
      {/* Ripple effect */}
      {!isDisabled && (
        <motion.div
          className="button-ripple"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton; 