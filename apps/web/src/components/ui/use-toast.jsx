/**
 * use-toast Component
 * 
 * Purpose: A toast notification system providing user feedback for actions
 * and system events throughout the AlphaFrame application.
 * 
 * Procedure:
 * 1. Provide ToastProvider context for managing toast state
 * 2. Implement useToast hook for triggering notifications
 * 3. Create Toaster component for rendering toast messages
 * 4. Support multiple variants (default, destructive, success)
 * 
 * Conclusion: Essential UI component for user feedback and system
 * notifications throughout the application.
 */

import { createContext, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import React from "react";

// Toast context
const ToastContext = createContext();

/**
 * ToastProvider Component
 * Provides toast context to the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The rendered provider component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * Hook for triggering toast notifications
 * @returns {Object} Toast context with toast function
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Toaster Component
 * Renders toast notifications in a portal
 * @param {Object} props - Component props
 * @param {Array} props.toasts - Array of toast objects
 * @returns {JSX.Element} The rendered toaster component
 */
function Toaster({ toasts }) {
  const isTest = import.meta.env.VITE_APP_ENV === 'test';
  
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      data-testid="toaster"
    >
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          style={{
            padding: "12px 16px",
            background: variant === "destructive" ? "#ffe5e5" : "#e0f7ff",
            border: "1px solid #ccc",
            borderRadius: 6,
            minWidth: 240,
          }}
        >
          <strong>{title}</strong>
          {isTest && <span data-testid="toast-visible">✅ Toast</span>}
          {React.isValidElement(description) ? (
            React.cloneElement(description, {
              style: { fontSize: "0.9em", marginTop: 4 }
            })
          ) : (
            <div style={{ fontSize: "0.9em", marginTop: 4 }}>{description}</div>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
}

export default {
  ToastProvider,
  useToast,
  Toaster
}; 