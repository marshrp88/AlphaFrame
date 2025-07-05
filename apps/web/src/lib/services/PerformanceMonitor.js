/**
 * PerformanceMonitor.js
 * 
 * PURPOSE: Comprehensive performance monitoring and optimization for AlphaFrame Galileo V2.2
 * This service tracks bundle size, loading times, user experience metrics, and provides
 * real-time performance insights for production readiness.
 * 
 * PROCEDURE:
 * 1. Monitors bundle size and loading performance metrics
 * 2. Tracks user experience metrics (FCP, LCP, CLS, TTI)
 * 3. Provides performance budgets and alerting
 * 4. Generates optimization recommendations
 * 5. Integrates with monitoring systems for production
 * 
 * CONCLUSION: Ensures AlphaFrame meets performance targets and provides
 * optimal user experience for production launch readiness.
 */

import { ExecutionLogService } from './ExecutionLogService.js';

class PerformanceMonitor {
  constructor() {
    this.executionLog = new ExecutionLogService('PerformanceMonitor');
    this.metrics = {
      bundleSize: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
      errorRate: 0
    };
    
    this.budgets = {
      bundleSize: { warning: 1.5 * 1024 * 1024, error: 2 * 1024 * 1024 }, // 1.5MB warning, 2MB error
      firstContentfulPaint: { warning: 2000, error: 3000 }, // 2s warning, 3s error
      largestContentfulPaint: { warning: 4000, error: 6000 }, // 4s warning, 6s error
      cumulativeLayoutShift: { warning: 0.1, error: 0.25 }, // 0.1 warning, 0.25 error
      timeToInteractive: { warning: 5000, error: 7000 }, // 5s warning, 7s error
      errorRate: { warning: 0.001, error: 0.01 } // 0.1% warning, 1% error
    };
    
    this.alerts = [];
    this.optimizationRecommendations = [];
  }

  /**
   * Initialize performance monitoring
   */
  async initialize() {
    try {
      this.executionLog.logExecution('initialize', { timestamp: Date.now() });
      
      // Set up Web Vitals monitoring
      this.setupWebVitalsMonitoring();
      
      // Set up bundle size monitoring
      this.setupBundleSizeMonitoring();
      
      // Set up error rate monitoring
      this.setupErrorRateMonitoring();
      
      // Set up performance budgets
      this.setupPerformanceBudgets();
      
      this.executionLog.logExecution('initialize', { 
        success: true,
        message: 'Performance monitoring initialized successfully'
      });
    } catch (error) {
      this.executionLog.logExecution('initialize', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Performance monitoring initialization failed: ${error.message}`);
    }
  }

  /**
   * Set up Web Vitals monitoring
   */
  setupWebVitalsMonitoring() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        this.metrics.firstContentfulPaint = fcp.startTime;
        this.checkPerformanceBudget('firstContentfulPaint', fcp.startTime);
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lcp.startTime;
        this.checkPerformanceBudget('largestContentfulPaint', lcp.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = cls;
        this.checkPerformanceBudget('cumulativeLayoutShift', cls);
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to Interactive
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tti = entries[entries.length - 1];
        this.metrics.timeToInteractive = tti.startTime;
        this.checkPerformanceBudget('timeToInteractive', tti.startTime);
      }).observe({ entryTypes: ['measure'] });
    }
  }

  /**
   * Set up bundle size monitoring
   */
  setupBundleSizeMonitoring() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        // Estimate bundle size from transfer size
        const transferSize = navigation.transferSize || 0;
        this.metrics.bundleSize = transferSize;
        this.checkPerformanceBudget('bundleSize', transferSize);
      }
    }
  }

  /**
   * Set up error rate monitoring
   */
  setupErrorRateMonitoring() {
    if (typeof window !== 'undefined') {
      let errorCount = 0;
      let totalRequests = 0;

      // Monitor JavaScript errors
      window.addEventListener('error', (event) => {
        errorCount++;
        this.updateErrorRate(errorCount, totalRequests);
      });

      // Monitor unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        errorCount++;
        this.updateErrorRate(errorCount, totalRequests);
      });

      // Monitor fetch requests
      const originalFetch = window.fetch;
      window.fetch = (...args) => {
        totalRequests++;
        return originalFetch(...args)
          .then(response => {
            if (!response.ok) {
              errorCount++;
              this.updateErrorRate(errorCount, totalRequests);
            }
            return response;
          })
          .catch(error => {
            errorCount++;
            this.updateErrorRate(errorCount, totalRequests);
            throw error;
          });
      };
    }
  }

  /**
   * Update error rate calculation
   * @param {number} errorCount - Number of errors
   * @param {number} totalRequests - Total number of requests
   */
  updateErrorRate(errorCount, totalRequests) {
    if (totalRequests > 0) {
      this.metrics.errorRate = errorCount / totalRequests;
      this.checkPerformanceBudget('errorRate', this.metrics.errorRate);
    }
  }

  /**
   * Set up performance budgets
   */
  setupPerformanceBudgets() {
    // Monitor performance budgets in real-time
    setInterval(() => {
      this.checkAllPerformanceBudgets();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Check performance budget for a specific metric
   * @param {string} metric - Metric name
   * @param {number} value - Current value
   */
  checkPerformanceBudget(metric, value) {
    const budget = this.budgets[metric];
    if (!budget) return;

    let severity = 'info';
    let message = '';

    if (value > budget.error) {
      severity = 'error';
      message = `${metric} exceeded error threshold: ${value} > ${budget.error}`;
    } else if (value > budget.warning) {
      severity = 'warning';
      message = `${metric} exceeded warning threshold: ${value} > ${budget.warning}`;
    }

    if (severity !== 'info') {
      this.addAlert(severity, metric, message, value);
      this.generateOptimizationRecommendation(metric, value, budget);
    }
  }

  /**
   * Check all performance budgets
   */
  checkAllPerformanceBudgets() {
    Object.entries(this.metrics).forEach(([metric, value]) => {
      this.checkPerformanceBudget(metric, value);
    });
  }

  /**
   * Add performance alert
   * @param {string} severity - Alert severity (warning, error)
   * @param {string} metric - Metric name
   * @param {string} message - Alert message
   * @param {number} value - Current value
   */
  addAlert(severity, metric, message, value) {
    const alert = {
      id: Date.now(),
      severity,
      metric,
      message,
      value,
      timestamp: new Date().toISOString()
    };

    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    this.executionLog.logExecution('addAlert', { alert });
  }

  /**
   * Generate optimization recommendation
   * @param {string} metric - Metric name
   * @param {number} value - Current value
   * @param {Object} budget - Performance budget
   */
  generateOptimizationRecommendation(metric, value, budget) {
    const recommendations = {
      bundleSize: [
        'Implement code splitting to reduce initial bundle size',
        'Use dynamic imports for non-critical components',
        'Optimize and compress images and assets',
        'Remove unused dependencies and dead code'
      ],
      firstContentfulPaint: [
        'Optimize critical rendering path',
        'Reduce server response time',
        'Minimize render-blocking resources',
        'Optimize CSS delivery'
      ],
      largestContentfulPaint: [
        'Optimize images and media files',
        'Implement lazy loading for below-the-fold content',
        'Use efficient image formats (WebP, AVIF)',
        'Optimize font loading and display'
      ],
      cumulativeLayoutShift: [
        'Set explicit dimensions for images and media',
        'Avoid inserting content above existing content',
        'Use CSS transforms instead of changing layout properties',
        'Reserve space for dynamic content'
      ],
      timeToInteractive: [
        'Reduce JavaScript execution time',
        'Implement code splitting and lazy loading',
        'Optimize third-party script loading',
        'Use web workers for heavy computations'
      ],
      errorRate: [
        'Implement comprehensive error handling',
        'Add retry mechanisms for failed requests',
        'Monitor and fix JavaScript errors',
        'Improve network request reliability'
      ]
    };

    const metricRecommendations = recommendations[metric] || [];
    const recommendation = {
      id: Date.now(),
      metric,
      currentValue: value,
      targetValue: budget.warning,
      recommendations: metricRecommendations,
      priority: value > budget.error ? 'high' : 'medium',
      timestamp: new Date().toISOString()
    };

    this.optimizationRecommendations.push(recommendation);
    
    // Keep only last 50 recommendations
    if (this.optimizationRecommendations.length > 50) {
      this.optimizationRecommendations = this.optimizationRecommendations.slice(-50);
    }
  }

  /**
   * Get current performance metrics
   * @returns {Object} Current performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get performance alerts
   * @param {string} severity - Filter by severity (optional)
   * @returns {Array} Performance alerts
   */
  getAlerts(severity = null) {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return this.alerts;
  }

  /**
   * Get optimization recommendations
   * @param {string} priority - Filter by priority (optional)
   * @returns {Array} Optimization recommendations
   */
  getRecommendations(priority = null) {
    if (priority) {
      return this.optimizationRecommendations.filter(rec => rec.priority === priority);
    }
    return this.optimizationRecommendations;
  }

  /**
   * Generate performance report
   * @returns {Object} Comprehensive performance report
   */
  generateReport() {
    const report = {
      metrics: this.getMetrics(),
      alerts: this.getAlerts(),
      recommendations: this.getRecommendations(),
      summary: {
        totalAlerts: this.alerts.length,
        errorAlerts: this.getAlerts('error').length,
        warningAlerts: this.getAlerts('warning').length,
        highPriorityRecommendations: this.getRecommendations('high').length,
        overallHealth: this.calculateOverallHealth()
      },
      timestamp: new Date().toISOString()
    };

    this.executionLog.logExecution('generateReport', { report });
    return report;
  }

  /**
   * Calculate overall performance health score
   * @returns {number} Health score (0-100)
   */
  calculateOverallHealth() {
    let healthScore = 100;
    let totalChecks = 0;

    Object.entries(this.metrics).forEach(([metric, value]) => {
      const budget = this.budgets[metric];
      if (budget && value > 0) {
        totalChecks++;
        
        if (value > budget.error) {
          healthScore -= 20; // Major penalty for error threshold
        } else if (value > budget.warning) {
          healthScore -= 10; // Minor penalty for warning threshold
        }
      }
    });

    return Math.max(0, Math.min(100, healthScore));
  }

  /**
   * Clear old alerts and recommendations
   * @param {number} maxAge - Maximum age in hours
   */
  clearOldData(maxAge = 24) {
    const cutoffTime = Date.now() - (maxAge * 60 * 60 * 1000);
    
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > cutoffTime
    );
    
    this.optimizationRecommendations = this.optimizationRecommendations.filter(rec => 
      new Date(rec.timestamp).getTime() > cutoffTime
    );
  }

  /**
   * Export performance data for external monitoring
   * @returns {Object} Performance data for external systems
   */
  exportForMonitoring() {
    return {
      application: 'AlphaFrame Galileo V2.2',
      version: '2.2.0',
      environment: process.env.NODE_ENV || 'development',
      metrics: this.getMetrics(),
      health: this.calculateOverallHealth(),
      timestamp: new Date().toISOString()
    };
  }
}

export default PerformanceMonitor; 