/**
 * ProHeader.jsx
 * 
 * Purpose: Header component for AlphaPro pages with navigation and branding
 * 
 * Procedure:
 * - Displays page title and navigation elements
 * - Supports different modes (planner, investor, minimalist)
 * - Includes accessibility features and keyboard navigation
 * 
 * Conclusion: Provides consistent header experience across Pro features
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './ProHeader.css';

export const ProHeader = ({ title, mode = 'planner', ...props }) => {
  return (
    <header className={`pro-header pro-header--${mode}`} {...props}>
      <div className="pro-header__content">
        <div className="pro-header__brand">
          <Link to="/pro" className="pro-header__logo">
            <span className="pro-header__logo-text">AlphaPro</span>
          </Link>
        </div>
        
        <div className="pro-header__title">
          <h1 className="pro-header__title-text">{title}</h1>
        </div>
        
        <nav className="pro-header__nav" aria-label="Main navigation">
          <ul className="pro-header__nav-list">
            <li>
              <Link to="/pro" className="pro-header__nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/pro/optimizer" className="pro-header__nav-link">
                Optimizer
              </Link>
            </li>
            <li>
              <Link to="/pro/budget" className="pro-header__nav-link">
                Budget
              </Link>
            </li>
            <li>
              <Link to="/pro/reports" className="pro-header__nav-link">
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ProHeader; 