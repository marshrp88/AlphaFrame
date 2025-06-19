/**
 * Icon.jsx
 * 
 * Purpose: Simple icon component for consistent icon display
 * 
 * Procedure:
 * - Provides icon display with consistent styling
 * - Supports common icon names used in AlphaPro
 * - Includes accessibility features
 * 
 * Conclusion: Ensures consistent icon usage across the application
 */

import React from 'react';
import './Icon.css';

const iconMap = {
  'chevron-up': '▲',
  'chevron-down': '▼',
  'chart': '📊',
  'wallet': '💰',
  'target': '🎯',
  'settings': '⚙️',
  'help': '❓',
  'export': '📤',
  'save': '💾',
  'share': '📤',
  'analyze': '🔍',
  'optimize': '⚡',
  'report': '📋',
  'expand': '⤢',
  'collapse': '⤡'
};

export const Icon = ({ name, className = '', ...props }) => {
  const iconChar = iconMap[name] || '•';
  
  return (
    <span 
      className={`icon icon--${name} ${className}`}
      role="img"
      aria-label={name}
      {...props}
    >
      {iconChar}
    </span>
  );
};

export default Icon; 