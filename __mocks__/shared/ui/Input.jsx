import React from 'react';
import { vi } from 'vitest';

const Input = React.forwardRef(({ 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input ${className}`}
      data-testid={id || 'input'}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 