/**
 * UI Components Index - AlphaFrame VX.3 Production Ready
 * 
 * Purpose: Central export file for all design system components
 * providing easy importing and tree-shaking support for production.
 * 
 * Procedure:
 * 1. Exports all production-ready components with proper naming
 * 2. Removes unused or deprecated component exports
 * 3. Provides both named and default exports for flexibility
 * 4. Maintains clean import paths for developers
 * 5. Includes mobile-optimized components
 * 
 * Conclusion: Creates a single entry point for all design system
 * components with proper JavaScript module exports for production.
 */

// Core UI Components
export { default as CompositeCard } from './CompositeCard.jsx';
export { default as Card } from './Card.jsx';
export { default as StyledButton } from './StyledButton.jsx';
export { default as Button } from './Button.jsx';
export { default as PrimaryButton } from './PrimaryButton.jsx';
export { default as AnimatedButton } from './AnimatedButton.jsx';

// Form Components
export { default as InputField } from './InputField.jsx';
export { default as Input } from './Input.jsx';
export { default as Label } from './Label.jsx';
export { default as textarea } from './textarea.jsx';
export { default as Select } from './Select.jsx';
export { default as Checkbox } from './Checkbox.jsx';
export { default as switch } from './switch.jsx';
export { default as badge } from './badge.jsx';

// Navigation Components
export { default as NavBar } from './NavBar.jsx';
export { default as Tabs } from './Tabs.jsx';
export { default as Dropdown } from './Dropdown.jsx';

// Modal & Overlay Components
export { default as Modal } from './Modal.jsx';
export { default as ModalDialog } from './ModalDialog.jsx';
export { default as tooltip } from './tooltip.jsx';

// Feedback Components
export { default as ToastAlert } from './ToastAlert.jsx';
export { default as AnimatedToast } from './AnimatedToast.jsx';
export { default as StatusBadge } from './StatusBadge.jsx';
export { default as useToast } from './use-toast.jsx';

// Mobile-Optimized Components
export { default as MobileNavigation } from './MobileNavigation.jsx';
export { default as MobileForm } from './MobileForm.jsx';
export { default as TouchGestureHandler } from './TouchGestureHandler.jsx';

// Utility Components
export { default as DarkModeToggle } from './DarkModeToggle.jsx';
export { default as PerformanceMonitor } from './PerformanceMonitor.jsx';
export { default as ComponentShowcase } from './ComponentShowcase.jsx';

// Design Tokens (for reference)
export const designTokens = {
  colors: {
    primary: {
      50: 'var(--color-primary-50, #eff6ff)',
      100: 'var(--color-primary-100, #dbeafe)',
      500: 'var(--color-primary-500, #3b82f6)',
      600: 'var(--color-primary-600, #2563eb)',
      700: 'var(--color-primary-700, #1d4ed8)',
      900: 'var(--color-primary-900, #1e3a8a)'
    },
    gray: {
      50: 'var(--color-gray-50, #f9fafb)',
      100: 'var(--color-gray-100, #f3f4f6)',
      200: 'var(--color-gray-200, #e5e7eb)',
      300: 'var(--color-gray-300, #d1d5db)',
      400: 'var(--color-gray-400, #9ca3af)',
      500: 'var(--color-gray-500, #6b7280)',
      600: 'var(--color-gray-600, #4b5563)',
      700: 'var(--color-gray-700, #374151)',
      800: 'var(--color-gray-800, #1f2937)',
      900: 'var(--color-gray-900, #111827)'
    },
    red: {
      400: 'var(--color-red-400, #f87171)',
      500: 'var(--color-red-500, #ef4444)',
      600: 'var(--color-red-600, #dc2626)',
      700: 'var(--color-red-700, #b91c1c)'
    }
  },
  spacing: {
    xs: 'var(--spacing-xs, 0.5rem)',
    sm: 'var(--spacing-sm, 0.75rem)',
    md: 'var(--spacing-md, 1rem)',
    lg: 'var(--spacing-lg, 1.5rem)',
    xl: 'var(--spacing-xl, 2rem)'
  },
  borderRadius: {
    sm: 'var(--border-radius-sm, 0.25rem)',
    md: 'var(--border-radius-md, 0.5rem)',
    lg: 'var(--border-radius-lg, 0.75rem)',
    full: 'var(--border-radius-full, 9999px)'
  },
  fontSize: {
    xs: 'var(--font-size-xs, 0.75rem)',
    sm: 'var(--font-size-sm, 0.875rem)',
    base: 'var(--font-size-base, 1rem)',
    lg: 'var(--font-size-lg, 1.125rem)',
    xl: 'var(--font-size-xl, 1.25rem)'
  },
  fontWeight: {
    normal: 'var(--font-weight-normal, 400)',
    medium: 'var(--font-weight-medium, 500)',
    semibold: 'var(--font-weight-semibold, 600)',
    bold: 'var(--font-weight-bold, 700)'
  },
  transition: {
    fast: 'var(--transition-duration-fast, 0.15s)',
    normal: 'var(--transition-duration-normal, 0.3s)',
    easing: 'var(--transition-easing, ease-in-out)'
  },
  shadow: {
    sm: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    md: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
    lg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
    xl: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))'
  },
  zIndex: {
    dropdown: 'var(--z-index-dropdown, 100)',
    modal: 'var(--z-index-modal, 1000)'
  }
}; 