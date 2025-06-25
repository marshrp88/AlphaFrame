import React, { useState, useEffect } from 'react';
import { useFinancialState } from '../../core/store/financialStateStore';
import { useUserContext } from '../../core/hooks/useUserContext';
import Cashflow from './sections/Cashflow';
import SimulationInsights from './sections/SimulationInsights';
import NetWorthTrajectory from './sections/NetWorthTrajectory';
import RecentChanges from './sections/RecentChanges';
import ActionQueue from './sections/ActionQueue';
import WhatsNext from './WhatsNext';
import './MainDashboard.css';
import { motion } from 'framer-motion';
import { entranceAnimations, listAnimations } from '../../lib/animations/animationPresets';

/**
 * MainDashboard - The central hub for financial clarity and actionable insights
 * 
 * Purpose: Provides users with a comprehensive view of their financial health
 * and actionable recommendations to improve their financial situation.
 * 
 * Procedure: 
 * 1. Loads financial data from the store
 * 2. Renders context-aware dashboard sections
 * 3. Updates recommendations based on user behavior
 * 4. Provides clear calls-to-action for next steps
 * 
 * Conclusion: Users get a clear, actionable view of their finances with
 * specific guidance on what to do next.
 */
const MainDashboard = () => {
  const { financialState, loading, error } = useFinancialState();
  const { userContext } = useUserContext();
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Load dashboard configuration based on user context
  useEffect(() => {
    const loadDashboardConfig = async () => {
      try {
        // In a real app, this would come from an API
        const config = {
          sections: {
            cashflow: { priority: 1, visible: true },
            insights: { priority: 2, visible: true },
            networth: { priority: 3, visible: true },
            changes: { priority: 4, visible: true },
            actions: { priority: 5, visible: true }
          },
          layout: 'grid',
          theme: userContext?.preferences?.theme || 'light'
        };
        setDashboardConfig(config);
      } catch (err) {
        console.error('Failed to load dashboard config:', err);
      }
    };

    loadDashboardConfig();
  }, [userContext]);

  if (loading) {
    return (
      <motion.div className="dashboard-loading" {...entranceAnimations.fadeIn}>
        <div className="loading-spinner"></div>
        <p>Loading your financial insights...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="dashboard-error" {...entranceAnimations.fadeIn}>
        <h3>Unable to load dashboard</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div className="main-dashboard" {...entranceAnimations.fadeIn}>
      <header className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p className="dashboard-subtitle">
          Your financial clarity and next steps
        </p>
      </header>

      {/* Primary Action Section */}
      <motion.section className="dashboard-primary-action" {...entranceAnimations.slideUp}>
        <WhatsNext 
          financialState={financialState}
          userContext={userContext}
        />
      </motion.section>

      {/* Main Dashboard Grid */}
      <motion.div className="dashboard-grid" {...listAnimations.staggerContainer}>
        {/* Cashflow Section */}
        {dashboardConfig?.sections?.cashflow?.visible && (
          <motion.section className="dashboard-section cashflow-section" {...listAnimations.staggerItem}>
            <Cashflow 
              data={financialState?.cashflow}
              userContext={userContext}
            />
          </motion.section>
        )}

        {/* Simulation Insights */}
        {dashboardConfig?.sections?.insights?.visible && (
          <motion.section className="dashboard-section insights-section" {...listAnimations.staggerItem}>
            <SimulationInsights 
              data={financialState?.insights}
              userContext={userContext}
            />
          </motion.section>
        )}

        {/* Net Worth Trajectory */}
        {dashboardConfig?.sections?.networth?.visible && (
          <motion.section className="dashboard-section networth-section" {...listAnimations.staggerItem}>
            <NetWorthTrajectory 
              data={financialState?.netWorth}
              userContext={userContext}
            />
          </motion.section>
        )}

        {/* Recent Changes */}
        {dashboardConfig?.sections?.changes?.visible && (
          <motion.section className="dashboard-section changes-section" {...listAnimations.staggerItem}>
            <RecentChanges 
              data={financialState?.recentChanges}
              userContext={userContext}
            />
          </motion.section>
        )}

        {/* Action Queue */}
        {dashboardConfig?.sections?.actions?.visible && (
          <motion.section className="dashboard-section actions-section" {...listAnimations.staggerItem}>
            <ActionQueue 
              data={financialState?.actionQueue}
              userContext={userContext}
            />
          </motion.section>
        )}
      </motion.div>

      {/* Dashboard Footer */}
      <footer className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <button 
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </button>
      </footer>
    </motion.div>
  );
};

export default MainDashboard; 