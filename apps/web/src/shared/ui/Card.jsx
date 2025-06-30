// Card.jsx
// A set of simple card components for grouping UI content.
// Exports: Card, CardHeader, CardContent, CardTitle, CardDescription
import React from 'react';
import { cn } from '@/lib/utils.js';
import './Card.css';

/**
 * Card Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides a consistent visual container for grouping related content
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes from Card.css that reference design tokens
 * 2. Apply consistent card styling with proper shadows and borders
 * 3. Support multiple card components (Card, CardHeader, CardContent, etc.)
 * 4. Ensure accessibility compliance
 * 
 * Conclusion: Enables consistent layout structure across the application
 * while maintaining design system consistency with vanilla CSS only.
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={cn('card', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

/**
 * CardHeader - header section for a card
 */
export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={cn('card-header', className)} {...props}>
    {children}
  </div>
);

/**
 * CardContent - content section for a card
 */
export const CardContent = ({ className = '', children, ...props }) => (
  <div className={cn('card-content', className)} {...props}>
    {children}
  </div>
);

/**
 * CardTitle - title for a card
 */
export const CardTitle = ({ className = '', children, ...props }) => (
  <h2 className={cn('card-title', className)} {...props}>
    {children}
  </h2>
);

/**
 * CardDescription - description for a card
 */
export const CardDescription = ({ className = '', children, ...props }) => (
  <p className={cn('card-description', className)} {...props}>
    {children}
  </p>
);

// Use these components to build consistent card layouts in the app. 
