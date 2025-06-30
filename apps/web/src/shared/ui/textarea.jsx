/**
 * Textarea Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent textarea functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent textarea styling with proper states
 * 3. Support disabled states and accessibility
 * 4. Ensure proper resize behavior
 * 
 * Conclusion: Ensures uniform textarea behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './textarea.css';

const Textarea = ({ 
  className = '', 
  disabled = false,
  error = false,
  size = 'md',
  variant = 'default',
  resize = 'vertical',
  rows = 4,
  ...props 
}) => {
  return (
    <textarea
      className={cn(
        'textarea',
        `textarea-${size}`,
        `textarea-${variant}`,
        `textarea-resize-${resize}`,
        {
          'textarea-disabled': disabled,
          'textarea-error': error
        },
        className
      )}
      disabled={disabled}
      rows={rows}
      {...props}
    />
  );
};

export default Textarea; 
