import React from 'react';
import Dashboard2 from '../components/dashboard/Dashboard2';
import PageLayout from '../components/PageLayout';
import CompositeCard from '../components/ui/CompositeCard';

/**
 * Dashboard2Test - Test page for Dashboard 2.0
 * 
 * Purpose: Provides a testing environment to verify Dashboard 2.0
 * components render correctly with mock data and interactions.
 * 
 * Procedure:
 * 1. Renders the new Dashboard 2.0 with test data
 * 2. Allows testing of CSS Grid layout and WhatsNext hero
 * 3. Verifies responsive behavior and animations
 * 4. Tests component interactions and state changes
 * 
 * Conclusion: Ensures Dashboard 2.0 works as expected before
 * integration into the main application.
 */
const Dashboard2Test = () => {
  // Mock financial state data for testing Dashboard 2.0
  const mockFinancialState = {
    cashflow: {
      income: 7500,
      expenses: 5200,
      netFlow: 2300,
      categories: {
        housing: 1800,
        food: 800,
        transportation: 600,
        entertainment: 400,
        utilities: 300
      },
      trend: 'improving'
    },
    insights: {
      currentTrajectory: {
        fiveYearNetWorth: 125000,
        retirementAge: 62,
        financialFreedomAge: 58
      },
      scenarios: {
        optimistic: {
          netWorth: 150000,
          yearsToGoal: 4,
          description: 'Aggressive savings and investment strategy',
          actions: [
            'Increase savings rate to 30%',
            'Invest in diversified portfolio',
            'Optimize tax strategies'
          ]
        },
        conservative: {
          netWorth: 100000,
          yearsToGoal: 6,
          description: 'Steady, low-risk approach',
          actions: [
            'Maintain current savings rate',
            'Focus on debt reduction',
            'Build emergency fund'
          ]
        }
      },
      projections: {
        optimistic: {
          1: 45000,
          2: 65000,
          3: 90000,
          4: 120000,
          5: 150000
        },
        conservative: {
          1: 35000,
          2: 50000,
          3: 65000,
          4: 80000,
          5: 100000
        }
      },
      insights: [
        {
          icon: '📈',
          title: 'Strong Savings Rate',
          description: 'Your 20% savings rate is excellent for building wealth.',
          impact: '+$25,000 in 5 years'
        },
        {
          icon: '💡',
          title: 'Investment Opportunity',
          description: 'Consider investing excess savings for better returns.',
          impact: '+$15,000 potential gain'
        }
      ]
    },
    netWorth: {
      current: 35000,
      history: [],
      milestones: [
        { name: 'Emergency Fund', amount: 10000 },
        { name: 'First $50K', amount: 50000 },
        { name: 'Six Figures', amount: 100000 }
      ]
    },
    recentChanges: {
      changes: [
        {
          type: 'income',
          title: 'Salary Increase',
          description: 'Annual salary review completed',
          amount: 500,
          timestamp: '2 hours ago'
        },
        {
          type: 'savings',
          title: 'Emergency Fund Goal',
          description: 'Reached 80% of emergency fund target',
          amount: 2000,
          timestamp: '1 day ago'
        },
        {
          type: 'expense',
          title: 'Car Maintenance',
          description: 'Regular maintenance and repairs',
          amount: -300,
          timestamp: '3 days ago'
        }
      ]
    },
    actionQueue: {
      actions: [
        {
          type: 'review',
          title: 'Review Investment Portfolio',
          description: 'Quarterly portfolio review due',
          priority: 'medium',
          deadline: 'Next week'
        },
        {
          type: 'setup',
          title: 'Setup Automated Savings',
          description: 'Configure automatic transfers to savings',
          priority: 'high',
          deadline: 'This week'
        },
        {
          type: 'complete',
          title: 'Emergency Fund Goal',
          description: 'Complete emergency fund setup',
          priority: 'high',
          deadline: 'This month'
        }
      ]
    }
  };

  // Mock user context
  const mockUserContext = {
    userType: 'powerUser',
    isMobile: false,
    preferences: {
      theme: 'light'
    }
  };

  return (
    <PageLayout>
      <CompositeCard style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>
          Dashboard 2.0 Test Page
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-base)' }}>
          Testing Dashboard 2.0 with CSS Grid layout and WhatsNext hero component
        </p>
      </CompositeCard>
      
      {/* Mock the financial state store for testing */}
      <div style={{ display: 'none' }}>
        {/* This div contains the mock data that would normally come from the store */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__MOCK_FINANCIAL_STATE__ = ${JSON.stringify(mockFinancialState)};
              window.__MOCK_USER_CONTEXT__ = ${JSON.stringify(mockUserContext)};
            `
          }}
        />
      </div>
      
      <Dashboard2 />
    </PageLayout>
  );
};

export default Dashboard2Test; 