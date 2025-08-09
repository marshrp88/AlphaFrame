import React from 'react';
import StyledButton from './StyledButton.jsx';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const OnboardingStatusBanner = ({ message, onRetry, onUseDemo }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="onboarding-status-banner"
    style={{
      textAlign: 'center',
      padding: '12px 16px',
      backgroundColor: 'var(--color-error-50)',
      borderBottom: '1px solid var(--color-error-200)',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}
  >
    <AlertTriangle size={20} color="var(--color-error-600)" aria-hidden />
    <span style={{ color: 'var(--color-error-700)', fontWeight: 600 }}>
      {message}
    </span>
    <StyledButton
      variant="secondary"
      size="sm"
      onClick={onRetry}
      ariaLabel="Retry setup"
    >
      <RefreshCw size={16} aria-hidden />
      Retry
    </StyledButton>
    <StyledButton
      variant="primary"
      size="sm"
      onClick={onUseDemo}
      ariaLabel="Use demo mode instead"
    >
      Use Demo
    </StyledButton>
  </div>
);

export default OnboardingStatusBanner;


