import React from "react";
import { cn } from "@/lib/utils";

// The Button component is a reusable UI element that can be rendered as a button.
// It uses React.forwardRef to allow parent components to pass a ref to the underlying DOM element.
// The component accepts props like className to customize its appearance and behavior.
export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
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
