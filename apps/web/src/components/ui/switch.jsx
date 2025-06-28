import React from 'react';

export const Switch = ({ checked, onCheckedChange, className, ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={className}
    {...props}
  />
);

export default Switch; 