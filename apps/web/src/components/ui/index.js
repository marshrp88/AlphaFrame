/**
 * UI Components Index - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: Central export file for all design system components
 * to enable clean imports throughout the AlphaFrame application.
 * 
 * Procedure:
 * 1. Exports all new design system components
 * 2. Provides both named and default exports
 * 3. Enables tree-shaking for optimal bundle size
 * 4. Maintains backward compatibility with existing imports
 * 
 * Conclusion: Simplifies component imports and ensures
 * consistent usage patterns across the application.
 */

// Design System Components
export { default as CompositeCard } from './CompositeCard';
export { default as PrimaryButton } from './PrimaryButton';
export { default as InputField } from './InputField';

// Showcase Component (for development/testing)
export { default as ComponentShowcase } from './ComponentShowcase';

// Re-export existing components for compatibility
export { default as Card } from './Card';
export { default as Button } from './Button';

// Design tokens (if needed for programmatic access)
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: 'var(--color-primary-50, #eff6ff)',
      100: 'var(--color-primary-100, #dbeafe)',
      200: 'var(--color-primary-200, #bfdbfe)',
      300: 'var(--color-primary-300, #93c5fd)',
      400: 'var(--color-primary-400, #60a5fa)',
      500: 'var(--color-primary-500, #3b82f6)',
      600: 'var(--color-primary-600, #2563eb)',
      700: 'var(--color-primary-700, #1d4ed8)',
      800: 'var(--color-primary-800, #1e40af)',
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
    white: 'var(--color-white, #ffffff)',
    black: 'var(--color-black, #000000)'
  },
  spacing: {
    xs: 'var(--spacing-xs, 0.5rem)',
    sm: 'var(--spacing-sm, 0.75rem)',
    md: 'var(--spacing-md, 1rem)',
    lg: 'var(--spacing-lg, 1.5rem)',
    xl: 'var(--spacing-xl, 2rem)',
    '2xl': 'var(--spacing-2xl, 3rem)'
  },
  typography: {
    fontFamily: {
      primary: 'var(--font-family-primary, "Inter", sans-serif)',
      mono: 'var(--font-family-mono, "Monaco", "Menlo", monospace)'
    },
    fontSize: {
      xs: 'var(--font-size-xs, 0.75rem)',
      sm: 'var(--font-size-sm, 0.875rem)',
      base: 'var(--font-size-base, 1rem)',
      lg: 'var(--font-size-lg, 1.125rem)',
      xl: 'var(--font-size-xl, 1.25rem)',
      '2xl': 'var(--font-size-2xl, 1.5rem)',
      '3xl': 'var(--font-size-3xl, 1.875rem)'
    },
    fontWeight: {
      normal: 'var(--font-weight-normal, 400)',
      medium: 'var(--font-weight-medium, 500)',
      semibold: 'var(--font-weight-semibold, 600)',
      bold: 'var(--font-weight-bold, 700)'
    }
  },
  borderRadius: {
    sm: 'var(--border-radius-sm, 0.25rem)',
    md: 'var(--border-radius-md, 0.5rem)',
    lg: 'var(--border-radius-lg, 0.75rem)',
    xl: 'var(--border-radius-xl, 1rem)',
    full: 'var(--border-radius-full, 9999px)'
  },
  shadows: {
    sm: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    md: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
    lg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
    xl: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))'
  },
  transitions: {
    fast: 'var(--transition-duration-fast, 0.15s)',
    normal: 'var(--transition-duration-normal, 0.3s)',
    slow: 'var(--transition-duration-slow, 0.5s)',
    easing: 'var(--transition-easing, ease-in-out)'
  }
};

// Component variants and sizes for type safety
export const COMPONENT_VARIANTS = {
  button: ['primary', 'secondary', 'outline', 'ghost'],
  input: ['sm', 'md', 'lg'],
  card: ['default', 'elevated', 'outlined']
};

// Utility function to validate component props
export const validateComponentProps = (component, props, requiredProps = []) => {
  const missingProps = requiredProps.filter(prop => !(prop in props));
  
  if (missingProps.length > 0) {
    console.warn(
      `[${component}] Missing required props: ${missingProps.join(', ')}`
    );
    return false;
  }
  
  return true;
};

// Default export for convenience
export default {
  CompositeCard,
  PrimaryButton,
  InputField,
  ComponentShowcase,
  Card,
  Button,
  DESIGN_TOKENS,
  COMPONENT_VARIANTS,
  validateComponentProps
}; 