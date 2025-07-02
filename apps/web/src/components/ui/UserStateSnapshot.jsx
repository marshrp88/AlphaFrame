/**
 * UserStateSnapshot Component - Galileo Initiative Progress Tracking
 * 
 * Purpose: Shows users their progress and engagement metrics after onboarding
 * to encourage continued usage and feedback during the Galileo Initiative
 * 
 * Procedure:
 * 1. Displays onboarding completion status
 * 2. Shows number of rules created
 * 3. Provides quick feedback access
 * 4. Tracks engagement metrics
 * 5. Encourages continued exploration
 * 
 * Conclusion: Creates a sense of progress and accomplishment while
 * maintaining engagement for the Galileo Initiative validation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StyledButton from './StyledButton.jsx';

const UserStateSnapshot = ({ onFeedbackClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userStats, setUserStats] = useState({
    onboardingCompleted: false,
    rulesCreated: 0,
    insightsViewed: 0,
    feedbackSubmitted: 0
  });

  useEffect(() => {
    // Check if onboarding was recently completed
    const onboardingCompleted = localStorage.getItem('alphaframe_onboarding_completed');
    const lastShown = localStorage.getItem('alphaframe_snapshot_last_shown');
    const now = Date.now();
    
    if (onboardingCompleted && (!lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000)) {
      // Get user stats from localStorage
      const rules = JSON.parse(localStorage.getItem('alphaframe_rules') || '[]');
      const feedback = JSON.parse(localStorage.getItem('alphaframe_feedback') || '[]');
      const insights = JSON.parse(localStorage.getItem('alphaframe_insights_viewed') || '[]');
      
      setUserStats({
        onboardingCompleted: true,
        rulesCreated: rules.length,
        insightsViewed: insights.length,
        feedbackSubmitted: feedback.length
      });
      
      // Show snapshot after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('alphaframe_snapshot_last_shown', now.toString());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleFeedbackClick = () => {
    if (onFeedbackClick) {
      onFeedbackClick();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="user-snapshot-container"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          zIndex: 999,
          width: '300px'
        }}
      >
        <CompositeCard variant="elevated" className="snapshot-card">
          <div className="snapshot-header">
            <h4>🎯 Your AlphaFrame Progress</h4>
            <button 
              onClick={handleDismiss}
              className="dismiss-button"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#718096'
              }}
            >
              ×
            </button>
          </div>
          
          <div className="snapshot-stats">
            <div className="stat-item">
              <span className="stat-icon">✅</span>
              <span className="stat-label">Onboarding</span>
              <span className="stat-value">Complete</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">📋</span>
              <span className="stat-label">Rules Created</span>
              <span className="stat-value">{userStats.rulesCreated}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">💡</span>
              <span className="stat-label">Insights Viewed</span>
              <span className="stat-value">{userStats.insightsViewed}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">💬</span>
              <span className="stat-label">Feedback Given</span>
              <span className="stat-value">{userStats.feedbackSubmitted}</span>
            </div>
          </div>
          
          <div className="snapshot-actions">
            <StyledButton
              variant="primary"
              size="sm"
              onClick={handleFeedbackClick}
              style={{ width: '100%', marginBottom: '8px' }}
            >
              💬 Share Your Experience
            </StyledButton>
            
            <StyledButton
              variant="secondary"
              size="sm"
              onClick={handleDismiss}
              style={{ width: '100%' }}
            >
              Continue Exploring
            </StyledButton>
          </div>
          
          <div className="snapshot-footer">
            <small>
              🚀 You're helping shape AlphaFrame's future!
            </small>
          </div>
        </CompositeCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserStateSnapshot; 