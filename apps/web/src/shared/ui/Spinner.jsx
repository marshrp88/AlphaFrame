import React from 'react';
import './Spinner.css';

/**
 * Spinner Component
 * 
 * Purpose: Display loading states with animated spinner
 * 
 * Props:
 * - size: 'small', 'medium', 'large' (default: 'medium')
 * - color: CSS color value (default: 'currentColor')
 * - className: Additional CSS classes
 * 
 * Usage:
 * <Spinner size="small" />
 * <Spinner size="large" color="#3b82f6" />
 */

const Spinner = ({ size = 'medium', color = 'currentColor', className = '', ...props }) => {
  const spinnerClasses = `spinner spinner-${size} ${className}`.trim();
  
  return (
    <div 
      className={spinnerClasses} 
      style={{ '--spinner-color': color }}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <div className="spinner-inner"></div>
    </div>
  );
};

export default Spinner; 