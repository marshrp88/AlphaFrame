import React, { useEffect } from 'react';
import '../../styles/design-tokens.css';

/**
 * ToastAlert.jsx
 * A toast/alert component using design tokens for background, color, and spacing.
 * Props: type (success, error, warning, info), message, onClose
 */
const TYPE_STYLES = {
  success: {
    background: 'var(--color-success)',
    color: '#fff',
  },
  error: {
    background: 'var(--color-error)',
    color: '#fff',
  },
  warning: {
    background: 'var(--color-warning)',
    color: '#1A1A1A',
  },
  info: {
    background: 'var(--color-accent)',
    color: '#fff',
  },
};

const ToastAlert = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        ...TYPE_STYLES[type],
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: 'var(--font-size-base)',
        boxShadow: 'var(--elevation-2)',
        position: 'fixed',
        top: 'var(--spacing-xl)',
        right: 'var(--spacing-xl)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        minWidth: '220px',
      }}
      role="alert"
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '1.2rem',
            marginLeft: 'var(--spacing-sm)',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ToastAlert; 