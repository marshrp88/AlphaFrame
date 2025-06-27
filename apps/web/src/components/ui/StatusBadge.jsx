import React from 'react';
import './StatusBadge.css';

/**
 * StatusBadge - AlphaFrame Design System
 * Props:
 * - variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'
 * - icon: ReactNode
 * - children: label text
 * - className: string
 * - ...rest: other span props
 */
export default function StatusBadge({
  variant = 'neutral',
  icon,
  children,
  className = '',
  ...rest
}) {
  const badgeClass = [
    'status-badge',
    `status-badge--${variant}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={badgeClass} role="status" {...rest}>
      {icon && <span className="status-badge__icon">{icon}</span>}
      <span className="status-badge__label">{children}</span>
    </span>
  );
} 