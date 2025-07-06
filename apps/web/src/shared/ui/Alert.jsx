import React from 'react';
import './Alert.css';

/**
 * Alert Component
 * 
 * Purpose: Display important messages to users with different severity levels
 * 
 * Props:
 * - variant: 'success', 'warning', 'danger', 'info' (default: 'info')
 * - children: Content to display in the alert
 * - className: Additional CSS classes
 * 
 * Usage:
 * <Alert variant="danger">Error message here</Alert>
 * <Alert variant="success">Success message here</Alert>
 */

const Alert = ({ variant = 'info', children, className = '', ...props }) => {
  const alertClasses = `alert alert-${variant} ${className}`.trim();
  
  return (
    <div className={alertClasses} role="alert" {...props}>
      {children}
    </div>
  );
};

export default Alert; 