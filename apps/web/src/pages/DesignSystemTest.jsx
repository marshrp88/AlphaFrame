/**
 * DesignSystemTest.jsx - AlphaFrame Phase X Sprint 1
 * 
 * Purpose: A test page to verify the new design system components
 * are working correctly and can be imported properly.
 * 
 * Procedure:
 * 1. Imports and renders all new design system components
 * 2. Tests component functionality and styling
 * 3. Validates design token usage
 * 4. Ensures proper component integration
 * 
 * Conclusion: Provides a quick way to verify the design system
 * implementation is working as expected.
 */

import React from 'react';
import ComponentShowcase from '../components/ui/ComponentShowcase';

/**
 * DesignSystemTest Component
 * @returns {JSX.Element} The rendered test page
 */
export function DesignSystemTest() {
  return (
    <div className="design-system-test">
      <ComponentShowcase />
    </div>
  );
}

export default DesignSystemTest; 