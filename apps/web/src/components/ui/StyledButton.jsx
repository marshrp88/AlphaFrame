import React from 'react';
import './StyledButton.css';

/**
 * StyledButton - AlphaFrame Design System
 * Props:
 * - variant: 'primary' | 'secondary' | 'icon'
 * - size: 'sm' | 'md' | 'lg'
 * - disabled: boolean
 * - loading: boolean
 * - icon: ReactNode (optional)
 * - iconPosition: 'left' | 'right' (for icon + label)
 * - ariaLabel: string (for icon-only)
 * - type: 'button' | 'submit' | 'reset'
 * - children: label text
 * - ...rest: other button props
 */
export default function StyledButton({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  ariaLabel,
  type = 'button',
  children,
  ...rest
}) {
  const isIconOnly = variant === 'icon' && !children;
  const className = [
    'styled-btn',
    `styled-btn--${variant}`,
    `styled-btn--${size}`,
    loading ? 'styled-btn--loading' : '',
    disabled ? 'styled-btn--disabled' : '',
    isIconOnly ? 'styled-btn--icon-only' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      type={type}
      disabled={disabled || loading}
      aria-label={isIconOnly ? ariaLabel : undefined}
      aria-busy={loading ? 'true' : undefined}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {loading && <span className="styled-btn__spinner" aria-hidden="true" />}
      {icon && iconPosition === 'left' && (
        <span className="styled-btn__icon styled-btn__icon--left">{icon}</span>
      )}
      {children && <span className="styled-btn__label">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="styled-btn__icon styled-btn__icon--right">{icon}</span>
      )}
    </button>
  );
} 