import React from "react";

export function Checkbox(props) {
  return <input type="checkbox" className="checkbox" {...props} />;
}

function Switch({ onCheckedChange, ...props }) {
  const handleChange = (event) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  return <input type="checkbox" className="switch" onChange={handleChange} {...props} />;
}

export default Switch;
export { Switch }; 
