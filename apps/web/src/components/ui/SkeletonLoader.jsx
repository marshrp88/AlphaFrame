/**
 * SkeletonLoader.jsx - AlphaFrame VX.1 Skeleton Loading Component
 * 
 * Purpose: Provides smooth, animated skeleton loading states for
 * content areas, cards, and data displays during loading operations.
 * 
 * Procedure:
 * 1. Create animated skeleton placeholders with shimmer effect
 * 2. Support multiple shapes (text, circle, rectangle)
 * 3. Configurable dimensions and animation timing
 * 4. Consistent design system integration
 * 5. Accessibility considerations for screen readers
 * 
 * Conclusion: Delivers professional loading states that maintain
 * visual hierarchy and reduce perceived loading time.
 */

import React from 'react';
import { motion } from 'framer-motion';
import './SkeletonLoader.css';

const SkeletonLoader = ({
  type = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  style = {},
  count = 1,
  ...props
}) => {
  // Animation variants for shimmer effect
  const shimmerVariants = {
    initial: {
      x: '-100%',
      opacity: 0.3
    },
    animate: {
      x: '100%',
      opacity: 0.6,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Base skeleton styles
  const baseStyles = {
    background: 'var(--color-background-secondary)',
    borderRadius: type === 'circle' ? '50%' : 'var(--radius-md)',
    position: 'relative',
    overflow: 'hidden',
    width,
    height,
    ...style
  };

  // Render skeleton based on type
  const renderSkeleton = () => {
    switch (type) {
      case 'circle':
        return (
          <motion.div
            className={`skeleton-loader skeleton-circle ${className}`}
            style={baseStyles}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            {...props}
          >
            <motion.div
              className="skeleton-shimmer"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        );

      case 'card':
        return (
          <motion.div
            className={`skeleton-loader skeleton-card ${className}`}
            style={{
              ...baseStyles,
              padding: 'var(--spacing-4)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            {...props}
          >
            {/* Card header skeleton */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
              <motion.div
                className="skeleton-circle"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  className="skeleton-shimmer"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
              <div style={{ flex: 1 }}>
                <motion.div
                  className="skeleton-text"
                  style={{
                    height: '1rem',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--spacing-2)',
                    width: '60%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    className="skeleton-shimmer"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
                <motion.div
                  className="skeleton-text"
                  style={{
                    height: '0.875rem',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    width: '40%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    className="skeleton-shimmer"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Card content skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="skeleton-text"
                  style={{
                    height: '0.875rem',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    width: `${80 - (i * 10)}%`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    className="skeleton-shimmer"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'list':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {Array.from({ length: count }).map((_, index) => (
              <motion.div
                key={index}
                className={`skeleton-loader skeleton-list-item ${className}`}
                style={{
                  ...baseStyles,
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 'var(--radius-lg)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                {...props}
              >
                <motion.div
                  className="skeleton-circle"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--color-background-secondary)',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    className="skeleton-shimmer"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
                <div style={{ flex: 1 }}>
                  <motion.div
                    className="skeleton-text"
                    style={{
                      height: '1rem',
                      background: 'var(--color-background-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: 'var(--spacing-1)',
                      width: '70%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      className="skeleton-shimmer"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </motion.div>
                  <motion.div
                    className="skeleton-text"
                    style={{
                      height: '0.75rem',
                      background: 'var(--color-background-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      width: '50%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      className="skeleton-shimmer"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      default: // text
        return (
          <motion.div
            className={`skeleton-loader skeleton-text ${className}`}
            style={baseStyles}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            {...props}
          >
            <motion.div
              className="skeleton-shimmer"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader; 