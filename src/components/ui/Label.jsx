import React from "react";
import { cn } from "@/lib/utils";

// The Label component is a reusable label element that can be used to label form controls.
// It uses React.forwardRef to allow parent components to pass a ref to the underlying DOM element.
export const Label = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label"; 
