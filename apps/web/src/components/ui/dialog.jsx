import React from "react";

export function Dialog({ children, ...props }) {
  return <div role="dialog" className="bg-white p-4 rounded shadow" {...props}>{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function DialogContent({ children }) {
  return <div className="mt-2">{children}</div>;
} 