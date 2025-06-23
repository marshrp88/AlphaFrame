import React from "react";

export function Checkbox(props) {
  return <input type="checkbox" className="checkbox" {...props} />;
}

function Switch(props) {
  return <input type="checkbox" className="switch" {...props} />;
}

export default Switch;
export { Switch }; 
