import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardReal from '../components/dashboard/DashboardReal';
import DemoBanner from '../components/ui/DemoBanner';
import ResetDemoButton from '../components/ui/ResetDemoButton';
import useAppStore from '../store/useAppStore';
import DemoModeService from '../lib/services/DemoModeService';

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
    // Check if user should be on dashboard
    if (!shouldBypassOnboarding()) {
      console.log('🔧 DashboardPage: User needs onboarding, redirecting');
      navigate('/onboarding');
      return;
    }

    // Demo users or completed onboarding users can access dashboard
    console.log('🔧 DashboardPage: User can access dashboard', { isDemo, onboardingComplete });
    setLoading(false);
  }, [shouldBypassOnboarding, navigate, isDemo, onboardingComplete]);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="dashboard-container" style={{ position: 'relative', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {isDemo && <DemoBanner />}
      {isDemo && <ResetDemoButton />}
      <DashboardReal />
    </div>
  );
};

export default DashboardPage;