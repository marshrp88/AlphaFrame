import React from 'react';

export const Badge = ({ children, variant, className, ...props }) => (
  <span className={`badge ${variant || ''} ${className || ''}`} {...props}>
    {children}
  </span>
);

export default Badge; 