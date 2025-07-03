import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const mockTransactions = [
  { id: 'demo1', description: 'Sample Coffee', amount: 4.50, date: '2025-06-01' },
  { id: 'demo2', description: 'Groceries', amount: 72.13, date: '2025-06-03' }
];

const DashboardPage = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="dashboard-shell">
      <h1>Dashboard</h1>
      <ul>
        {transactions.map(txn => (
          <li key={txn.id}>{txn.date}: {txn.description} - ${txn.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;