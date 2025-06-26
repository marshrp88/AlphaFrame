import React from "react";

export default function Label({ children, htmlFor, ...props }) {
  return (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
} 