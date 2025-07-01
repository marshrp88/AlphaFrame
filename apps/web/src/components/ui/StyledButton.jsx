/**
 * StyledButton.jsx - AlphaFrame VX.1 Enhanced Button Component
 * 
 * Purpose: Professional button component with comprehensive state feedback,
 * smooth animations, and consistent design system integration.
 * 
 * Procedure:
 * 1. Enhanced hover, pressed, success, and error feedback states
 * 2. Smooth transitions and micro-interactions
 * 3. Consistent design system token usage
 * 4. Accessibility improvements with ARIA attributes
 * 5. Loading and disabled state handling
 * 
 * Conclusion: Delivers polished, responsive button interactions
 * that enhance user experience and maintain design consistency.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import './StyledButton.css';

/**
 * StyledButton - AlphaFrame Design System
 * Props:
 * - variant: 'primary' | 'secondary' | 'icon'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - loading: boolean
 * - icon: ReactNode (optional)
 * - iconPosition: 'left' | 'right' (for icon + label)
 * - ariaLabel: string (for icon-only)
 * - type: 'button' | 'submit' | 'reset'
 * - children: label text
 * - ...rest: other button props
 */
export default function StyledButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  ariaLabel,
  type = 'button',
  children,
  ...rest
}) {
  const isIconOnly = variant === 'icon' && !children;
  const className = [
    'styled-btn',
    `styled-btn--${variant}`,
    `styled-btn--${size}`,
    loading ? 'styled-btn--loading' : '',
    disabled ? 'styled-btn--disabled' : '',
    isIconOnly ? 'styled-btn--icon-only' : '',
  ].filter(Boolean).join(' ');

  // Determine button styles based on variant and size
  const getButtonStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      fontWeight: 'var(--font-weight-medium)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      textDecoration: 'none',
      fontFamily: 'var(--font-family-primary)',
    };

    // Size variations
    const sizeStyles = {
      sm: {
        padding: 'var(--spacing-2) var(--spacing-3)',
        fontSize: 'var(--font-size-sm)',
        minHeight: '32px'
      },
      md: {
        padding: 'var(--spacing-3) var(--spacing-4)',
        fontSize: 'var(--font-size-base)',
        minHeight: '40px'
      },
      lg: {
        padding: 'var(--spacing-4) var(--spacing-6)',
        fontSize: 'var(--font-size-lg)',
        minHeight: '48px'
      }
    };

    // Variant styles with enhanced feedback states
    const variantStyles = {
      primary: {
        background: 'var(--color-primary-600)',
        color: 'var(--color-white)',
        boxShadow: 'var(--shadow-sm)',
        '&:hover': {
          background: 'var(--color-primary-700)',
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          background: 'var(--color-primary-800)',
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-sm)'
        },
        '&:focus': {
          outline: '2px solid var(--color-primary-500)',
          outlineOffset: '2px'
        }
      },
      secondary: {
        background: 'var(--color-secondary-600)',
        color: 'var(--color-white)',
        boxShadow: 'var(--shadow-sm)',
        '&:hover': {
          background: 'var(--color-secondary-700)',
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          background: 'var(--color-secondary-800)',
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-sm)'
        },
        '&:focus': {
          outline: '2px solid var(--color-secondary-500)',
          outlineOffset: '2px'
        }
      },
      outline: {
        background: 'transparent',
        color: 'var(--color-primary-600)',
        border: '2px solid var(--color-primary-600)',
        '&:hover': {
          background: 'var(--color-primary-50)',
          borderColor: 'var(--color-primary-700)',
          transform: 'translateY(-1px)',
          boxShadow: 'var(--shadow-sm)'
        },
        '&:active': {
          background: 'var(--color-primary-100)',
          transform: 'translateY(0)'
        },
        '&:focus': {
          outline: '2px solid var(--color-primary-500)',
          outlineOffset: '2px'
        }
      },
      ghost: {
        background: 'transparent',
        color: 'var(--color-text-primary)',
        '&:hover': {
          background: 'var(--color-background-secondary)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          background: 'var(--color-background-tertiary)',
          transform: 'translateY(0)'
        },
        '&:focus': {
          outline: '2px solid var(--color-primary-500)',
          outlineOffset: '2px'
        }
      },
      success: {
        background: 'var(--color-success-600)',
        color: 'var(--color-white)',
        boxShadow: 'var(--shadow-sm)',
        '&:hover': {
          background: 'var(--color-success-700)',
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          background: 'var(--color-success-800)',
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-sm)'
        },
        '&:focus': {
          outline: '2px solid var(--color-success-500)',
          outlineOffset: '2px'
        }
      },
      destructive: {
        background: 'var(--color-error-600)',
        color: 'var(--color-white)',
        boxShadow: 'var(--shadow-sm)',
        '&:hover': {
          background: 'var(--color-error-700)',
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-1px)'
        },
        '&:active': {
          background: 'var(--color-error-800)',
          transform: 'translateY(0)',
          boxShadow: 'var(--shadow-sm)'
        },
        '&:focus': {
          outline: '2px solid var(--color-error-500)',
          outlineOffset: '2px'
        }
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  // Handle disabled and loading states
  const isDisabled = disabled || loading;
  const buttonStyles = getButtonStyles();

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Loader2 
        size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
        className="loading-spinner"
      />
    </motion.div>
  );

  return (
    <motion.button
      type={type}
      className={`styled-button ${className}`}
      style={buttonStyles}
      disabled={isDisabled}
      aria-label={isIconOnly ? ariaLabel : undefined}
      aria-busy={loading ? 'true' : undefined}
      tabIndex={disabled ? -1 : 0}
      {...rest}
      whileHover={!isDisabled ? { 
        scale: 1.02,
        transition: { duration: 0.1 }
      } : {}}
      whileTap={!isDisabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isDisabled ? 0.6 : 1,
        scale: 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Ripple effect background */}
      <motion.div
        className="button-ripple"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ 
          scale: 2, 
          opacity: [0, 0.3, 0],
          transition: { duration: 0.4 }
        }}
      />
      
      {/* Content */}
      <motion.div
        className="button-content"
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {loading && <LoadingSpinner />}
        {icon && iconPosition === 'left' && (
          <span className="styled-btn__icon styled-btn__icon--left">{icon}</span>
        )}
        {children && <span className="styled-btn__label">{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className="styled-btn__icon styled-btn__icon--right">{icon}</span>
        )}
      </motion.div>
    </motion.button>
  );
} 