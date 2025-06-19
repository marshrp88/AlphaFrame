// Button.jsx
// A reusable button component for the UI. Use this for all clickable actions.
// Exports a single named Button component.
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Button component
 * @param {object} props - React props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button label/content
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled] - Disable the button
 * @returns {JSX.Element}
 */
export const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";

// This is a simple, reusable button. Use it for all actions in the app. 
