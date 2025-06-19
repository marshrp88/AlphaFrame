import React from "react";

export const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ${className}`}
    {...props}
  />
); 
