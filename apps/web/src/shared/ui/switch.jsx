/**
 * Switch Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent toggle switch functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent switch styling with proper states
 * 3. Support disabled states and accessibility
 * 4. Ensure proper focus management
 * 
 * Conclusion: Ensures uniform switch behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './switch.css';

const Switch = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        'switch',
        `switch-${size}`,
        {
          'switch-checked': checked,
          'switch-disabled': disabled
        },
        className
      )}
      onClick={() => !disabled && onChange?.(!checked)}
      {...props}
    >
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
    </button>
  );
};

export default Switch; 
