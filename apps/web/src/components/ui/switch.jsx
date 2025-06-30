import React from 'react';

// Always provide an onChange handler to avoid React warnings in controlled mode
export const Switch = ({ checked, onCheckedChange = () => {}, className, ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className={className}
    {...props}
  />
);

export default Switch; 