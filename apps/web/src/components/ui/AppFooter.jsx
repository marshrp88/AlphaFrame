import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => (
  <footer
    role="contentinfo"
    aria-label="Site footer"
    style={{
      marginTop: 32,
      padding: '16px 24px',
      borderTop: '1px solid #e5e7eb',
      background: '#fafafa',
    }}
  >
    <nav aria-label="Legal and support links" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Link to="/legal/terms" aria-label="Terms of Service" style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline' }}>Terms</Link>
      <Link to="/legal/privacy" aria-label="Privacy Policy" style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline' }}>Privacy</Link>
      <Link to="/legal/cookies" aria-label="Cookie Policy" style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline' }}>Cookies</Link>
      <Link to="/legal/accessibility" aria-label="Accessibility Statement" style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline' }}>Accessibility</Link>
    </nav>
  </footer>
);

export default AppFooter;


