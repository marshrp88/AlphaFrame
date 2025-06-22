import React, { useEffect } from 'react';
import { useFinancialStateStore } from '@/core/store/financialStateStore';

function Home() {
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

    // Log current state
    const balance = getAccountBalance('test_account');
    const goal = getGoal('test_goal');

    console.log('Financial State Test:', {
      balance,
      goal
    });
  }, []);

  return (
    <div className="p-4">
      <h1>Home Page</h1>
      <div className="mt-4">
        <h2>Financial State Test</h2>
        <p>Check the console for store integration test results</p>
        <p>Current Balance: ${getAccountBalance('test_account')}</p>
        {getGoal('test_goal') && (
          <div>
            <p>Goal: {getGoal('test_goal').name}</p>
            <p>Progress: ${getGoal('test_goal').currentAmount} / ${getGoal('test_goal').targetAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 
