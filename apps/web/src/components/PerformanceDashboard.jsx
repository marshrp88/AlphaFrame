/**
 * PerformanceDashboard.jsx
 * 
 * PURPOSE: Real-time performance monitoring dashboard for AlphaFrame Galileo V2.2
 * This component displays performance metrics, alerts, and optimization
 * recommendations for production launch readiness.
 * 
 * PROCEDURE:
 * 1. Displays real-time performance metrics (FCP, LCP, CLS, TTI)
 * 2. Shows bundle size analysis and optimization opportunities
 * 3. Provides performance alerts and recommendations
 * 4. Tracks performance trends over time
 * 5. Enables performance optimization actions
 * 
 * CONCLUSION: Provides comprehensive performance visibility and
 * optimization tools for production launch readiness.
 */

import React, { useState, useEffect } from 'react';
import PerformanceMonitor from '../lib/services/PerformanceMonitor.js';
import BundleAnalyzer from '../lib/services/BundleAnalyzer.js';
import { Card } from '../shared/ui/Card.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { ProgressBar } from '../shared/ui/ProgressBar.jsx';
import { Alert } from '../shared/ui/Alert.jsx';
import { Badge } from '../shared/ui/badge.jsx';
import './PerformanceDashboard.css';

const PerformanceDashboard = () => {
  const [performanceMonitor, setPerformanceMonitor] = useState(null);
  const [bundleAnalyzer, setBundleAnalyzer] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [bundleReport, setBundleReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeMonitoring();
  }, []);

  useEffect(() => {
    if (performanceMonitor && bundleAnalyzer) {
      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [performanceMonitor, bundleAnalyzer]);

  /**
   * Initialize performance monitoring
   */
  const initializeMonitoring = async () => {
    try {
      const monitor = new PerformanceMonitor();
      const analyzer = new BundleAnalyzer();

      await monitor.initialize();
      const bundleAnalysis = await analyzer.analyzeBundle();

      setPerformanceMonitor(monitor);
      setBundleAnalyzer(analyzer);
      setBundleReport(bundleAnalysis);
      setLoading(false);

      updateMetrics();
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
      setLoading(false);
    }
  };

  /**
   * Update performance metrics
   */
  const updateMetrics = () => {
    if (performanceMonitor && bundleAnalyzer) {
      const currentMetrics = performanceMonitor.getMetrics();
      const currentAlerts = performanceMonitor.getAlerts();
      const currentRecommendations = performanceMonitor.getRecommendations();

      setMetrics(currentMetrics);
      setAlerts(currentAlerts);
      setRecommendations(currentRecommendations);
    }
  };

  /**
   * Format time in milliseconds to readable format
   * @param {number} ms - Time in milliseconds
   * @returns {string} Formatted time
   */
  const formatTime = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  /**
   * Format bytes to readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   */
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  /**
   * Get performance status color
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @returns {string} Status color
   */
  const getStatusColor = (metric, value) => {
    const budgets = {
      firstContentfulPaint: { warning: 2000, error: 3000 },
      largestContentfulPaint: { warning: 4000, error: 6000 },
      cumulativeLayoutShift: { warning: 0.1, error: 0.25 },
      timeToInteractive: { warning: 5000, error: 7000 },
      bundleSize: { warning: 1.5 * 1024 * 1024, error: 2 * 1024 * 1024 }
    };

    const budget = budgets[metric];
    if (!budget) return 'info';

    if (value > budget.error) return 'danger';
    if (value > budget.warning) return 'warning';
    return 'success';
  };

  /**
   * Get performance score
   * @param {Object} metrics - Performance metrics
   * @returns {number} Performance score (0-100)
   */
  const getPerformanceScore = (metrics) => {
    let score = 100;
    let checks = 0;

    Object.entries(metrics).forEach(([metric, value]) => {
      if (value > 0) {
        checks++;
        const color = getStatusColor(metric, value);
        if (color === 'danger') score -= 20;
        else if (color === 'warning') score -= 10;
      }
    });

    return Math.max(0, Math.min(100, score));
  };

  if (loading) {
    return (
      <div className="performance-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing performance monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h1>Performance Dashboard</h1>
        <p>Real-time performance monitoring for AlphaFrame Galileo V2.2</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics
        </button>
        <button 
          className={`tab-button ${activeTab === 'bundle' ? 'active' : ''}`}
          onClick={() => setActiveTab('bundle')}
        >
          Bundle Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Performance Score */}
            <Card className="performance-score-card">
              <h3>Overall Performance Score</h3>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{getPerformanceScore(metrics)}</span>
                  <span className="score-label">/ 100</span>
                </div>
                <div className="score-details">
                  <p>Based on Web Vitals and bundle size</p>
                  <Badge variant={getPerformanceScore(metrics) >= 80 ? 'success' : getPerformanceScore(metrics) >= 60 ? 'warning' : 'danger'}>
                    {getPerformanceScore(metrics) >= 80 ? 'Excellent' : getPerformanceScore(metrics) >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
              <Card className="metric-card">
                <h4>First Contentful Paint</h4>
                <div className="metric-value">
                  <span className="value">{formatTime(metrics.firstContentfulPaint || 0)}</span>
                  <Badge variant={getStatusColor('firstContentfulPaint', metrics.firstContentfulPaint || 0)}>
                    {getStatusColor('firstContentfulPaint', metrics.firstContentfulPaint || 0)}
                  </Badge>
                </div>
                <ProgressBar 
                  value={Math.min((metrics.firstContentfulPaint || 0) / 3000 * 100, 100)}
                  variant={getStatusColor('firstContentfulPaint', metrics.firstContentfulPaint || 0)}
                />
              </Card>

              <Card className="metric-card">
                <h4>Largest Contentful Paint</h4>
                <div className="metric-value">
                  <span className="value">{formatTime(metrics.largestContentfulPaint || 0)}</span>
                  <Badge variant={getStatusColor('largestContentfulPaint', metrics.largestContentfulPaint || 0)}>
                    {getStatusColor('largestContentfulPaint', metrics.largestContentfulPaint || 0)}
                  </Badge>
                </div>
                <ProgressBar 
                  value={Math.min((metrics.largestContentfulPaint || 0) / 6000 * 100, 100)}
                  variant={getStatusColor('largestContentfulPaint', metrics.largestContentfulPaint || 0)}
                />
              </Card>

              <Card className="metric-card">
                <h4>Bundle Size</h4>
                <div className="metric-value">
                  <span className="value">{formatBytes(metrics.bundleSize || 0)}</span>
                  <Badge variant={getStatusColor('bundleSize', metrics.bundleSize || 0)}>
                    {getStatusColor('bundleSize', metrics.bundleSize || 0)}
                  </Badge>
                </div>
                <ProgressBar 
                  value={Math.min((metrics.bundleSize || 0) / (2 * 1024 * 1024) * 100, 100)}
                  variant={getStatusColor('bundleSize', metrics.bundleSize || 0)}
                />
              </Card>

              <Card className="metric-card">
                <h4>Error Rate</h4>
                <div className="metric-value">
                  <span className="value">{((metrics.errorRate || 0) * 100).toFixed(2)}%</span>
                  <Badge variant={getStatusColor('errorRate', metrics.errorRate || 0)}>
                    {getStatusColor('errorRate', metrics.errorRate || 0)}
                  </Badge>
                </div>
                <ProgressBar 
                  value={Math.min((metrics.errorRate || 0) * 10000, 100)}
                  variant={getStatusColor('errorRate', metrics.errorRate || 0)}
                />
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card className="alerts-card">
              <h3>Recent Alerts</h3>
              {alerts.slice(0, 5).map(alert => (
                <Alert key={alert.id} variant={alert.severity} className="alert-item">
                  <strong>{alert.metric}:</strong> {alert.message}
                  <small>{new Date(alert.timestamp).toLocaleTimeString()}</small>
                </Alert>
              ))}
              {alerts.length === 0 && (
                <p className="no-alerts">No performance alerts at this time.</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="metrics-tab">
            <Card className="detailed-metrics">
              <h3>Detailed Performance Metrics</h3>
              <div className="metrics-table">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Current Value</th>
                      <th>Target</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>First Contentful Paint</td>
                      <td>{formatTime(metrics.firstContentfulPaint || 0)}</td>
                      <td>&lt; 2s</td>
                      <td>
                        <Badge variant={getStatusColor('firstContentfulPaint', metrics.firstContentfulPaint || 0)}>
                          {getStatusColor('firstContentfulPaint', metrics.firstContentfulPaint || 0)}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Largest Contentful Paint</td>
                      <td>{formatTime(metrics.largestContentfulPaint || 0)}</td>
                      <td>&lt; 4s</td>
                      <td>
                        <Badge variant={getStatusColor('largestContentfulPaint', metrics.largestContentfulPaint || 0)}>
                          {getStatusColor('largestContentfulPaint', metrics.largestContentfulPaint || 0)}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Cumulative Layout Shift</td>
                      <td>{(metrics.cumulativeLayoutShift || 0).toFixed(3)}</td>
                      <td>&lt; 0.1</td>
                      <td>
                        <Badge variant={getStatusColor('cumulativeLayoutShift', metrics.cumulativeLayoutShift || 0)}>
                          {getStatusColor('cumulativeLayoutShift', metrics.cumulativeLayoutShift || 0)}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Time to Interactive</td>
                      <td>{formatTime(metrics.timeToInteractive || 0)}</td>
                      <td>&lt; 5s</td>
                      <td>
                        <Badge variant={getStatusColor('timeToInteractive', metrics.timeToInteractive || 0)}>
                          {getStatusColor('timeToInteractive', metrics.timeToInteractive || 0)}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Bundle Size</td>
                      <td>{formatBytes(metrics.bundleSize || 0)}</td>
                      <td>&lt; 1MB</td>
                      <td>
                        <Badge variant={getStatusColor('bundleSize', metrics.bundleSize || 0)}>
                          {getStatusColor('bundleSize', metrics.bundleSize || 0)}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td>Error Rate</td>
                      <td>{((metrics.errorRate || 0) * 100).toFixed(3)}%</td>
                      <td>&lt; 0.1%</td>
                      <td>
                        <Badge variant={getStatusColor('errorRate', metrics.errorRate || 0)}>
                          {getStatusColor('errorRate', metrics.errorRate || 0)}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bundle' && (
          <div className="bundle-tab">
            <Card className="bundle-overview">
              <h3>Bundle Analysis</h3>
              <div className="bundle-size-display">
                <div className="size-info">
                  <h4>Current Bundle Size</h4>
                  <span className="size-value">{formatBytes(bundleReport.currentSize || 0)}</span>
                </div>
                <div className="size-breakdown">
                  <h4>Bundle Composition</h4>
                  <div className="composition-chart">
                    {Object.entries(bundleReport.composition || {}).map(([category, size]) => (
                      <div key={category} className="composition-item">
                        <span className="category">{category}</span>
                        <span className="size">{formatBytes(size)}</span>
                        <span className="percentage">
                          {((size / (bundleReport.currentSize || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="optimization-opportunities">
              <h3>Optimization Opportunities</h3>
              {bundleReport.opportunities?.map((opportunity, index) => (
                <div key={index} className="opportunity-item">
                  <div className="opportunity-header">
                    <h4>{opportunity.description}</h4>
                    <Badge variant={opportunity.priority === 'high' ? 'danger' : 'warning'}>
                      {opportunity.priority}
                    </Badge>
                  </div>
                  <p>{opportunity.recommendation}</p>
                  <p className="potential-savings">
                    Potential savings: {formatBytes(opportunity.potentialSavings)}
                  </p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <Card className="all-alerts">
              <h3>Performance Alerts</h3>
              {alerts.map(alert => (
                <Alert key={alert.id} variant={alert.severity} className="alert-item">
                  <div className="alert-header">
                    <strong>{alert.metric}</strong>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p>{alert.message}</p>
                  <small>Value: {alert.value}</small>
                </Alert>
              ))}
              {alerts.length === 0 && (
                <p className="no-alerts">No performance alerts at this time.</p>
              )}
            </Card>

            <Card className="recommendations">
              <h3>Optimization Recommendations</h3>
              {recommendations.map(rec => (
                <div key={rec.id} className="recommendation-item">
                  <div className="recommendation-header">
                    <h4>{rec.title}</h4>
                    <Badge variant={rec.priority === 'high' ? 'danger' : 'warning'}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p>{rec.description}</p>
                  <ul>
                    {rec.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard; 