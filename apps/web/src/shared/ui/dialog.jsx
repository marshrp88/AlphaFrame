/**
 * Dialog Components - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent dialog functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent dialog styling with proper states
 * 3. Support different sizes and variants
 * 4. Ensure proper accessibility and focus management
 * 
 * Conclusion: Ensures uniform dialog behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './dialog.css';

export const Dialog = ({ children, className = '', size = 'md', ...props }) => {
  return (
    <div 
      role="dialog" 
      className={cn('dialog', `dialog-${size}`, className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={cn('dialog-title', className)} {...props}>
      {children}
    </h2>
  );
};

export const DialogContent = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('dialog-content', className)} {...props}>
      {children}
    </div>
  );
};

export const DialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('dialog-footer', className)} {...props}>
      {children}
    </div>
  );
};

export default Dialog; 
