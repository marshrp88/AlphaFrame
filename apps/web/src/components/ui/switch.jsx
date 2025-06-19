import React from "react";

export function Checkbox(props) {
  return <input type="checkbox" className="checkbox" {...props} />;
}

export default function Switch(props) {
  return <input type="checkbox" className="switch" {...props} />;
} 
