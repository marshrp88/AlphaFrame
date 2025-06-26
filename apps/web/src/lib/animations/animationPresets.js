/**
 * Animation Presets - Consistent motion design system
 * 
 * Purpose: Provides standardized animation configurations for
 * consistent, meaningful motion across the AlphaFrame application.
 * 
 * Procedure:
 * 1. Defines reusable animation variants
 * 2. Creates transition configurations
 * 3. Provides gesture and interaction animations
 * 4. Ensures performance and accessibility compliance
 * 
 * Conclusion: Enables consistent, engaging motion that supports
 * user cognition and builds trust in the interface.
 */

import { cubicBezier } from 'framer-motion';

// Custom easing curves for natural motion
export const easings = {
  // Smooth, natural motion
  smooth: cubicBezier(0.4, 0, 0.2, 1),
  // Quick, responsive motion
  quick: cubicBezier(0.25, 0.46, 0.45, 0.94),
  // Bouncy, playful motion
  bouncy: cubicBezier(0.68, -0.55, 0.265, 1.55),
  // Stiff, mechanical motion
  stiff: cubicBezier(0.6, 0.01, 0.05, 0.95)
};

// Base transition configurations
export const transitions = {
  // Standard transition for most elements
  standard: {
    duration: 0.3,
    ease: easings.smooth
  },
  // Quick transition for interactive elements
  quick: {
    duration: 0.15,
    ease: easings.quick
  },
  // Slow transition for major state changes
  slow: {
    duration: 0.5,
    ease: easings.smooth
  },
  // Bouncy transition for success states
  bouncy: {
    duration: 0.4,
    ease: easings.bouncy
  }
};

// Page transition animations
export const pageTransitions = {
  // Fade in from center
  fadeIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: transitions.standard
  },
  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: transitions.standard
  },
  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: transitions.standard
  },
  // Slide up from bottom
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: transitions.standard
  }
};

// Component entrance animations
export const entranceAnimations = {
  // Fade in with slight scale
  fadeIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: transitions.standard
  },
  // Slide up with fade
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: transitions.standard
  },
  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: transitions.standard
  },
  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: transitions.standard
  },
  // Scale in with bounce
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: transitions.bouncy
  }
};

// Interactive feedback animations
export const feedbackAnimations = {
  // Success pulse animation
  successPulse: {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(34, 197, 94, 0)',
        '0 0 0 10px rgba(34, 197, 94, 0.3)',
        '0 0 0 0 rgba(34, 197, 94, 0)'
      ]
    },
    transition: {
      duration: 0.6,
      ease: easings.bouncy
    }
  },
  // Error shake animation
  errorShake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      rotate: [0, -2, 2, -2, 2, 0]
    },
    transition: {
      duration: 0.5,
      ease: easings.stiff
    }
  },
  // Loading pulse
  loadingPulse: {
    animate: {
      opacity: [0.6, 1, 0.6],
      scale: [0.98, 1, 0.98]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easings.smooth
    }
  },
  // Hover lift effect
  hoverLift: {
    whileHover: {
      y: -2,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      transition: transitions.quick
    },
    whileTap: {
      y: 0,
      scale: 0.98,
      transition: transitions.quick
    }
  },
  // Button press effect
  buttonPress: {
    whileHover: {
      scale: 1.02,
      transition: transitions.quick
    },
    whileTap: {
      scale: 0.98,
      transition: transitions.quick
    }
  }
};

// List and grid animations
export const listAnimations = {
  // Staggered list items
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  // Individual list item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: transitions.standard
  },
  // Grid items with stagger
  gridStagger: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  // Individual grid item
  gridItem: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: transitions.standard
  }
};

// Modal and overlay animations
export const modalAnimations = {
  // Modal backdrop
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.standard
  },
  // Modal content
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: transitions.standard
  },
  // Drawer from right
  drawerRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: transitions.standard
  },
  // Drawer from left
  drawerLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: transitions.standard
  }
};

// Progress and loading animations
export const progressAnimations = {
  // Progress bar fill
  progressFill: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: {
      duration: 1,
      ease: easings.smooth
    }
  },
  // Circular progress
  circularProgress: {
    animate: {
      rotate: 360
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  // Skeleton loading
  skeleton: {
    animate: {
      opacity: [0.6, 1, 0.6]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easings.smooth
    }
  }
};

// Gesture animations
export const gestureAnimations = {
  // Drag gesture
  drag: {
    drag: true,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.1,
    dragTransition: { bounceStiffness: 600, bounceDamping: 20 }
  },
  // Swipe gesture
  swipe: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },
  // Pan gesture
  pan: {
    onPan: () => {
      // Custom pan handling
    }
  }
};

// Utility functions for common animation patterns
export const animationUtils = {
  // Create staggered animation for multiple elements
  createStagger: (delay = 0.1, stagger = 0.1) => ({
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }),
  
  // Create entrance animation with custom delay
  createEntrance: (delay = 0, type = 'fadeIn') => ({
    ...entranceAnimations[type],
    transition: {
      ...entranceAnimations[type].transition,
      delay
    }
  }),
  
  // Create feedback animation for specific events
  createFeedback: (type = 'successPulse') => feedbackAnimations[type],
  
  // Create list animation with custom stagger
  createListAnimation: (stagger = 0.1) => ({
    ...listAnimations.staggerContainer,
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.1
      }
    }
  })
};

// Export all animations for easy importing
export default {
  easings,
  transitions,
  pageTransitions,
  entranceAnimations,
  feedbackAnimations,
  listAnimations,
  modalAnimations,
  progressAnimations,
  gestureAnimations,
  animationUtils
}; 