import React from 'react';

export const Textarea = ({ value, onChange, placeholder, className, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    {...props}
  />
);

export default Textarea; 