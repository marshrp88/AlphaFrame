// Card.jsx
// A set of simple card components for grouping UI content.
// Exports: Card, CardHeader, CardContent, CardTitle
import React from 'react';

/**
 * Card - main container
 */
export const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded bg-white shadow p-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardHeader - header section for a card
 */
export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`text-lg font-bold mb-2 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardContent - content section for a card
 */
export const CardContent = ({ className = '', children, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * CardTitle - title for a card
 */
export const CardTitle = ({ className = '', children, ...props }) => (
  <h2 className={`text-xl ${className}`} {...props}>
    {children}
  </h2>
);
// Use these components to build consistent card layouts in the app. 