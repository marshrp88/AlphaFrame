/**
 * ProFooter.jsx
 * 
 * Purpose: Footer component for AlphaPro pages with status and actions
 * 
 * Procedure:
 * - Displays status information and quick actions
 * - Supports different modes with contextual content
 * - Includes accessibility features
 * 
 * Conclusion: Provides consistent footer experience across Pro features
 */

import React from 'react';
import './ProFooter.css';

export const ProFooter = ({ mode = 'planner', ...props }) => {
  const getFooterContent = () => {
    switch (mode) {
      case 'planner':
        return {
          status: 'Planning mode active',
          actions: ['Save Plan', 'Export', 'Share']
        };
      case 'investor':
        return {
          status: 'Portfolio analysis ready',
          actions: ['Analyze', 'Optimize', 'Report']
        };
      case 'minimalist':
        return {
          status: 'Minimal view',
          actions: ['Expand', 'Settings']
        };
      default:
        return {
          status: 'AlphaPro active',
          actions: ['Help', 'Settings']
        };
    }
  };

  const { status, actions } = getFooterContent();

  return (
    <footer className={`pro-footer pro-footer--${mode}`} {...props}>
      <div className="pro-footer__content">
        <div className="pro-footer__status">
          <span className="pro-footer__status-text">{status}</span>
        </div>
        
        <div className="pro-footer__actions">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className="pro-footer__action-btn"
              aria-label={action}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default ProFooter; 