// Button.jsx
// A reusable button component for the UI. Use this for all clickable actions.
// Exports a single named Button component.
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * Button component
 * @param {object} props - React props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button label/content
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled] - Disable the button
 * @param {string} [props.variant] - Button variant
 * @param {string} [props.size] - Button size
 * @param {boolean} [props.asChild] - Render as child component
 * @returns {JSX.Element}
 */
export const Button = React.forwardRef(({ 
  variant = "default", 
  size = "default", 
  className, 
  asChild = false, 
  ...props 
}, ref) => {
  // If asChild is true, render the Slot component (from Radix) which allows the Button to be rendered as its child.
  // Otherwise, render a standard button element.
  const Component = asChild ? Slot : "button";
  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition focus:outline-none focus:ring-2",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

// This is a simple, reusable button. Use it for all actions in the app. 
