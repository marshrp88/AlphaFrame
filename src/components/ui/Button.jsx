import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// The Button component is a reusable UI element that can be rendered as a button or as another component (using Radix's Slot).
// It uses React.forwardRef to allow parent components to pass a ref to the underlying DOM element.
// The component accepts props like variant, size, className, and asChild to customize its appearance and behavior.
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