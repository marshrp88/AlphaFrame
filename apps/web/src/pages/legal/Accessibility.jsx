import React from 'react';

export default function Accessibility() {
  return (
    <main role="main" aria-label="Accessibility Statement" style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Accessibility Statement</h1>
      <p>We are committed to meeting WCAG 2.1 AA. If you encounter issues, contact accessibility@alphaframe.app and we will assist.</p>
      <h2>Status</h2>
      <p>Automated accessibility tests (axe) run in CI across Chromium, Firefox, and WebKit on key pages.</p>
    </main>
  );
}


