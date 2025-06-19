import React from "react";

export function Tooltip({ children, text }) {
  return (
    <div className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded mt-1">
        {text}
      </span>
    </div>
  );
} 
