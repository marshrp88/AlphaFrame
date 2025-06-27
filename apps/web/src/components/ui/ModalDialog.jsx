import React from 'react';
import '../../styles/design-tokens.css';

/**
 * ModalDialog.jsx
 * A modal dialog component using design tokens for background, border radius, shadow, and spacing.
 * Props: open, onClose, title, children, footer
 */
const ModalDialog = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(42,77,105,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-2)',
          padding: 'var(--spacing-xl)',
          minWidth: '340px',
          maxWidth: '90vw',
          minHeight: '120px',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--font-size-lg)',
            marginBottom: 'var(--spacing)',
            color: 'var(--color-primary)',
          }}>{title}</div>
        )}
        <div>{children}</div>
        {footer && (
          <div style={{ marginTop: 'var(--spacing-lg)' }}>{footer}</div>
        )}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--spacing-sm)',
            right: 'var(--spacing-sm)',
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ModalDialog; 