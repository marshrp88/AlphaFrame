import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar - AlphaFrame Design System
 * Props:
 * - items: Array<{ label: string, to: string, icon?: ReactNode }>
 * - currentPath: string (for active state)
 * - ...rest: other nav props
 */
export default function NavBar({ items, currentPath, ...rest }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation" {...rest}>
      <ul className="navbar__list">
        {items.map((item, idx) => (
          <li key={item.to} className="navbar__item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  'navbar__link',
                  isActive || currentPath === item.to ? 'navbar__link--active' : '',
                ].filter(Boolean).join(' ')
              }
              aria-current={currentPath === item.to ? 'page' : undefined}
              tabIndex={0}
              onClick={() => {
                // Debug log for navigation
                console.log(`Nav: Navigating to ${item.to}`);
              }}
            >
              {/* Remove emoji icons for now, or use SVGs if provided */}
              {/* {item.icon && <span className="navbar__icon">{item.icon}</span>} */}
              <span className="navbar__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
} 