import React from 'react';

export default function OnboardingStatusBanner({ state, onRetry, onUseDemo }) {
  const isTimeout = state === 'timeout';
  const isError = state === 'error';
  if (!isTimeout && !isError) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="onboarding-status-banner"
      style={{
        position: 'sticky', top: 0, zIndex: 1000, padding: '12px 16px',
        background: '#fff3f3', borderBottom: '1px solid #fca5a5', display: 'flex',
        gap: 8, alignItems: 'center', justifyContent: 'center'
      }}
    >
      <span style={{ color: '#b91c1c', fontWeight: 600 }}>
        {isTimeout ? 'Setup timeout' : 'Setup error'}
      </span>
      <button
        aria-label="Retry onboarding"
        onClick={onRetry}
        style={{ padding: '6px 10px', borderRadius: 6 }}
      >
        Retry
      </button>
      <button
        aria-label="Use demo mode"
        onClick={onUseDemo}
        style={{ padding: '6px 10px', borderRadius: 6 }}
      >
        Use Demo
      </button>
    </div>
  );
}


