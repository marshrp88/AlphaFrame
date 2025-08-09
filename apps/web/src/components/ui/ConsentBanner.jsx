import React, { useEffect, useState } from 'react';

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('alphaframe_consent');
    if (consent === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem('alphaframe_consent', 'true');
    setVisible(false);
  };
  const decline = () => {
    localStorage.setItem('alphaframe_consent', 'false');
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics consent"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        background: '#111827',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ maxWidth: 720 }}>
        We use essential cookies and optional privacy‑first analytics to improve AlphaFrame. Do you
        consent to anonymous analytics?
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={decline} aria-label="Decline analytics" style={{ padding: '8px 12px', background: '#374151', color: 'white', border: 'none', borderRadius: 6 }}>Decline</button>
        <button onClick={accept} aria-label="Accept analytics" style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 6 }}>Accept</button>
      </div>
    </div>
  );
};

export default ConsentBanner;


