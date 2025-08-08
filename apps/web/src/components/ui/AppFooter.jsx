import React from 'react';
import { Link } from 'react-router-dom';

export default function AppFooter() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      style={{
        marginTop: 32,
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        background: '#fafafa'
      }}
    >
      <nav aria-label="Legal and support links" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/legal/terms" aria-label="Terms of Service">Terms</Link>
        <Link to="/legal/privacy" aria-label="Privacy Policy">Privacy</Link>
        <Link to="/legal/cookies" aria-label="Cookie Policy">Cookies</Link>
        <Link to="/legal/accessibility" aria-label="Accessibility Statement">Accessibility</Link>
      </nav>
      <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
        © {new Date().getFullYear()} AlphaFrame. Not investment advice.
      </div>
    </footer>
  );
}


