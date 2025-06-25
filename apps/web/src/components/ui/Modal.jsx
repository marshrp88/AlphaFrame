/**
 * Modal.jsx - AlphaFrame Phase X Sprint 2
 * 
 * Purpose: A reusable modal component that uses design tokens
 * for consistent styling and provides advanced interaction patterns.
 * 
 * Procedure:
 * 1. Uses design tokens for all styling (--color-primary, --border-radius, etc.)
 * 2. Implements proper accessibility with focus management and ARIA attributes
 * 3. Supports multiple sizes and variants
 * 4. Provides smooth animations and backdrop interactions
 * 
 * Conclusion: Creates a polished, accessible modal component
 * that maintains visual consistency throughout the application.
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal Component Props
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {Function} onClose - Function to call when modal should close
 * @property {string} [title] - Modal title
 * @property {React.ReactNode} children - Modal content
 * @property {string} [size] - Modal size ('sm', 'md', 'lg', 'xl')
 * @property {boolean} [closeOnBackdrop] - Whether clicking backdrop closes modal
 * @property {boolean} [closeOnEscape] - Whether pressing escape closes modal
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [footer] - Footer content
 * @property {boolean} [showCloseButton] - Whether to show close button
 * @property {string} [ariaLabel] - ARIA label for the modal
 */

/**
 * Modal Component
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element|null} The rendered modal component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  footer,
  showCloseButton = true,
  ariaLabel,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        // Restore focus to the previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 200);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    onClose();
  };

  if (!isVisible && !isOpen) {
    return null;
  }

  const modalClasses = [
    'modal',
    `modal--${size}`,
    isAnimating && 'modal--animating',
    isOpen && 'modal--open',
    className
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'modal__content',
    `modal__content--${size}`,
    isAnimating && 'modal__content--animating',
    isOpen && 'modal__content--open'
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div
      className="modal__backdrop"
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={ariaLabel ? undefined : 'modal-description'}
        aria-label={ariaLabel}
        tabIndex={-1}
        {...props}
      >
        <div className={contentClasses}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="modal__header">
              {title && (
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal__close-button"
                  onClick={handleCloseClick}
                  aria-label="Close modal"
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div id="modal-description" className="modal__body">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal__footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at the top level
  return createPortal(modalContent, document.body);
}

// PropTypes for runtime validation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  footer: PropTypes.node,
  showCloseButton: PropTypes.bool,
  ariaLabel: PropTypes.string
};

// Default props
Modal.defaultProps = {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true,
  showCloseButton: true,
  className: ''
};

export default Modal; 