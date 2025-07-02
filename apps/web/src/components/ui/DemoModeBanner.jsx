/**
 * DemoModeBanner.jsx - Trust & Transparency Component
 * 
 * Purpose: Provide clear disclosure when AlphaFrame is running in demo mode,
 * ensuring users understand what is real vs. simulated functionality.
 * 
 * Procedure:
 * 1. Display persistent banner in demo/test environments
 * 2. Show clear messaging about simulated features
 * 3. Provide toggle to switch between demo and real modes
 * 4. Track user interactions for analytics
 * 
 * Conclusion: Builds user trust through transparency about data sources
 * and feature limitations in demo environments.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info, Shield, Zap } from 'lucide-react';
import { useToast } from './use-toast';

const DemoModeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();
  
  // Check if we're in demo mode - ALWAYS show in development
  const isDemoMode = process.env.NODE_ENV === 'development' || 
                    localStorage.getItem('alphaframe_demo_mode') === 'true' ||
                    window.location.hostname.includes('localhost') ||
                    true; // Force demo mode for recovery sprint

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('alphaframe_demo_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('alphaframe_demo_banner_dismissed', 'true');
    
    toast({
      title: "Demo Mode Active",
      description: "You can toggle demo mode anytime in settings.",
      variant: "default"
    });
  };

  const handleToggleDemoMode = () => {
    const currentMode = localStorage.getItem('alphaframe_demo_mode') === 'true';
    const newMode = !currentMode;
    
    localStorage.setItem('alphaframe_demo_mode', newMode.toString());
    
    // Reload page to apply changes
    window.location.reload();
  };

  const handleConnectRealAccount = () => {
    toast({
      title: "Connect Real Account",
      description: "You'll be redirected to connect your bank account securely via Plaid.",
      variant: "default"
    });
    
    // Navigate to onboarding with real account flag
    window.location.href = '/onboarding?mode=real';
  };

  if (!isDemoMode || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="demo-mode-banner"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'var(--color-warning-50)',
            borderBottom: '2px solid var(--color-warning-200)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-warning-800)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} style={{ color: 'var(--color-warning-600)' }} />
            <span>
              <strong>Demo Mode Active:</strong> You're using AlphaFrame with simulated data. 
              Some features are for demonstration purposes.
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleConnectRealAccount}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-700)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-600)';
              }}
            >
              <Shield size={12} />
              Connect Real Account
            </button>
            
            <button
              onClick={handleToggleDemoMode}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-muted-200)',
                color: 'var(--color-text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-muted-300)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-muted-200)';
              }}
            >
              <Zap size={12} />
              Toggle Mode
            </button>
            
            <button
              onClick={handleDismiss}
              style={{
                padding: '0.25rem',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-muted-100)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoModeBanner; 