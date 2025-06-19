import React from "react";
import { cn } from "@/lib/utils";

// The Input component is a reusable text input element that can be customized with props like type and className.
// It uses React.forwardRef to allow parent components to pass a ref to the underlying DOM element.
export const Input = React.forwardRef(({
  type = "text",
  className,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input"; 
