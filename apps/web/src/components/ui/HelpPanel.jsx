import React from 'react';

export default function HelpPanel() {
  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <details style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, width: 260 }}>
        <summary style={{ cursor: 'pointer' }}>Help</summary>
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
          <li><a href="/docs/Quickstart" target="_blank" rel="noreferrer">Quickstart</a></li>
          <li><a href="/docs/DemoMode" target="_blank" rel="noreferrer">Demo Mode</a></li>
          <li><a href="/docs/KnownIssues" target="_blank" rel="noreferrer">Known Issues</a></li>
          <li><a href="/docs/Support" target="_blank" rel="noreferrer">Support</a></li>
        </ul>
      </details>
    </div>
  );
}


