import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DashboardReal from '../components/dashboard/DashboardReal';
import DemoBanner from '../components/ui/DemoBanner';
import ResetDemoButton from '../components/ui/ResetDemoButton';
import { useAppStore } from '../store/useAppStore';

const mockTransactions = [
  { id: 'demo1', description: 'Sample Coffee', amount: 4.50, date: '2025-06-01' },
  { id: 'demo2', description: 'Groceries', amount: 72.13, date: '2025-06-03' }
];

const DashboardPage = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDemo } = useAppStore();

  useEffect(() => {
    const isDemo = sessionStorage.getItem('demo_user') === 'true';
    const hasCompleted = localStorage.getItem('alphaframe_onboarding_complete');
    if (!hasCompleted) navigate('/onboarding');

    if (isDemo) {
      setTransactions(mockTransactions);
      setLoading(false);
    } else if (user) {
      // Replace with your real data fetch:
      setTransactions([]); // or fetch real transactions
      setLoading(false);
    }
  }, [user, navigate]);

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