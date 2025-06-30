/**
 * Progress Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent progress bar functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent progress styling with proper states
 * 3. Support different variants and sizes
 * 4. Ensure proper accessibility
 * 
 * Conclusion: Ensures uniform progress behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './progress.css';

const Progress = ({ 
  value = 0, 
  max = 100, 
  size = 'md',
  variant = 'default',
  showLabel = false,
  showValue = false,
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn('progress-container', className)} {...props}>
      {(showLabel || showValue) && (
        <div className="progress-header">
          {showLabel && <span className="progress-label">Progress</span>}
          {showValue && (
            <span className="progress-value">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn('progress', `progress-${size}`, `progress-${variant}`)}>
        <div 
          className="progress-bar"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress; 