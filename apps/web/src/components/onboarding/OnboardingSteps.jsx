import { useState } from 'react';

export default function OnboardingSteps({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      label: 'Connect Bank',
      content: (
        <div>
          <p>Demo: Bank connection simulated.</p>
          <button role="button" aria-label="Continue to Review Transactions" onClick={() => setStep(1)} tabIndex={0} style={{marginTop: '1rem'}}>Continue</button>
        </div>
      ),
    },
    {
      label: 'Review Transactions',
      content: (
        <div>
          <p>Demo: Showing mock transactions.</p>
          <button role="button" aria-label="Continue to Set Budget" onClick={() => setStep(2)} tabIndex={0} style={{marginTop: '1rem'}}>Continue</button>
        </div>
      ),
    },
    {
      label: 'Set Budget',
      content: (
        <div>
          <p>Demo: Budget setup with mock data.</p>
          <button role="button" aria-label="Continue to Create Rule" onClick={() => setStep(3)} tabIndex={0} style={{marginTop: '1rem'}}>Continue</button>
        </div>
      ),
    },
    {
      label: 'Create First Rule',
      content: (
        <div>
          <p>Demo: Rule creation simulated.</p>
          <button role="button" aria-label="Continue to Finish" onClick={() => setStep(4)} tabIndex={0} style={{marginTop: '1rem'}}>Continue</button>
        </div>
      ),
    },
    {
      label: 'Finish',
      content: (
        <div>
          <p>Onboarding complete! You are ready to use AlphaFrame.</p>
          <button role="button" aria-label="Finish onboarding and go to dashboard" onClick={onComplete} tabIndex={0} style={{marginTop: '1rem'}}>Finish</button>
        </div>
      ),
    },
  ];

  return (
    <div className="onboarding-steps" aria-live="polite">
      <h1>{steps[step].label}</h1>
      {steps[step].content}
    </div>
  );
} 