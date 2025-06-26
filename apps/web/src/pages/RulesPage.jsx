import React, { useState, useEffect } from 'react';
import RuleBinderRoot from '../components/framesync/RuleBinderRoot';
import { Button } from '../components/ui/Button';

// Error Catcher Component to catch runtime exceptions
const ErrorCatcher = ({ children }) => {
  try {
    return children;
  } catch (err) {
    return <div data-testid="error-caught">Error rendered: {err.message}</div>;
  }
};

export default function RulesPage() {
  const [showRuleBinder, setShowRuleBinder] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  // Diagnostic logging and test mode setup
  useEffect(() => {
  }, [showRuleBinder, currentRule]);

  const handleCreateRule = () => {
    setCurrentRule({
      id: `rule_${Date.now()}`,
      trigger: 'checking_account_balance > 5000',
      action: '',
      enabled: true
    });
    setShowRuleBinder(true);
  };

  const handleConfigurationChange = () => {
    setShowRuleBinder(false);
  };

  return (
    <ErrorCatcher>
      <div 
        data-testid="debug-rulespage" 
        className="p-6"
        style={{ 
          display: 'block', 
          background: import.meta.env.VITE_APP_ENV === 'test' ? 'lime' : 'transparent',
          minHeight: '100px',
          border: import.meta.env.VITE_APP_ENV === 'test' ? '3px solid red' : 'none',
          position: 'relative',
          zIndex: 9999
        }}
      >
        <h1 className="text-2xl font-bold mb-6">FrameSync Rules</h1>
        
        {/* Test mode indicator */}
        {import.meta.env.VITE_APP_ENV === 'test' && (
          <div className="mb-4 p-2 bg-green-100 border border-green-300 rounded">
            <p className="text-green-800 text-sm">🧪 Test Mode Active - Element Should Be Visible</p>
            <p className="text-green-800 text-xs">Background: Lime | Border: Red | Z-Index: 9999</p>
          </div>
        )}
        
        {!showRuleBinder ? (
          <div className="space-y-4">
            <Button 
              onClick={handleCreateRule}
              data-testid="create-rule-button"
            >
              Create Rule
            </Button>
            <p>Test: Rules Page Loaded</p>
            <p className="text-sm text-gray-600">Component rendered at: {new Date().toISOString()}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              onClick={() => setShowRuleBinder(false)}
              variant="outline"
            >
              Cancel
            </Button>
            {(() => {
              try {
                return (
                  <RuleBinderRoot
                    initialConfig={{
                      rule: currentRule,
                      currentState: {
                        checking_account_balance: 6000,
                        savings_account_balance: 15000,
                        credit_score: 750
                      }
                    }}
                    onConfigurationChange={handleConfigurationChange}
                  />
                );
              } catch (err) {
                return (
                  <div>
                    <span data-testid="rulespage-render-error">{err?.message || "Unknown error"}</span>
                    <pre>{err?.stack}</pre>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </ErrorCatcher>
  );
}
