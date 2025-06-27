import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import realTimeSyncService from '../../lib/services/RealTimeSyncService';
import './LiveFinancialDashboard.css';

/**
 * LiveFinancialDashboard - Real-time financial data visualization
 * 
 * Purpose: Displays live financial data with real-time updates,
 * creating a dynamic, engaging dashboard that feels current and
 * trustworthy. Similar to modern trading platforms.
 * 
 * Procedure:
 * 1. Subscribes to real-time data streams
 * 2. Displays live account balances, transactions, and market data
 * 3. Animates data changes with smooth transitions
 * 4. Provides visual feedback for real-time updates
 * 
 * Conclusion: Users experience a live, responsive financial
 * platform that builds trust through real-time transparency.
 */
const LiveFinancialDashboard = () => {
  const [accountBalances, setAccountBalances] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [portfolioValue, setPortfolioValue] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Initialize real-time sync
    const initializeSync = async () => {
      const success = await realTimeSyncService.initialize();
      if (success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    initializeSync();

    // Subscribe to real-time updates
    const unsubscribeBalances = realTimeSyncService.subscribe(
      realTimeSyncService.dataTypes.ACCOUNT_BALANCE,
      (data) => {
        setAccountBalances(data.data);
        setLastUpdate(new Date());
      }
    );

    const unsubscribeTransactions = realTimeSyncService.subscribe(
      realTimeSyncService.dataTypes.TRANSACTION,
      (data) => {
        setRecentTransactions(prev => {
          const newTransactions = [...data.data, ...prev.slice(0, 4)];
          return newTransactions.slice(0, 5);
        });
        setLastUpdate(new Date());
      }
    );

    const unsubscribeMarketData = realTimeSyncService.subscribe(
      realTimeSyncService.dataTypes.MARKET_DATA,
      (data) => {
        setMarketData(data.data);
        setLastUpdate(new Date());
      }
    );

    const unsubscribePortfolio = realTimeSyncService.subscribe(
      realTimeSyncService.dataTypes.PORTFOLIO_VALUE,
      (data) => {
        setPortfolioValue(data.data);
        setLastUpdate(new Date());
      }
    );

    const unsubscribeAlerts = realTimeSyncService.subscribe(
      realTimeSyncService.dataTypes.ALERT,
      (data) => {
        setAlerts(prev => {
          const newAlerts = [...data.data, ...prev.slice(0, 2)];
          return newAlerts.slice(0, 3);
        });
        setLastUpdate(new Date());
      }
    );

    const unsubscribeStatus = realTimeSyncService.subscribe('status', (data) => {
      setConnectionStatus(data.status);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeBalances();
      unsubscribeTransactions();
      unsubscribeMarketData();
      unsubscribePortfolio();
      unsubscribeAlerts();
      unsubscribeStatus();
      realTimeSyncService.disconnect();
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'var(--color-success)';
    if (change < 0) return 'var(--color-error)';
    return 'var(--color-text-secondary)';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'var(--color-success)';
      case 'connecting': return 'var(--color-warning)';
      case 'disconnected': return 'var(--color-error)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="live-financial-dashboard">
      {/* Connection Status */}
      <div className="connection-status">
        <div 
          className="status-indicator"
          style={{ backgroundColor: getConnectionStatusColor() }}
        />
        <span className="status-text">
          {connectionStatus === 'connected' ? 'Live Data' : 'Connecting...'}
        </span>
        {lastUpdate && (
          <span className="last-update">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Account Balances */}
        <motion.div 
          className="dashboard-card account-balances"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Account Balances</h3>
          <AnimatePresence>
            {accountBalances.map((account, index) => (
              <motion.div
                key={account.id}
                className="account-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="account-info">
                  <span className="account-name">{account.name}</span>
                  <span className="account-balance">
                    {formatCurrency(account.balance)}
                  </span>
                </div>
                <div className="account-meta">
                  <span className="last-updated">
                    Updated: {new Date(account.lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Market Data */}
        <motion.div 
          className="dashboard-card market-data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>Market Overview</h3>
          <AnimatePresence>
            {Object.entries(marketData).map(([index, data], i) => (
              <motion.div
                key={index}
                className="market-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="market-index">
                  <span className="index-name">{index.toUpperCase()}</span>
                  <span className="index-value">{data.value.toFixed(2)}</span>
                </div>
                <div className="market-change">
                  <span 
                    className="change-value"
                    style={{ color: getChangeColor(data.changePercent) }}
                  >
                    {formatPercentage(data.changePercent)}
                  </span>
                  <span 
                    className="change-amount"
                    style={{ color: getChangeColor(data.change) }}
                  >
                    {formatCurrency(data.change)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio Value */}
        <motion.div 
          className="dashboard-card portfolio-value"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>Portfolio</h3>
          <AnimatePresence>
            {portfolioValue.totalValue && (
              <motion.div
                className="portfolio-summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="total-value">
                  <span className="value-label">Total Value</span>
                  <span className="value-amount">
                    {formatCurrency(portfolioValue.totalValue)}
                  </span>
                </div>
                <div className="daily-change">
                  <span 
                    className="change-percent"
                    style={{ color: getChangeColor(portfolioValue.dailyChangePercent) }}
                  >
                    {formatPercentage(portfolioValue.dailyChangePercent)}
                  </span>
                  <span 
                    className="change-amount"
                    style={{ color: getChangeColor(portfolioValue.dailyChange) }}
                  >
                    {formatCurrency(portfolioValue.dailyChange)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          className="dashboard-card recent-transactions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Recent Activity</h3>
          <AnimatePresence>
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="transaction-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="transaction-info">
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                  <span className="transaction-account">
                    {transaction.account}
                  </span>
                </div>
                <div className="transaction-amount">
                  <span 
                    className="amount"
                    style={{ color: transaction.amount >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
                  >
                    {formatCurrency(transaction.amount)}
                  </span>
                  <span className="transaction-time">
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Live Alerts */}
        <motion.div 
          className="dashboard-card live-alerts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>Live Alerts</h3>
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`alert-item ${alert.severity}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="alert-header">
                  <span className="alert-title">{alert.title}</span>
                  <span className="alert-severity">{alert.severity}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveFinancialDashboard; 