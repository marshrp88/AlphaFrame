/**
 * Tooltip Component
 * 
 * Purpose: A reusable tooltip component for providing additional context
 * and help text to users through hover interactions.
 * 
 * Procedure:
 * 1. Provide Tooltip, TooltipContent, TooltipProvider, and TooltipTrigger components
 * 2. Implement hover-based visibility with proper positioning
 * 3. Apply consistent styling using Tailwind CSS classes
 * 4. Include proper accessibility attributes for screen readers
 * 
 * Conclusion: Essential UI component for user guidance and contextual
 * help throughout the AlphaFrame application.
 */

import React, { useState, useRef, useEffect } from 'react';

/**
 * TooltipProvider Component Props
 * @typedef {Object} TooltipProviderProps
 * @property {React.ReactNode} children - Child components
 */

/**
 * TooltipProvider Component
 * @param {TooltipProviderProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip provider component
 */
export function TooltipProvider({ children }) {
  return <>{children}</>;
}

/**
 * Tooltip Component Props
 * @typedef {Object} TooltipProps
 * @property {boolean} [open] - Whether the tooltip is open
 * @property {Function} [onOpenChange] - Callback when open state changes
 * @property {React.ReactNode} children - Tooltip content
 */

/**
 * Tooltip Component
 * @param {TooltipProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip component
 */
export function Tooltip({ children, open, onOpenChange }) {
  return <>{children}</>;
}

/**
 * TooltipTrigger Component Props
 * @typedef {Object} TooltipTriggerProps
 * @property {React.ReactNode} children - Trigger element
 * @property {string} [className] - Additional CSS classes
 */

/**
 * TooltipTrigger Component
 * @param {TooltipTriggerProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip trigger component
 */
export function TooltipTrigger({ children, className = '', ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      
      // Position tooltip above the trigger
      const triggerRect = trigger.getBoundingClientRect();
      tooltip.style.position = 'absolute';
      tooltip.style.top = `${triggerRect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.left = `${triggerRect.left + (triggerRect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap"
          role="tooltip"
        >
          {props['aria-label'] || 'Tooltip content'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

/**
 * TooltipContent Component Props
 * @typedef {Object} TooltipContentProps
 * @property {React.ReactNode} children - Tooltip content
 * @property {string} [className] - Additional CSS classes
 */

/**
 * TooltipContent Component
 * @param {TooltipContentProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip content component
 */
export function TooltipContent({ children, className = '', ...props }) {
  return (
    <div
      className={`px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
}; 