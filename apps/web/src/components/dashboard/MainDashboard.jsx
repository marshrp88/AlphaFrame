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
import { useToast } from '../../components/ui/use-toast.jsx';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        toast({
          title: "Configuration Error",
          description: "Failed to load dashboard configuration.",
          variant: "destructive"
        });
      }
    };

    loadDashboardConfig();
  }, [userContext, toast]);

  // Show loading toast when data is loading
  useEffect(() => {
    if (loading) {
      toast({
        title: "Loading Dashboard",
        description: "Fetching your latest financial data...",
        variant: "default"
      });
    }
  }, [loading, toast]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Dashboard Error",
        description: "Unable to load your financial data. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  /**
   * Handle manual refresh
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(0);
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="dashboard-loading" {...entranceAnimations.fadeIn}>
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading Your Financial Dashboard
        </h2>
        <p className="text-gray-600">
          We're gathering your latest financial insights...
        </p>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="dashboard-error" {...entranceAnimations.fadeIn}>
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to Load Dashboard
        </h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <div className="space-x-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </button>
        </div>
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
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </footer>
    </motion.div>
  );
};

export default MainDashboard; 