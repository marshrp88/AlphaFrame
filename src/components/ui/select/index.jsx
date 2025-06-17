import React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

// The Select component is a reusable dropdown select element built on Radix UI's Select primitive.
// It exports several sub-components: Select (root), SelectTrigger, SelectContent, SelectItem, etc.
// Each sub-component uses React.forwardRef to allow parent components to pass a ref to the underlying DOM element.

export const Select = RadixSelect.Root;

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <RadixSelect.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
    <RadixSelect.Icon>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </RadixSelect.Icon>
  </RadixSelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef((props, ref) => (
  <RadixSelect.Portal>
    <RadixSelect.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-popover-foreground shadow-md",
        props.className
      )}
    >
      <RadixSelect.Viewport className="p-1">{props.children}</RadixSelect.Viewport>
    </RadixSelect.Content>
  </RadixSelect.Portal>
));
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef(({ children, className, ...props }, ref) => (
  <RadixSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100",
      className
    )}
    {...props}
  >
    <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
      <Check className="h-4 w-4" />
    </RadixSelect.ItemIndicator>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
  </RadixSelect.Item>
));
SelectItem.displayName = "SelectItem";

// Additional sub-components like SelectGroup, SelectLabel, SelectValue can be defined similarly if needed. 