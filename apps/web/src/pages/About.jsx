/**
 * About.jsx - AlphaFrame VX.1 Consumer-Ready About Page
 * 
 * Purpose: Provides users with comprehensive information about AlphaFrame,
 * its mission, team, and technology stack in a professional, engaging format.
 * 
 * Procedure:
 * 1. Uses PageLayout for consistent page structure
 * 2. Implements CompositeCard for content organization
 * 3. Uses design system components for professional appearance
 * 4. Applies motion animations for enhanced UX
 * 5. Provides comprehensive company and product information
 * 
 * Conclusion: Delivers a cohesive, modern about page that builds trust
 * and provides transparency about AlphaFrame's mission and capabilities.
 */

import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';
import StatusBadge from '../components/ui/StatusBadge';
import { 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Target, 
  Award,
  Globe,
  Code,
  Database,
  Lock
} from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <PageLayout title="About AlphaFrame" description="Learn about our mission, team, and technology.">
      <motion.div
        className="about-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <motion.div
          className="about-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CompositeCard variant="elevated" className="hero-card">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">About AlphaFrame</h1>
                <p className="hero-subtitle">
                  Empowering individuals with intelligent financial management through 
                  cutting-edge technology and unwavering commitment to security.
                </p>
                <div className="hero-badges">
                  <StatusBadge variant="success" size="sm">
                    <Shield size={12} />
                    Bank-Level Security
                  </StatusBadge>
                  <StatusBadge variant="primary" size="sm">
                    <Zap size={12} />
                    AI-Powered
                  </StatusBadge>
                  <StatusBadge variant="secondary" size="sm">
                    <Heart size={12} />
                    User-First Design
                  </StatusBadge>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="mission-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CompositeCard className="mission-card">
            <div className="section-header">
              <Target className="section-icon" />
              <h2 className="section-title">Our Mission</h2>
            </div>
            <div className="mission-content">
              <p className="mission-text">
                AlphaFrame was born from a simple belief: everyone deserves access to 
                intelligent financial tools that work as hard as they do. We're building 
                the future of personal finance management, where AI meets human insight 
                to create a more secure, efficient, and empowering financial experience.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <Heart className="value-icon" />
                  <h3>User-Centric</h3>
                  <p>Every feature is designed with real user needs in mind</p>
                </div>
                <div className="value-item">
                  <Shield className="value-icon" />
                  <h3>Security First</h3>
                  <p>Bank-level security protocols protect your financial data</p>
                </div>
                <div className="value-item">
                  <Zap className="value-icon" />
                  <h3>Innovation</h3>
                  <p>Cutting-edge AI and automation for smarter decisions</p>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          className="tech-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CompositeCard className="tech-card">
            <div className="section-header">
              <Code className="section-icon" />
              <h2 className="section-title">Technology Stack</h2>
            </div>
            <div className="tech-grid">
              <div className="tech-category">
                <h3 className="tech-category-title">Frontend</h3>
                <div className="tech-items">
                  <StatusBadge variant="primary" size="sm">React 18</StatusBadge>
                  <StatusBadge variant="primary" size="sm">Vite</StatusBadge>
                  <StatusBadge variant="primary" size="sm">Framer Motion</StatusBadge>
                  <StatusBadge variant="primary" size="sm">CSS Grid</StatusBadge>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="tech-category-title">Backend</h3>
                <div className="tech-items">
                  <StatusBadge variant="secondary" size="sm">Node.js</StatusBadge>
                  <StatusBadge variant="secondary" size="sm">Express</StatusBadge>
                  <StatusBadge variant="secondary" size="sm">MongoDB</StatusBadge>
                  <StatusBadge variant="secondary" size="sm">Redis</StatusBadge>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="tech-category-title">Security</h3>
                <div className="tech-items">
                  <StatusBadge variant="success" size="sm">Auth0</StatusBadge>
                  <StatusBadge variant="success" size="sm">Plaid</StatusBadge>
                  <StatusBadge variant="success" size="sm">SSL/TLS</StatusBadge>
                  <StatusBadge variant="success" size="sm">Encryption</StatusBadge>
                </div>
              </div>
              <div className="tech-category">
                <h3 className="tech-category-title">AI & ML</h3>
                <div className="tech-items">
                  <StatusBadge variant="warning" size="sm">TensorFlow</StatusBadge>
                  <StatusBadge variant="warning" size="sm">OpenAI API</StatusBadge>
                  <StatusBadge variant="warning" size="sm">Predictive Analytics</StatusBadge>
                  <StatusBadge variant="warning" size="sm">Pattern Recognition</StatusBadge>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="team-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CompositeCard className="team-card">
            <div className="section-header">
              <Users className="section-icon" />
              <h2 className="section-title">Our Team</h2>
            </div>
            <div className="team-content">
              <p className="team-intro">
                AlphaFrame is built by a passionate team of engineers, designers, and 
                financial experts who believe in the power of technology to transform 
                personal finance.
              </p>
              <div className="team-stats">
                <div className="stat-item">
                  <Award className="stat-icon" />
                  <div className="stat-content">
                    <h3 className="stat-number">10+</h3>
                    <p className="stat-label">Years Experience</p>
                  </div>
                </div>
                <div className="stat-item">
                  <Globe className="stat-icon" />
                  <div className="stat-content">
                    <h3 className="stat-number">50+</h3>
                    <p className="stat-label">Countries Served</p>
                  </div>
                </div>
                <div className="stat-item">
                  <Lock className="stat-icon" />
                  <div className="stat-content">
                    <h3 className="stat-number">99.9%</h3>
                    <p className="stat-label">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="contact-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <CompositeCard className="contact-card">
            <div className="section-header">
              <Users className="section-icon" />
              <h2 className="section-title">Get in Touch</h2>
            </div>
            <div className="contact-content">
              <p className="contact-text">
                Have questions about AlphaFrame? We'd love to hear from you. 
                Our team is here to help you get the most out of your financial management.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Email:</strong> support@alphaframe.com
                </div>
                <div className="contact-item">
                  <strong>Support Hours:</strong> 24/7
                </div>
                <div className="contact-item">
                  <strong>Response Time:</strong> &lt; 2 hours
                </div>
              </div>
            </div>
          </CompositeCard>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default About; 