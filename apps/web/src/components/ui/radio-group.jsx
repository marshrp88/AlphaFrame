import React from "react";

export function RadioGroup({ children, ...props }) {
  return <div role="radiogroup" {...props}>{children}</div>;
}

export function RadioGroupItem({ value, label, ...props }) {
  return (
    <label className="inline-flex items-center space-x-2">
      <input type="radio" value={value} {...props} />
      <span>{label}</span>
    </label>
  );
} 