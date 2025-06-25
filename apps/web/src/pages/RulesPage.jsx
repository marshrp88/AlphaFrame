import React, { useState, useEffect } from 'react';
import RuleBinderRoot from '../components/framesync/RuleBinderRoot';
import { Button } from '../components/ui/Button';

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

export default function RulesPage() {
  console.log("[RulesPage] Function invoked");
  console.log("[RulesPage] Environment:", import.meta.env.VITE_APP_ENV);
  console.log("[RulesPage] Timestamp:", new Date().toISOString());
  
  const [showRuleBinder, setShowRuleBinder] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  // Diagnostic logging and test mode setup
  useEffect(() => {
    console.log('[RulesPage] Component mounted');
    console.log('[RulesPage] Environment:', import.meta.env.VITE_APP_ENV);
    console.log('[RulesPage] Test mode:', localStorage.getItem('test_mode'));
    console.log('[RulesPage] Mock state available:', !!window.__mockState__);
    console.log('[RulesPage] Component state - showRuleBinder:', showRuleBinder);
    console.log('[RulesPage] Component state - currentRule:', currentRule);
    
    // Hydrate store with mock state if in test mode
    if (import.meta.env.VITE_APP_ENV === 'test' && window.__mockState__) {
      console.log('[RulesPage] Hydrating store with mock state');
      try {
        // Mock any required store state here
        if (window.__mockState__.user) {
          console.log('[RulesPage] Mock user loaded:', window.__mockState__.user);
        }
        if (window.__mockState__.rules) {
          console.log('[RulesPage] Mock rules loaded:', window.__mockState__.rules);
        }
      } catch (error) {
        console.error('[RulesPage] Error hydrating mock state:', error);
      }
    }
  }, [showRuleBinder, currentRule]);

  const handleCreateRule = () => {
    console.log('[RulesPage] Create rule button clicked');
    setCurrentRule({
      id: `rule_${Date.now()}`,
      trigger: 'checking_account_balance > 5000',
      action: '',
      enabled: true
    });
    setShowRuleBinder(true);
  };

  const handleConfigurationChange = (payload) => {
    console.log('Rule configuration changed:', payload);
    setShowRuleBinder(false);
  };

  console.log('[RulesPage] Rendering component, showRuleBinder:', showRuleBinder);

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
          </div>
        )}
      </div>
    </ErrorCatcher>
  );
}
