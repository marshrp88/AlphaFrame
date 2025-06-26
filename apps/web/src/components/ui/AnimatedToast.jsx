import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions } from '../../lib/animations/animationPresets';
import './AnimatedToast.css';

/**
 * AnimatedToast - Enhanced toast notifications with motion
 * 
 * Purpose: Provides immediate, context-sensitive feedback to users
 * with smooth animations and clear visual hierarchy.
 * 
 * Procedure:
 * 1. Renders toast with appropriate styling based on type
 * 2. Animates entrance and exit with Framer Motion
 * 3. Provides interactive dismissal options
 * 4. Ensures accessibility and performance
 * 
 * Conclusion: Users receive clear, engaging feedback that builds
 * trust and confidence in the application.
 */
const AnimatedToast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 4000, 
  onClose, 
  isVisible = true 
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-primary)';
      default: return 'var(--color-primary)';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`animated-toast toast-${type}`}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={transitions.standard}
          whileHover={{ y: -2 }}
          style={{ borderLeftColor: getToastColor(type) }}
        >
          <div className="toast-content">
            <div className="toast-icon">
              {getToastIcon(type)}
            </div>
            <div className="toast-text">
              {title && <h4 className="toast-title">{title}</h4>}
              {message && <p className="toast-message">{message}</p>}
            </div>
            <button 
              className="toast-close"
              onClick={onClose}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
          
          {/* Progress bar */}
          {duration && (
            <motion.div
              className="toast-progress"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedToast; 