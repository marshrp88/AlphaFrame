/**
 * Radio Group Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent radio group functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent radio styling with proper states
 * 3. Support disabled states and accessibility
 * 4. Ensure proper focus management
 * 
 * Conclusion: Ensures uniform radio behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './radio-group.css';

const RadioGroup = ({ 
  children, 
  className = '', 
  orientation = 'vertical',
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'radio-group',
        `radio-group-${orientation}`,
        className
      )}
      role="radiogroup"
      {...props}
    >
      {children}
    </div>
  );
};

const RadioItem = ({ 
  children, 
  value, 
  checked, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <label className={cn('radio-item', { 'radio-item-disabled': disabled }, className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="radio-input"
        {...props}
      />
      <span className="radio-control" />
      <span className="radio-label">{children}</span>
    </label>
  );
};

export { RadioGroup, RadioItem };
export default RadioGroup; 
