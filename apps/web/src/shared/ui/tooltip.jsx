/**
 * Tooltip Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent tooltip functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent tooltip styling with proper positioning
 * 3. Support hover states and accessibility
 * 4. Ensure proper z-index management
 * 
 * Conclusion: Ensures uniform tooltip behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './tooltip.css';

const Tooltip = ({ children, content, className = '', ...props }) => {
  return (
    <div className={cn('tooltip-container', className)} {...props}>
      <div className="tooltip-trigger">
        {children}
      </div>
      <div className="tooltip-content">
        {content}
      </div>
    </div>
  );
};

export default Tooltip; 
