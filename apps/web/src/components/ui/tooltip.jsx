/**
 * Tooltip Component - Provides contextual help and information
 * 
 * Purpose: Shows additional information when users hover over elements
 * Procedure: Renders a tooltip that appears on hover with the provided content
 * Conclusion: Enhances user experience by providing contextual information
 */
import React, { useState } from 'react';

/**
 * Tooltip Component Props
 * @typedef {Object} TooltipProps
 * @property {React.ReactNode} children - Tooltip content
 * @property {React.ReactNode} content - Tooltip content
 * @property {string} position - Position of the tooltip
 * @property {string} className - Additional CSS classes
 * @property {Object} props - Additional props
 */

/**
 * Tooltip Component
 * @param {TooltipProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip component
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && content && (
        <div className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 