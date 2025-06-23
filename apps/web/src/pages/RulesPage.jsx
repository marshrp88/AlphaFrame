import React, { useState } from 'react';
import RuleBinderRoot from '@/components/framesync/RuleBinderRoot';
import { Button } from '@/components/ui/Button';

export default function RulesPage() {
  const [showRuleBinder, setShowRuleBinder] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  const handleCreateRule = () => {
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

  return (
    <div data-testid="debug-rulespage" className="p-6">
      <h1 className="text-2xl font-bold mb-6">FrameSync Rules</h1>
      
      {!showRuleBinder ? (
        <div className="space-y-4">
          <Button 
            onClick={handleCreateRule}
            data-testid="create-rule-button"
          >
            Create Rule
          </Button>
          <p>Test: Rules Page Loaded</p>
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
  );
}
