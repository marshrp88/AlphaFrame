import React from "react";

export function Badge({ children }) {
  return <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{children}</span>;
}

export default Badge; 
