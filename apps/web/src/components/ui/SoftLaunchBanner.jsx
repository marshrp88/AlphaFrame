/**
 * SoftLaunchBanner Component - Galileo Initiative Pilot Welcome
 * 
 * Purpose: Welcomes users to AlphaFrame's private pilot program and sets
 * expectations for the Galileo Initiative validation phase
 * 
 * Procedure:
 * 1. Shows welcome message for pilot users
 * 2. Explains the Galileo Initiative context
 * 3. Encourages feedback and engagement
 * 4. Tracks banner views for analytics
 * 5. Can be dismissed by users
 * 
 * Conclusion: Creates a sense of exclusivity and importance for pilot users
 * while encouraging active participation in the validation process
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackSoftLaunchAccessed } from '@/lib/analytics.js';
import { config } from '@/lib/config.js';
import StyledButton from './StyledButton.jsx';
import CompositeCard from './CompositeCard.jsx';

const SoftLaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show if soft launch is enabled and user hasn't dismissed it
    const dismissed = localStorage.getItem('alphaframe_soft_launch_dismissed');
    if (config.features.softLaunch && !dismissed) {
      // Delay appearance to let page load first
      const timer = setTimeout(() => {
        setIsVisible(true);
        trackSoftLaunchAccessed();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('alphaframe_soft_launch_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="soft-launch-banner"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '600px'
        }}
      >
        <CompositeCard variant="elevated" className="banner-card">
          <div className="banner-content">
            <div className="banner-header">
              <div className="banner-icon">🚀</div>
              <div className="banner-text">
                <h3>Welcome to AlphaFrame's Private Pilot!</h3>
                <p>
                  You're part of the <strong>Galileo Initiative</strong> - our exclusive 
                  pilot program for early adopters. Your feedback shapes our future.
                </p>
              </div>
            </div>
            
            <div className="banner-actions">
              <StyledButton
                variant="secondary"
                size="sm"
                onClick={handleDismiss}
              >
                Got it
              </StyledButton>
            </div>
          </div>
        </CompositeCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default SoftLaunchBanner; 