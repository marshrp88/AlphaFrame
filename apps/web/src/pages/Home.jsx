import React, { useEffect } from 'react';
import { useFinancialStateStore } from '@/core/store/financialStateStore';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';

const Home = () => {
  // Get store functions
  const { setAccountBalance, getAccountBalance, setGoal, getGoal } = useFinancialStateStore();

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

  return (
    <PageLayout>
      <CompositeCard>
        {/* Debug span for test diagnostics */}
        <span data-testid="page-mounted" style={{ display: 'none' }}>Home Page Mounted</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>
          Home Page
        </h1>
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)' }}>Financial State Test</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-base)' }}>Check the console for store integration test results</p>
          <p>Current Balance: ${getAccountBalance('test_account')}</p>
          {getGoal('test_goal') && (
            <div>
              <p>Goal: {getGoal('test_goal').name}</p>
              <p>Progress: ${getGoal('test_goal').currentAmount} / ${getGoal('test_goal').targetAmount}</p>
            </div>
          )}
        </div>
      </CompositeCard>
    </PageLayout>
  );
};

export default Home; 
