/**
 * Home.jsx - AlphaFrame VX.1 Consumer-Ready Home Page
 * 
 * Purpose: Provides users with a welcoming, informative home page that
 * showcases AlphaFrame's capabilities and guides users to key features.
 * 
 * Procedure:
 * 1. Uses PageLayout for consistent page structure
 * 2. Implements CompositeCard for content organization
 * 3. Uses design system components for professional appearance
 * 4. Applies motion animations for enhanced UX
 * 5. Integrates financial state store for dynamic content
 * 
 * Conclusion: Delivers a cohesive, modern home page that builds trust
 * and guides users to key features and functionality.
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFinancialStateStore } from '@/core/store/financialStateStore';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';
import StyledButton from '../components/ui/StyledButton';
import StatusBadge from '../components/ui/StatusBadge';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Target, 
  ArrowRight,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // Get store functions
  const { setAccountBalance, getAccountBalance, setGoal, getGoal } = useFinancialStateStore();
  const navigate = useNavigate();

  // Test store functionality
  useEffect(() => {
    // Set up test data
    setAccountBalance('test_account', 1000);
    setGoal('test_goal', {
      name: 'Test Goal',
      targetAmount: 5000,
      currentAmount: 0,
      deadline: '2024-12-31'
    });
  }, []);

  const currentBalance = getAccountBalance('test_account');
  const currentGoal = getGoal('test_goal');
  const goalProgress = currentGoal ? (currentGoal.currentAmount / currentGoal.targetAmount) * 100 : 0;

  return (
    <PageLayout>
      <motion.div
        className="home-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Debug span for test diagnostics */}
        <span data-testid="page-mounted" style={{ display: 'none' }}>Home Page Mounted</span>

        {/* Hero Section */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CompositeCard variant="elevated" className="hero-card">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome to AlphaFrame</h1>
                <p className="hero-subtitle">
                  Your intelligent financial companion for smarter money management
                </p>
                <div className="hero-features">
                  <StatusBadge variant="success" size="sm">
                    <CheckCircle size={12} />
                    Secure & Private
                  </StatusBadge>
                  <StatusBadge variant="primary" size="sm">
                    <Zap size={12} />
                    AI-Powered
                  </StatusBadge>
                  <StatusBadge variant="secondary" size="sm">
                    <Shield size={12} />
                    Bank-Level Security
                  </StatusBadge>
                </div>
              </div>
              <div className="hero-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <StyledButton size="lg" className="primary-action"
                  onClick={() => {
                    console.log('CTA: Get Started clicked');
                    navigate('/onboarding');
                  }}
                >
                  Get Started
                  <ArrowRight size={16} />
                </StyledButton>
                <StyledButton variant="secondary" size="lg"
                  onClick={() => {
                    console.log('CTA: Learn More clicked');
                    navigate('/about');
                  }}
                >
                  Learn More
                </StyledButton>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="features-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CompositeCard variant="elevated" className="feature-card">
            <div className="feature-icon">
              <TrendingUp className="icon" />
            </div>
            <h3 className="feature-title">Smart Analytics</h3>
            <p className="feature-description">
              Get insights into your spending patterns and financial health with AI-powered analytics.
            </p>
          </CompositeCard>

          <CompositeCard variant="elevated" className="feature-card">
            <div className="feature-icon">
              <Zap className="icon" />
            </div>
            <h3 className="feature-title">Automated Rules</h3>
            <p className="feature-description">
              Set up intelligent rules that automatically manage your finances based on your preferences.
            </p>
          </CompositeCard>

          <CompositeCard variant="elevated" className="feature-card">
            <div className="feature-icon">
              <Target className="icon" />
            </div>
            <h3 className="feature-title">Goal Tracking</h3>
            <p className="feature-description">
              Set financial goals and track your progress with visual progress indicators.
            </p>
          </CompositeCard>

          <CompositeCard variant="elevated" className="feature-card">
            <div className="feature-icon">
              <BarChart3 className="icon" />
            </div>
            <h3 className="feature-title">Real-time Dashboard</h3>
            <p className="feature-description">
              Monitor your financial status in real-time with our comprehensive dashboard.
            </p>
          </CompositeCard>
        </motion.div>

        {/* Financial Status Section */}
        <motion.div
          className="status-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CompositeCard className="status-card">
            <div className="status-header">
              <h2 className="status-title">Your Financial Status</h2>
              <p className="status-subtitle">Current account information and goals</p>
            </div>
            
            <div className="status-grid">
              <div className="status-item">
                <div className="status-item-header">
                  <DollarSign className="status-icon" />
                  <h3 className="status-item-title">Current Balance</h3>
                </div>
                <p className="status-value">${currentBalance?.toLocaleString() || '0'}</p>
                <p className="status-label">Available funds</p>
              </div>

              {currentGoal && (
                <div className="status-item">
                  <div className="status-item-header">
                    <Target className="status-icon" />
                    <h3 className="status-item-title">{currentGoal.name}</h3>
                  </div>
                  <p className="status-value">
                    ${currentGoal.currentAmount?.toLocaleString() || '0'} / ${currentGoal.targetAmount?.toLocaleString() || '0'}
                  </p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(goalProgress, 100)}%` }}
                      />
                    </div>
                    <span className="progress-text">{Math.round(goalProgress)}%</span>
                  </div>
                </div>
              )}
            </div>
          </CompositeCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CompositeCard className="actions-card">
            <h2 className="actions-title">Quick Actions</h2>
            <div className="actions-grid">
              <StyledButton variant="outline" className="action-button">
                <BarChart3 size={16} />
                View Dashboard
              </StyledButton>
              <StyledButton variant="outline" className="action-button">
                <Zap size={16} />
                Create Rule
              </StyledButton>
              <StyledButton variant="outline" className="action-button">
                <Target size={16} />
                Set Goal
              </StyledButton>
              <StyledButton variant="outline" className="action-button">
                <TrendingUp size={16} />
                View Analytics
              </StyledButton>
            </div>
          </CompositeCard>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default Home; 
