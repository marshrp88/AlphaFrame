// Button.jsx
// A reusable button component for the UI. Use this for all clickable actions.
// Exports a single named Button component.
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils.js";
import "./Button.css";

/**
 * Button Component - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent button interactions across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes from Button.css that reference design tokens
 * 2. Apply consistent styling with proper focus states
 * 3. Support multiple variants and sizes
 * 4. Ensure accessibility compliance
 * 
 * Conclusion: Ensures uniform button behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '', 
  ...props 
}) => {
  const buttonClasses = cn(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'disabled',
    className
  );

  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

// This is a simple, reusable button. Use it for all actions in the app. 
