/**
 * PerformancePage.jsx
 * 
 * PURPOSE: Dedicated performance monitoring page for AlphaFrame Galileo V2.2
 * This page provides comprehensive performance insights and monitoring
 * capabilities for production launch readiness and ongoing optimization.
 * 
 * PROCEDURE:
 * 1. Integrates PerformanceDashboard component
 * 2. Provides performance overview and insights
 * 3. Enables real-time monitoring and alerting
 * 4. Offers performance optimization recommendations
 * 5. Supports production launch readiness assessment
 * 
 * CONCLUSION: Provides comprehensive performance visibility and
 * optimization tools for production launch readiness and ongoing monitoring.
 */

import React, { useState, useEffect } from 'react';
import PerformanceDashboard from '../components/PerformanceDashboard.jsx';
import PerformanceMonitor from '../lib/services/PerformanceMonitor.js';
import BundleAnalyzer from '../lib/services/BundleAnalyzer.js';
import LaunchPreparationService from '../lib/services/LaunchPreparationService.js';
import { Card, Button, Alert, Badge } from '../shared/ui/index.js';
import './PerformancePage.css';

const PerformancePage = () => {
  const [performanceMonitor, setPerformanceMonitor] = useState(null);
  const [bundleAnalyzer, setBundleAnalyzer] = useState(null);
  const [launchService, setLaunchService] = useState(null);
  const [performanceData, setPerformanceData] = useState({});
  const [launchStatus, setLaunchStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeServices();
  }, []);

  useEffect(() => {
    if (performanceMonitor && bundleAnalyzer && launchService) {
      const interval = setInterval(updateData, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [performanceMonitor, bundleAnalyzer, launchService]);

  /**
   * Initialize performance services
   */
  const initializeServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize services
      const monitor = new PerformanceMonitor();
      const analyzer = new BundleAnalyzer();
      const launch = new LaunchPreparationService();

      await Promise.all([
        monitor.initialize(),
        analyzer.analyzeBundle(),
        launch.initialize()
      ]);

      setPerformanceMonitor(monitor);
      setBundleAnalyzer(analyzer);
      setLaunchService(launch);

      // Get initial data
      await updateData();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /**
   * Update performance and launch data
   */
  const updateData = async () => {
    try {
      if (performanceMonitor && bundleAnalyzer && launchService) {
        const [performanceReport, bundleReport, launchStatusData] = await Promise.all([
          performanceMonitor.generateReport(),
          bundleAnalyzer.analyzeBundle(),
          launchService.getLaunchStatus()
        ]);

        setPerformanceData({
          performance: performanceReport,
          bundle: bundleReport
        });
        setLaunchStatus(launchStatusData);
      }
    } catch (err) {
      console.error('Failed to update performance data:', err);
    }
  };

  /**
   * Run launch readiness checks
   */
  const runReadinessChecks = async () => {
    try {
      if (launchService) {
        const readiness = await launchService.runReadinessChecks();
        setLaunchStatus(prev => ({ ...prev, readiness }));
        return readiness;
      }
    } catch (err) {
      console.error('Failed to run readiness checks:', err);
      throw err;
    }
  };

  /**
   * Get performance score color
   * @param {number} score - Performance score
   * @returns {string} Color variant
   */
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  /**
   * Get launch status color
   * @param {string} status - Launch status
   * @returns {string} Color variant
   */
  const getLaunchStatusColor = (status) => {
    const statusColors = {
      'preparing': 'info',
      'ready': 'success',
      'deploying': 'warning',
      'deployed': 'success',
      'failed': 'danger',
      'rolling-back': 'warning',
      'rolled-back': 'info'
    };
    return statusColors[status] || 'info';
  };

  if (loading) {
    return (
      <div className="performance-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing performance monitoring...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-page">
        <Alert variant="danger" className="error-alert">
          <h3>Performance Monitoring Error</h3>
          <p>{error}</p>
          <Button onClick={initializeServices} variant="primary">
            Retry Initialization
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="performance-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Performance & Launch Monitoring</h1>
          <p>Real-time performance insights and launch readiness for AlphaFrame Galileo V2.2</p>
        </div>
        <div className="header-actions">
          <Button 
            onClick={runReadinessChecks}
            variant="primary"
            className="readiness-check-btn"
          >
            Run Readiness Checks
          </Button>
          <Button 
            onClick={updateData}
            variant="secondary"
            className="refresh-btn"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Launch Status Overview */}
      {launchStatus && (
        <div className="launch-status-section">
          <Card className="launch-status-card">
            <div className="status-header">
              <h2>Launch Status</h2>
              <Badge variant={getLaunchStatusColor(launchStatus.status)}>
                {launchStatus.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
            
            <div className="status-details">
              <div className="status-item">
                <span className="label">Phase:</span>
                <span className="value">{launchStatus.phase || 'Development'}</span>
              </div>
              
              {launchStatus.readinessChecks && (
                <div className="readiness-summary">
                  <h4>Readiness Checks</h4>
                  <div className="readiness-grid">
                    {Object.entries(launchStatus.readinessChecks).map(([category, check]) => (
                      <div key={category} className="readiness-item">
                        <span className="category">{category}</span>
                        <Badge variant={check.passed ? 'success' : 'danger'}>
                          {check.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                        <span className="score">{check.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Performance Overview */}
      {performanceData.performance && (
        <div className="performance-overview-section">
          <Card className="performance-overview-card">
            <h2>Performance Overview</h2>
            
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="label">Overall Score</span>
                <span className="value">
                  <Badge variant={getScoreColor(performanceData.performance.health)}>
                    {performanceData.performance.health}%
                  </Badge>
                </span>
              </div>
              
              <div className="metric-item">
                <span className="label">Bundle Size</span>
                <span className="value">
                  {performanceData.bundle?.currentSize ? 
                    `${(performanceData.bundle.currentSize / (1024 * 1024)).toFixed(2)} MB` : 
                    'N/A'
                  }
                </span>
              </div>
              
              <div className="metric-item">
                <span className="label">Error Rate</span>
                <span className="value">
                  {performanceData.performance.metrics?.errorRate ? 
                    `${(performanceData.performance.metrics.errorRate * 100).toFixed(3)}%` : 
                    'N/A'
                  }
                </span>
              </div>
              
              <div className="metric-item">
                <span className="label">Active Alerts</span>
                <span className="value">
                  <Badge variant={performanceData.performance.alerts?.length > 0 ? 'warning' : 'success'}>
                    {performanceData.performance.alerts?.length || 0}
                  </Badge>
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Dashboard */}
      <div className="dashboard-section">
        <PerformanceDashboard />
      </div>

      {/* Launch Readiness Actions */}
      <div className="launch-actions-section">
        <Card className="launch-actions-card">
          <h2>Launch Actions</h2>
          
          <div className="actions-grid">
            <div className="action-item">
              <h4>Deploy to Staging</h4>
              <p>Deploy current version to staging environment for testing</p>
              <Button variant="secondary" size="sm">
                Deploy to Staging
              </Button>
            </div>
            
            <div className="action-item">
              <h4>Deploy to Production</h4>
              <p>Deploy current version to production environment</p>
              <Button variant="primary" size="sm">
                Deploy to Production
              </Button>
            </div>
            
            <div className="action-item">
              <h4>Rollback</h4>
              <p>Rollback to previous production version if needed</p>
              <Button variant="danger" size="sm">
                Rollback
              </Button>
            </div>
            
            <div className="action-item">
              <h4>Generate Report</h4>
              <p>Generate comprehensive performance and launch report</p>
              <Button variant="secondary" size="sm">
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      {performanceData.performance?.alerts && performanceData.performance.alerts.length > 0 && (
        <div className="alerts-section">
          <Card className="alerts-card">
            <h2>Recent Performance Alerts</h2>
            
            <div className="alerts-list">
              {performanceData.performance.alerts.slice(0, 5).map((alert, index) => (
                <Alert key={index} variant={alert.severity} className="alert-item">
                  <div className="alert-header">
                    <strong>{alert.metric}</strong>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p>{alert.message}</p>
                </Alert>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Optimization Recommendations */}
      {performanceData.performance?.recommendations && performanceData.performance.recommendations.length > 0 && (
        <div className="recommendations-section">
          <Card className="recommendations-card">
            <h2>Optimization Recommendations</h2>
            
            <div className="recommendations-list">
              {performanceData.performance.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-header">
                    <h4>{rec.title}</h4>
                    <Badge variant={rec.priority === 'high' ? 'danger' : 'warning'}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p>{rec.description}</p>
                  <ul>
                    {rec.actions?.slice(0, 3).map((action, actionIndex) => (
                      <li key={actionIndex}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PerformancePage; 