// Card.jsx
// A set of simple card components for grouping UI content.
// Exports: Card, CardHeader, CardContent, CardTitle, CardDescription
import React from 'react';

/**
 * Card Component - A simple container component for content sections
 * 
 * Purpose: Provides a consistent visual container for grouping related content
 * Procedure: Renders a div with card-like styling and accepts all standard div props
 * Conclusion: Enables consistent layout structure across the application
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}
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

/**
 * CardDescription - description for a card
 */
export const CardDescription = ({ className = '', children, ...props }) => (
  <p className={`text-gray-600 text-sm ${className}`} {...props}>
    {children}
  </p>
);

// Use these components to build consistent card layouts in the app. 
