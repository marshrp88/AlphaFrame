/**
 * Label Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent label functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent label styling with proper states
 * 3. Support different sizes and variants
 * 4. Ensure proper accessibility
 * 
 * Conclusion: Ensures uniform label behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './label.css';

const Label = ({ 
  children, 
  htmlFor,
  required = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'label',
        `label-${size}`,
        `label-${variant}`,
        {
          'label-required': required
        },
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="label-required-mark">*</span>}
    </label>
  );
};

export default Label; 