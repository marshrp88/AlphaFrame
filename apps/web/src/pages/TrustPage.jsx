/**
 * TrustPage Component - Galileo Initiative Security & Trust Framework
 * 
 * Purpose: Builds user confidence by explaining AlphaFrame's security measures,
 * data handling practices, and future security roadmap during the Galileo Initiative
 * 
 * Procedure:
 * 1. Explains demo vs. real data usage
 * 2. Outlines planned security roadmap (Plaid, OAuth, SOC2)
 * 3. Provides mock Terms of Use and Privacy Policy
 * 4. Includes contact information for trust-related inquiries
 * 5. Tracks page visits for analytics
 * 
 * Conclusion: Establishes transparency and builds trust foundation
 * for user adoption during the Galileo Initiative validation
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackTrustPageVisited } from '@/lib/analytics.js';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import StyledButton from '../components/ui/StyledButton.jsx';

const TrustPage = () => {
  useEffect(() => {
    trackTrustPageVisited();
  }, []);

  const securityFeatures = [
    {
      icon: '🔒',
      title: 'Demo Data Only',
      description: 'AlphaFrame currently uses simulated financial data for demonstration purposes. No real financial information is processed or stored.',
      status: 'Current'
    },
    {
      icon: '🔐',
      title: 'Plaid Integration (Planned)',
      description: 'Future integration with Plaid for secure, read-only access to financial accounts with bank-level encryption.',
      status: 'Q2 2025'
    },
    {
      icon: '🛡️',
      title: 'OAuth 2.0 Authentication',
      description: 'Enterprise-grade authentication with Auth0, supporting social logins and multi-factor authentication.',
      status: 'Q2 2025'
    },
    {
      icon: '📋',
      title: 'SOC 2 Type II Compliance',
      description: 'Working towards SOC 2 Type II certification to ensure enterprise-grade security and compliance standards.',
      status: 'Q3 2025'
    }
  ];

  const privacyPrinciples = [
    'We never store your actual financial data',
    'All demo data is completely fictional',
    'Your feedback and usage patterns help improve the product',
    'You can request data deletion at any time',
    'We use industry-standard encryption for all communications'
  ];

  return (
    <div className="trust-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="trust-page-container"
      >
        {/* Hero Section */}
        <div className="trust-hero">
          <h1>🔒 Security & Trust</h1>
          <p className="trust-subtitle">
            Building AlphaFrame with enterprise-grade security and complete transparency
          </p>
        </div>

        {/* Current Status */}
        <CompositeCard variant="elevated" className="trust-section">
          <h2>🚀 Current Status: Galileo Initiative</h2>
          <p>
            AlphaFrame is currently in private pilot testing as part of the Galileo Initiative. 
            We're using simulated data to demonstrate capabilities while building the security 
            infrastructure needed for real financial data.
          </p>
          <div className="demo-notice">
            <strong>Demo Mode Active:</strong> All financial data shown is fictional and for demonstration purposes only.
          </div>
        </CompositeCard>

        {/* Security Roadmap */}
        <CompositeCard variant="elevated" className="trust-section">
          <h2>🛡️ Security Roadmap</h2>
          <p>Our commitment to building trust through progressive security enhancements:</p>
          
          <div className="security-features">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="security-feature"
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-status">{feature.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CompositeCard>

        {/* Privacy Principles */}
        <CompositeCard variant="elevated" className="trust-section">
          <h2>🔐 Privacy Principles</h2>
          <p>Our commitment to protecting your privacy and data:</p>
          
          <ul className="privacy-list">
            {privacyPrinciples.map((principle, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {principle}
              </motion.li>
            ))}
          </ul>
        </CompositeCard>

        {/* Legal Documents */}
        <CompositeCard variant="elevated" className="trust-section">
          <h2>📄 Legal & Compliance</h2>
          <p>Important legal information and compliance details:</p>
          
          <div className="legal-links">
            <StyledButton
              variant="secondary"
              onClick={() => window.open('/terms', '_blank')}
              style={{ marginRight: '12px' }}
            >
              📋 Terms of Use
            </StyledButton>
            <StyledButton
              variant="secondary"
              onClick={() => window.open('/privacy', '_blank')}
            >
              🔒 Privacy Policy
            </StyledButton>
          </div>
          
          <div className="legal-note">
            <small>
              Note: These are placeholder documents for the Galileo Initiative. 
              Final versions will be available before public launch.
            </small>
          </div>
        </CompositeCard>

        {/* Contact Information */}
        <CompositeCard variant="elevated" className="trust-section">
          <h2>📧 Contact & Support</h2>
          <p>Have questions about security, privacy, or trust? We're here to help:</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <strong>Security & Trust:</strong>
              <a href="mailto:trust@alphaframe.io">trust@alphaframe.io</a>
            </div>
            <div className="contact-item">
              <strong>General Support:</strong>
              <a href="mailto:support@alphaframe.io">support@alphaframe.io</a>
            </div>
            <div className="contact-item">
              <strong>Feedback & Suggestions:</strong>
              <span>Use the feedback button in the bottom-right corner</span>
            </div>
          </div>
        </CompositeCard>

        {/* Galileo Initiative Notice */}
        <CompositeCard variant="elevated" className="trust-section galileo-notice">
          <h2>🚀 Galileo Initiative</h2>
          <p>
            You're part of AlphaFrame's private pilot program. Your feedback and usage patterns 
            are helping us build a more secure, user-friendly, and valuable financial automation platform.
          </p>
          <p>
            <strong>Thank you for being an early adopter!</strong> Your input directly shapes 
            AlphaFrame's development and security priorities.
          </p>
        </CompositeCard>
      </motion.div>

      <style>{`
        .trust-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .trust-page-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .trust-hero {
          text-align: center;
          color: white;
          margin-bottom: 20px;
        }

        .trust-hero h1 {
          font-size: 48px;
          margin: 0 0 16px 0;
          font-weight: 700;
        }

        .trust-subtitle {
          font-size: 20px;
          margin: 0;
          opacity: 0.9;
          line-height: 1.5;
        }

        .trust-section {
          padding: 32px;
        }

        .trust-section h2 {
          margin: 0 0 16px 0;
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
        }

        .trust-section p {
          margin: 0 0 20px 0;
          color: #4a5568;
          line-height: 1.6;
        }

        .demo-notice {
          background: #fed7d7;
          border: 1px solid #feb2b2;
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
          color: #c53030;
        }

        .security-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 24px;
        }

        .security-feature {
          display: flex;
          gap: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f7fafc;
        }

        .feature-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .feature-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
        }

        .feature-content p {
          margin: 0 0 8px 0;
          color: #4a5568;
          line-height: 1.5;
        }

        .feature-status {
          display: inline-block;
          background: #4299e1;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .privacy-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 0 0;
        }

        .privacy-list li {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
          position: relative;
          padding-left: 24px;
        }

        .privacy-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #48bb78;
          font-weight: bold;
        }

        .privacy-list li:last-child {
          border-bottom: none;
        }

        .legal-links {
          margin: 20px 0;
        }

        .legal-note {
          margin-top: 16px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
          color: #718096;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .contact-item:last-child {
          border-bottom: none;
        }

        .contact-item a {
          color: #4299e1;
          text-decoration: none;
          font-weight: 500;
        }

        .contact-item a:hover {
          text-decoration: underline;
        }

        .galileo-notice {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .galileo-notice h2,
        .galileo-notice p {
          color: white;
        }

        @media (max-width: 768px) {
          .trust-hero h1 {
            font-size: 36px;
          }

          .trust-subtitle {
            font-size: 18px;
          }

          .trust-section {
            padding: 24px;
          }

          .security-feature {
            flex-direction: column;
            text-align: center;
          }

          .contact-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default TrustPage; 