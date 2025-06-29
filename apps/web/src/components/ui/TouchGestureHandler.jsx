/**
 * TouchGestureHandler.jsx - AlphaFrame VX.1 Mobile Touch Gestures
 * 
 * Purpose: A mobile-optimized touch gesture handler that provides
 * intuitive touch interactions with haptic feedback and accessibility.
 * 
 * Procedure:
 * 1. Implements common touch gestures (tap, long press, swipe)
 * 2. Provides haptic feedback for mobile devices
 * 3. Supports accessibility with keyboard alternatives
 * 4. Includes gesture recognition and visual feedback
 * 5. Optimizes for touch-friendly interactions
 * 
 * Conclusion: Delivers smooth, accessible touch interactions
 * that enhance the mobile user experience.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import PropTypes from 'prop-types';
import './TouchGestureHandler.css';

/**
 * TouchGestureHandler Component Props
 * @typedef {Object} TouchGestureHandlerProps
 * @property {React.ReactNode} children - Child components
 * @property {Function} [onTap] - Tap gesture handler
 * @property {Function} [onLongPress] - Long press gesture handler
 * @property {Function} [onSwipe] - Swipe gesture handler
 * @property {Function} [onSwipeLeft] - Swipe left handler
 * @property {Function} [onSwipeRight] - Swipe right handler
 * @property {Function} [onSwipeUp] - Swipe up handler
 * @property {Function} [onSwipeDown] - Swipe down handler
 * @property {number} [longPressDelay] - Long press delay in ms
 * @property {number} [swipeThreshold] - Swipe distance threshold
 * @property {boolean} [enableHaptic] - Enable haptic feedback
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [style] - Additional inline styles
 */

/**
 * TouchGestureHandler Component
 * @param {TouchGestureHandlerProps} props - Component props
 * @returns {JSX.Element} The rendered touch gesture handler
 */
const TouchGestureHandler = ({
  children,
  onTap,
  onLongPress,
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  longPressDelay = 500,
  swipeThreshold = 50,
  enableHaptic = true,
  className = '',
  style = {},
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  
  const longPressTimerRef = useRef(null);
  const elementRef = useRef(null);

  // Haptic feedback function
  const triggerHapticFeedback = useCallback((type = 'light') => {
    if (!enableHaptic || !('vibrate' in navigator)) return;
    
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [50, 100, 50],
      warning: [20, 100, 20]
    };
    
    navigator.vibrate(patterns[type] || patterns.light);
  }, [enableHaptic]);

  // Handle touch start
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    
    setStartPosition(position);
    setCurrentPosition(position);
    setIsPressed(true);
    
    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      triggerHapticFeedback('medium');
      onLongPress?.(event, position);
    }, longPressDelay);
  }, [longPressDelay, onLongPress, triggerHapticFeedback]);

  // Handle touch move
  const handleTouchMove = useCallback((event) => {
    const touch = event.touches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    
    setCurrentPosition(position);
    
    // Cancel long press if moved too much
    const distance = Math.sqrt(
      Math.pow(position.x - startPosition.x, 2) + 
      Math.pow(position.y - startPosition.y, 2)
    );
    
    if (distance > 10 && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      setIsLongPressing(false);
    }
  }, [startPosition]);

  // Handle touch end
  const handleTouchEnd = useCallback((event) => {
    const endPosition = currentPosition;
    const distance = Math.sqrt(
      Math.pow(endPosition.x - startPosition.x, 2) + 
      Math.pow(endPosition.y - startPosition.y, 2)
    );
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    setIsPressed(false);
    setIsLongPressing(false);
    
    // Determine gesture type
    if (distance < swipeThreshold) {
      // Tap gesture
      if (!isLongPressing) {
        triggerHapticFeedback('light');
        onTap?.(event, endPosition);
      }
    } else {
      // Swipe gesture
      const deltaX = endPosition.x - startPosition.x;
      const deltaY = endPosition.y - startPosition.y;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          triggerHapticFeedback('medium');
          onSwipeRight?.(event, { start: startPosition, end: endPosition });
        } else {
          triggerHapticFeedback('medium');
          onSwipeLeft?.(event, { start: startPosition, end: endPosition });
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          triggerHapticFeedback('medium');
          onSwipeDown?.(event, { start: startPosition, end: endPosition });
        } else {
          triggerHapticFeedback('medium');
          onSwipeUp?.(event, { start: startPosition, end: endPosition });
        }
      }
      
      // General swipe handler
      onSwipe?.(event, { start: startPosition, end: endPosition });
    }
  }, [currentPosition, startPosition, swipeThreshold, isLongPressing, onTap, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHapticFeedback]);

  // Handle mouse events for desktop
  const handleMouseDown = useCallback((event) => {
    if (event.button !== 0) return; // Only left mouse button
    
    const position = { x: event.clientX, y: event.clientY };
    setStartPosition(position);
    setCurrentPosition(position);
    setIsPressed(true);
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress?.(event, position);
    }, longPressDelay);
  }, [longPressDelay, onLongPress]);

  const handleMouseMove = useCallback((event) => {
    if (!isPressed) return;
    
    const position = { x: event.clientX, y: event.clientY };
    setCurrentPosition(position);
    
    const distance = Math.sqrt(
      Math.pow(position.x - startPosition.x, 2) + 
      Math.pow(position.y - startPosition.y, 2)
    );
    
    if (distance > 10 && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      setIsLongPressing(false);
    }
  }, [isPressed, startPosition]);

  const handleMouseUp = useCallback((event) => {
    if (!isPressed) return;
    
    const endPosition = currentPosition;
    const distance = Math.sqrt(
      Math.pow(endPosition.x - startPosition.x, 2) + 
      Math.pow(endPosition.y - startPosition.y, 2)
    );
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    setIsPressed(false);
    setIsLongPressing(false);
    
    if (distance < swipeThreshold) {
      if (!isLongPressing) {
        onTap?.(event, endPosition);
      }
    } else {
      const deltaX = endPosition.x - startPosition.x;
      const deltaY = endPosition.y - startPosition.y;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onSwipeRight?.(event, { start: startPosition, end: endPosition });
        } else {
          onSwipeLeft?.(event, { start: startPosition, end: endPosition });
        }
      } else {
        if (deltaY > 0) {
          onSwipeDown?.(event, { start: startPosition, end: endPosition });
        } else {
          onSwipeUp?.(event, { start: startPosition, end: endPosition });
        }
      }
      
      onSwipe?.(event, { start: startPosition, end: endPosition });
    }
  }, [isPressed, currentPosition, startPosition, swipeThreshold, isLongPressing, onTap, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        triggerHapticFeedback('light');
        onTap?.(event, { x: 0, y: 0 });
        break;
      case 'ArrowLeft':
        event.preventDefault();
        triggerHapticFeedback('medium');
        onSwipeLeft?.(event, { start: { x: 0, y: 0 }, end: { x: -1, y: 0 } });
        break;
      case 'ArrowRight':
        event.preventDefault();
        triggerHapticFeedback('medium');
        onSwipeRight?.(event, { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } });
        break;
      case 'ArrowUp':
        event.preventDefault();
        triggerHapticFeedback('medium');
        onSwipeUp?.(event, { start: { x: 0, y: 0 }, end: { x: 0, y: -1 } });
        break;
      case 'ArrowDown':
        event.preventDefault();
        triggerHapticFeedback('medium');
        onSwipeDown?.(event, { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } });
        break;
    }
  }, [onTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHapticFeedback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Add event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      ref={elementRef}
      className={`touch-gesture-handler ${className}`}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isPressed ? 0.98 : 1,
        backgroundColor: isLongPressing ? 'var(--color-primary-100)' : 'transparent'
      }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// PropTypes for runtime validation
TouchGestureHandler.propTypes = {
  children: PropTypes.node.isRequired,
  onTap: PropTypes.func,
  onLongPress: PropTypes.func,
  onSwipe: PropTypes.func,
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  onSwipeUp: PropTypes.func,
  onSwipeDown: PropTypes.func,
  longPressDelay: PropTypes.number,
  swipeThreshold: PropTypes.number,
  enableHaptic: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

// Default props
TouchGestureHandler.defaultProps = {
  longPressDelay: 500,
  swipeThreshold: 50,
  enableHaptic: true,
  className: '',
  style: {}
};

export default TouchGestureHandler; 