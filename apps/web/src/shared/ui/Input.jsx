/**
 * Input Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent text input functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes from Input.css that reference design tokens
 * 2. Apply consistent input styling with proper focus states
 * 3. Support multiple input types and states
 * 4. Ensure accessibility compliance
 * 
 * Conclusion: Ensures uniform input behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn('input', className)}
      data-testid="input"
      {...props}
    />
  );
};

export default Input; 
