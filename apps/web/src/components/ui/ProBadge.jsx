/**
 * ProBadge.jsx - Feature Gating Component
 * 
 * Purpose: Clearly indicate Pro-only features and provide upgrade prompts
 * to guide users toward monetization conversion.
 * 
 * Procedure:
 * 1. Display lock icon with "Pro" label for gated features
 * 2. Show tooltip with upgrade information on hover
 * 3. Handle click events to navigate to upgrade page
 * 4. Track interaction analytics for conversion optimization
 * 
 * Conclusion: Creates clear visual boundaries between free and Pro features
 * while encouraging upgrades through value communication.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useToast } from './use-toast';

const ProBadge = ({ 
  variant = 'default', 
  size = 'sm', 
  showTooltip = true, 
  onClick,
  children,
  feature = 'this feature'
}) => {
  const [showTooltipContent, setShowTooltipContent] = useState(false);
  const { toast } = useToast();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick();
    } else {
      // Default upgrade flow
      toast({
        title: "Upgrade to Pro",
        description: `Unlock ${feature} and many more advanced features.`,
        variant: "default"
      });
      
      // Navigate to upgrade page
      window.location.href = '/upgrade';
    }
  };

  const handleMouseEnter = () => {
    if (showTooltip) {
      setShowTooltipContent(true);
    }
  };

  const handleMouseLeave = () => {
    if (showTooltip) {
      setShowTooltipContent(false);
    }
  };

  const getBadgeStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.75rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: size === 'sm' ? 'var(--font-size-xs)' : 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative'
    };

    switch (variant) {
      case 'premium':
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-primary-50)',
          color: 'var(--color-primary-700)',
          border: '1px solid var(--color-primary-200)'
        };
      case 'subtle':
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-muted-100)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-muted-200)'
        };
      case 'highlight':
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-warning-50)',
          color: 'var(--color-warning-700)',
          border: '1px solid var(--color-warning-200)'
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-primary-600)',
          color: 'white',
          border: '1px solid var(--color-primary-600)'
        };
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'premium':
        return <Crown size={size === 'sm' ? 12 : 14} />;
      case 'highlight':
        return <Sparkles size={size === 'sm' ? 12 : 14} />;
      default:
        return <Lock size={size === 'sm' ? 12 : 14} />;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.div
        style={getBadgeStyles()}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getIcon()}
        <span>Pro</span>
      </motion.div>

      {/* Tooltip */}
      {showTooltip && showTooltipContent && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '0.5rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            minWidth: '200px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem' }}>
            Upgrade to Pro
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Unlock {feature} and access advanced automation features
          </div>
          <button
            onClick={handleClick}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'var(--color-primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            View Plans
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Wrapper component for Pro-only content
export const ProFeature = ({ children, feature, fallback }) => {
  const isProUser = localStorage.getItem('alphaframe_pro_user') === 'true';
  
  if (isProUser) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return (
    <div style={{
      position: 'relative',
      filter: 'blur(2px)',
      pointerEvents: 'none',
      opacity: 0.6
    }}>
      {children}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}>
        <ProBadge variant="premium" feature={feature} />
      </div>
    </div>
  );
};

export default ProBadge; 