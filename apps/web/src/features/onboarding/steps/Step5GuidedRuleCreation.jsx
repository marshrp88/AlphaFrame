/**
 * Step5GuidedRuleCreation.jsx - Phase 4 Guided Rule Creation
 *
 * Purpose: Guide the user through creating their first automation rule,
 * simulate a trigger, and deliver instant feedback (the "aha" moment).
 *
 * Procedure:
 * 1. Let user pick a spending category (e.g., Food, Entertainment)
 * 2. Let user set a spending limit (threshold)
 * 3. Confirm and "create" the rule (simulate backend)
 * 4. Provide a "Test Rule" button to simulate a transaction that triggers the rule
 * 5. Show a real automation notification (toast) when triggered
 * 6. Allow user to continue to the next onboarding step
 *
 * Conclusion: User experiences the value of automation before reaching the dashboard.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from '../../../components/ui/CompositeCard.jsx';
import StyledButton from '../../../components/ui/StyledButton.jsx';
import { useToast } from '../../../components/ui/use-toast.jsx';
import { Zap, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { label: 'Food & Dining', value: 'food', icon: <Zap size={18} /> },
  { label: 'Entertainment', value: 'entertainment', icon: <AlertTriangle size={18} /> },
  { label: 'Transportation', value: 'transportation', icon: <CheckCircle size={18} /> },
];

const Step5GuidedRuleCreation = ({ onComplete }) => {
  // State for the rule creation steps
  const [step, setStep] = useState(1); // 1: pick category, 2: set threshold, 3: confirm
  const [category, setCategory] = useState('food');
  const [threshold, setThreshold] = useState(100);
  const [ruleCreated, setRuleCreated] = useState(false);
  const [testTriggered, setTestTriggered] = useState(false);
  const { automationToast } = useToast();

  // Step 1: Pick a category
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStep(2);
  };

  // Step 2: Set a threshold
  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };
  const handleThresholdConfirm = () => {
    setStep(3);
  };

  // Step 3: Confirm and "create" the rule
  const handleCreateRule = () => {
    setRuleCreated(true);
    // Show a toast to confirm rule creation
    automationToast({
      type: 'ruleCreated',
      ruleName: CATEGORIES.find(c => c.value === category).label,
      message: `Your rule is now active! You'll be notified if you spend more than $${threshold} on ${CATEGORIES.find(c => c.value === category).label}.`,
      action: null,
      actionLabel: null
    });
  };

  // Step 4: Test the rule (simulate a trigger)
  const handleTestRule = () => {
    setTestTriggered(true);
    // Show a toast to simulate a rule trigger
    automationToast({
      type: 'ruleTriggered',
      ruleName: CATEGORIES.find(c => c.value === category).label,
      message: `Test: You just spent $${threshold + 10} on ${CATEGORIES.find(c => c.value === category).label}. Your rule triggered!`,
      action: null,
      actionLabel: null
    });
  };

  // Step 5: Finish and continue onboarding
  const handleContinue = () => {
    onComplete({
      ruleName: CATEGORIES.find(c => c.value === category).label,
      ruleId: `${category}-demo-rule`,
      threshold,
      testTriggered
    });
  };

  return (
    <div className="guided-rule-creation">
      <CompositeCard variant="elevated" className="rule-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Create Your First Automation Rule</h2>
          <p>Let's walk through setting up a spending alert rule together.</p>

          {/* Step 1: Pick a category */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="step-section"
              >
                <h3>Pick a spending category</h3>
                <div className="category-list">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      className={`category-btn${category === cat.value ? ' selected' : ''}`}
                      onClick={() => handleCategorySelect(cat.value)}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Set a threshold */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="step-section"
              >
                <h3>Set a spending limit</h3>
                <div className="threshold-input">
                  <span>$</span>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={threshold}
                    onChange={handleThresholdChange}
                  />
                </div>
                <StyledButton variant="primary" onClick={handleThresholdConfirm}>
                  Next <ArrowRight size={14} />
                </StyledButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Confirm and create rule */}
          <AnimatePresence>
            {step === 3 && !ruleCreated && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="step-section"
              >
                <h3>Confirm Your Rule</h3>
                <p>
                  Alert me if I spend more than <strong>${threshold}</strong> on <strong>{CATEGORIES.find(c => c.value === category).label}</strong> in a month.
                </p>
                <StyledButton variant="primary" onClick={handleCreateRule}>
                  Create Rule <CheckCircle size={14} />
                </StyledButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: Test the rule */}
          <AnimatePresence>
            {ruleCreated && !testTriggered && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="step-section"
              >
                <h3>Test Your Rule</h3>
                <p>Click below to simulate a transaction that triggers your rule.</p>
                <StyledButton variant="primary" onClick={handleTestRule}>
                  Test Rule <AlertTriangle size={14} />
                </StyledButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 5: Success and continue */}
          <AnimatePresence>
            {ruleCreated && testTriggered && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="step-section"
              >
                <h3>Automation in Action!</h3>
                <p>
                  You just experienced a real automation alert. AlphaFrame will do this for you automatically from now on!
                </p>
                <StyledButton variant="primary" onClick={handleContinue}>
                  Continue <ArrowRight size={14} />
                </StyledButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CompositeCard>
      <style jsx>{`
        .guided-rule-creation {
          padding: 2rem 0;
        }
        .rule-card {
          max-width: 480px;
          margin: 0 auto;
        }
        .step-section {
          margin-bottom: 2rem;
          text-align: center;
        }
        .category-list {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin: 1.5rem 0;
        }
        .category-btn {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .category-btn.selected, .category-btn:hover {
          background: var(--color-primary-50);
          border-color: var(--color-primary-600);
        }
        .threshold-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }
        .threshold-input input {
          width: 80px;
          font-size: 1.2rem;
          padding: 0.5rem;
          border: 1px solid var(--color-border-primary);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default Step5GuidedRuleCreation; 