import React from "react";

export function RadioGroup({ children, onValueChange, className = '' }) {
  return (
    <div 
      role="radiogroup" 
      className={className}
      onChange={(e) => {
        if (e.target.type === 'radio') {
          onValueChange?.(e.target.value);
        }
      }}
    >
      {children}
    </div>
  );
}

export function RadioGroupItem({ value, id, children, ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        value={value}
        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
        {...props}
      />
      {children}
    </div>
  );
} 
