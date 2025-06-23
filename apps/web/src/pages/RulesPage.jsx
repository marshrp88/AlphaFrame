import React from 'react';

// Error Catcher Component to catch runtime exceptions
const ErrorCatcher = ({ children }) => {
  try {
    console.log('[ErrorCatcher] Attempting to render children');
    return children;
  } catch (err) {
    console.error('[RulesPage ERROR] Runtime exception caught:', err);
    return <div data-testid="error-caught">Error rendered: {err.message}</div>;
  }
};

const RulesPage = () => {
  console.log("[RulesPage] Function invoked");
  console.log("[RulesPage] Environment:", import.meta.env.VITE_APP_ENV);
  console.log("[RulesPage] Timestamp:", new Date().toISOString());

  // Wrap the entire component in error boundary
  return (
    <ErrorCatcher>
      {(() => {
        try {
          console.log("[RulesPage] Inner render function starting");
          
          const result = (
            <div data-testid="debug-rulespage" style={{ background: "lime", padding: "2rem" }}>
              <h1>Rules Page Mounted</h1>
              <p>Mounted at: {new Date().toISOString()}</p>
            </div>
          );
          
          console.log("[RulesPage] Inner render function completed successfully");
          return result;
        } catch (e) {
          console.error("[RulesPage] Inner render failed:", e);
          return <div data-testid="debug-rulespage-error">Inner Render Error: {e.message}</div>;
        }
      })()}
    </ErrorCatcher>
  );
};

export default RulesPage;
