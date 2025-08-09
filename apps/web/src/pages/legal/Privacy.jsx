import React from 'react';

export default function Privacy() {
  return (
    <main role="main" aria-label="Privacy Policy" style={{ padding: '1rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Privacy Policy</h1>
      <p>Effective date: 2025-08-09</p>
      <h2>Overview</h2>
      <p>We collect the minimum data necessary to operate AlphaFrame. We do not sell your data.</p>
      <h2>Data We Collect</h2>
      <ul>
        <li>Account data (email, name)</li>
        <li>Product usage events (with consent)</li>
        <li>Financial data if you connect accounts via Plaid</li>
      </ul>
      <h2>How We Use Data</h2>
      <p>To provide insights, improve features, and secure the Service. With consent, we may collect anonymous analytics.</p>
      <h2>Sharing</h2>
      <p>We share data with processors needed to operate the Service (e.g., hosting, analytics with consent). We do not sell personal data.</p>
      <h2>Security</h2>
      <p>We use industry-standard security. No method is 100% secure.</p>
      <h2>Your Rights</h2>
      <p>Depending on your jurisdiction, you may request access, correction, deletion, or portability of your data.</p>
      <h2>Contact</h2>
      <p>privacy@alphaframe.app</p>
    </main>
  );
}


