/**
 * use-toast Component - Enhanced for Phase 3 Automation Feedback
 * 
 * Purpose: A toast notification system providing user feedback for actions
 * and system events throughout the AlphaFrame application, with enhanced
 * automation-specific notifications for rule triggers, failures, and guidance.
 * 
 * Procedure:
 * 1. Provide ToastProvider context for managing toast state
 * 2. Implement useToast hook for triggering notifications
 * 3. Create Toaster component for rendering toast messages
 * 4. Support multiple variants (default, destructive, success, warning, info)
 * 5. Add automation-specific notification types for Phase 3
 * 6. Include actionable next steps and rule guidance
 * 
 * Conclusion: Enhanced UI component for comprehensive user feedback and
 * automation event notifications throughout the application.
 */

import { createContext, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import React from "react";
import env from '../../lib/env.js';

// Toast context
const ToastContext = createContext();

/**
 * ToastProvider Component
 * Provides toast context to the application with enhanced automation support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The rendered provider component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ 
    title, 
    description, 
    variant = "default",
    action,
    actionLabel,
    onAction,
    duration = 4000,
    automationType = null,
    ruleId = null,
    urgency = "normal"
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { 
      id, 
      title, 
      description, 
      variant, 
      action,
      actionLabel,
      onAction,
      automationType,
      ruleId,
      urgency,
      timestamp: new Date()
    }]);
    
    // Auto-dismiss based on urgency
    const dismissTime = urgency === "high" ? 8000 : urgency === "low" ? 3000 : duration;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, dismissTime);
  }, []);

  // Phase 3: Automation-specific toast helpers
  const automationToast = useCallback(({
    type,
    ruleName,
    ruleId,
    message,
    action,
    actionLabel,
    onAction
  }) => {
    const automationConfigs = {
      ruleTriggered: {
        title: `🚨 Rule Alert: ${ruleName}`,
        description: message || `Your rule "${ruleName}" has been triggered!`,
        variant: "destructive",
        urgency: "high",
        action,
        actionLabel: actionLabel || "View Details",
        onAction
      },
      ruleWarning: {
        title: `⚠️ Rule Warning: ${ruleName}`,
        description: message || `Your rule "${ruleName}" is approaching its threshold.`,
        variant: "warning",
        urgency: "medium",
        action,
        actionLabel: actionLabel || "Review",
        onAction
      },
      ruleActive: {
        title: `✅ Rule Active: ${ruleName}`,
        description: message || `Your rule "${ruleName}" is monitoring your finances.`,
        variant: "success",
        urgency: "low",
        action,
        actionLabel: actionLabel || "View Status",
        onAction
      },
      ruleFailed: {
        title: `❌ Rule Evaluation Failed: ${ruleName}`,
        description: message || `Unable to evaluate your rule "${ruleName}". Please check your settings.`,
        variant: "destructive",
        urgency: "high",
        action,
        actionLabel: actionLabel || "Fix Rule",
        onAction
      },
      ruleCreated: {
        title: `🎉 Rule Created: ${ruleName}`,
        description: message || `Your new rule "${ruleName}" is now active and monitoring your finances.`,
        variant: "success",
        urgency: "normal",
        action,
        actionLabel: actionLabel || "View Rule",
        onAction
      },
      automationGuidance: {
        title: `💡 Automation Tip`,
        description: message || "Here's how to optimize your automation setup.",
        variant: "info",
        urgency: "low",
        action,
        actionLabel: actionLabel || "Learn More",
        onAction
      }
    };

    const config = automationConfigs[type];
    if (config) {
      toast({
        ...config,
        automationType: type,
        ruleId
      });
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, automationToast }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * Hook for triggering toast notifications with automation support
 * @returns {Object} Toast context with toast and automationToast functions
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
 * Renders toast notifications in a portal with enhanced automation styling
 * @param {Object} props - Component props
 * @param {Array} props.toasts - Array of toast objects
 * @returns {JSX.Element} The rendered toaster component
 */
function Toaster({ toasts }) {
  const isTest = env.VITE_APP_ENV === 'test';
  
  const getVariantStyles = (variant, urgency) => {
    const baseStyles = {
      padding: "12px 16px",
      border: "1px solid",
      borderRadius: 6,
      minWidth: 280,
      maxWidth: 400,
      boxShadow: urgency === "high" ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
      animation: urgency === "high" ? "slideInRight 0.3s ease-out" : "slideInRight 0.2s ease-out"
    };

    switch (variant) {
      case "destructive":
        return {
          ...baseStyles,
          background: "#fef2f2",
          borderColor: "#fecaca",
          color: "#991b1b"
        };
      case "warning":
        return {
          ...baseStyles,
          background: "#fffbeb",
          borderColor: "#fed7aa",
          color: "#92400e"
        };
      case "success":
        return {
          ...baseStyles,
          background: "#f0fdf4",
          borderColor: "#bbf7d0",
          color: "#166534"
        };
      case "info":
        return {
          ...baseStyles,
          background: "#eff6ff",
          borderColor: "#bfdbfe",
          color: "#1e40af"
        };
      default:
        return {
          ...baseStyles,
          background: "#f0f9ff",
          borderColor: "#bae6fd",
          color: "#0c4a6e"
        };
    }
  };
  
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
      {toasts.map(({ 
        id, 
        title, 
        description, 
        variant, 
        action,
        actionLabel,
        onAction,
        automationType,
        ruleId,
        urgency,
        timestamp
      }) => (
        <div
          key={id}
          style={getVariantStyles(variant, urgency)}
          data-automation-type={automationType}
          data-rule-id={ruleId}
          data-urgency={urgency}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            justifyContent: "space-between",
            gap: "8px"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: "600", 
                fontSize: "14px",
                marginBottom: "4px"
              }}>
                {title}
              </div>
              {React.isValidElement(description) ? (
                React.cloneElement(description, {
                  style: { fontSize: "13px", lineHeight: "1.4" }
                })
              ) : (
                <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                  {description}
                </div>
              )}
              
              {/* Phase 3: Action button for automation toasts */}
              {action && actionLabel && (
                <button
                  onClick={() => {
                    if (onAction) onAction();
                    // Remove toast after action
                    const toastElement = document.querySelector(`[data-automation-type="${automationType}"]`);
                    if (toastElement) {
                      toastElement.style.animation = "slideOutRight 0.3s ease-in";
                      setTimeout(() => {
                        const toasts = document.querySelectorAll('[data-automation-type]');
                        toasts.forEach(t => t.remove());
                      }, 300);
                    }
                  }}
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: "500",
                    borderRadius: "4px",
                    border: "1px solid currentColor",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "currentColor";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "inherit";
                  }}
                >
                  {actionLabel}
                </button>
              )}
              
              {/* Phase 3: Timestamp for automation events */}
              {automationType && (
                <div style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginTop: "4px"
                }}>
                  {timestamp.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            {/* Phase 3: Urgency indicator */}
            {urgency === "high" && (
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "currentColor",
                animation: "pulse 2s infinite",
                flexShrink: 0,
                marginTop: "2px"
              }} />
            )}
          </div>
          
          {isTest && <span data-testid="toast-visible">✅ Toast</span>}
        </div>
      ))}
      
      {/* Phase 3: CSS animations for enhanced UX */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default {
  ToastProvider,
  useToast,
  Toaster
}; 