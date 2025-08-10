import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardReal from '../components/dashboard/DashboardReal';
import DemoBanner from '../components/ui/DemoBanner';
import ResetDemoButton from '../components/ui/ResetDemoButton';
import useAppStore from '../store/useAppStore';
import DemoModeService from '../lib/services/DemoModeService';
import { trackEvent } from '@/lib/services/AnalyticsService.js';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { 
    isDemo, 
    onboardingComplete, 
    shouldBypassOnboarding,
    getTransactions,
    getRules,
    getTriggeredRules
  } = useAppStore();

  useEffect(() => {
    // Check if user should be on dashboard (never redirect demo)
    if (!isDemo && !shouldBypassOnboarding()) {
      console.log('🔧 DashboardPage: User needs onboarding, redirecting');
      navigate('/onboarding');
      return;
    }

    // Demo users or completed onboarding users can access dashboard
    console.log('🔧 DashboardPage: User can access dashboard', { isDemo, onboardingComplete });
    trackEvent('dashboard_viewed', { mode: isDemo ? 'demo' : 'auth' });
    setLoading(false);
  }, [shouldBypassOnboarding, navigate, isDemo, onboardingComplete]);

  if (loading) return <div className="dashboard-container" data-testid="dashboard-root"><h1>Financial Dashboard</h1></div>;

  return (
    <div className="dashboard-container" data-testid="dashboard-root" style={{ position: 'relative', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {isDemo && <DemoBanner />}
      {isDemo && <ResetDemoButton />}
      <DashboardReal />
    </div>
  );
};

export default DashboardPage;