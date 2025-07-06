import React from 'react';
import './ProgressBar.css';

/**
 * ProgressBar Component
 * 
 * Purpose: Display progress with visual bar and percentage
 * 
 * Props:
 * - value: Number between 0-100 representing progress percentage
 * - variant: 'success', 'warning', 'danger', 'info' (default: 'info')
 * - className: Additional CSS classes
 * - showLabel: Whether to show percentage label (default: true)
 * 
 * Usage:
 * <ProgressBar value={75} variant="success" />
 * <ProgressBar value={45} variant="warning" showLabel={false} />
 */

const ProgressBar = ({ 
  value = 0, 
  variant = 'info', 
  className = '', 
  showLabel = true,
  ...props 
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const progressClasses = `progress-bar progress-bar-${variant} ${className}`.trim();
  
  return (
    <div className="progress-container" {...props}>
      <div className={progressClasses}>
        <div 
          className="progress-fill"
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      {showLabel && (
        <span className="progress-label">{clampedValue.toFixed(1)}%</span>
      )}
    </div>
  );
};

export default ProgressBar; 