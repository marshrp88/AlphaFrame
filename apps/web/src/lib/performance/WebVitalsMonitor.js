/**
 * WebVitalsMonitor.js - Core Web Vitals Monitoring
 * 
 * Purpose: Monitor and report Core Web Vitals (FCP, LCP, FID, CLS, TTFB)
 * for AlphaFrame performance optimization.
 * 
 * Procedure:
 * 1. Track First Contentful Paint (FCP)
 * 2. Monitor Largest Contentful Paint (LCP)
 * 3. Measure First Input Delay (FID)
 * 4. Calculate Cumulative Layout Shift (CLS)
 * 5. Track Time to First Byte (TTFB)
 * 
 * Conclusion: Provides real-time performance metrics for optimization.
 */

// Performance budget thresholds (Google's recommended values)
const PERFORMANCE_BUDGETS = {
  FCP: 1800, // First Contentful Paint (ms) - Good: < 1.8s
  LCP: 2500, // Largest Contentful Paint (ms) - Good: < 2.5s
  FID: 100,  // First Input Delay (ms) - Good: < 100ms
  CLS: 0.1,  // Cumulative Layout Shift - Good: < 0.1
  TTFB: 600, // Time to First Byte (ms) - Good: < 600ms
};

// Performance metric types
const METRIC_TYPES = {
  PAINT: 'paint',
  LAYOUT_SHIFT: 'layout-shift',
  FIRST_INPUT: 'first-input',
  LARGEST_CONTENTFUL_PAINT: 'largest-contentful-paint',
  NAVIGATION: 'navigation',
};

/**
 * WebVitalsMonitor Class
 * Monitors and reports Core Web Vitals performance metrics
 */
class WebVitalsMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.isMonitoring = false;
    this.callbacks = {
      onMetric: () => {},
      onAlert: () => {},
    };
  }

  /**
   * Start monitoring Core Web Vitals
   * @param {Object} options - Monitoring options
   * @param {Function} options.onMetric - Callback for metric updates
   * @param {Function} options.onAlert - Callback for performance alerts
   */
  start(options = {}) {
    if (this.isMonitoring) return;
    
    this.callbacks = { ...this.callbacks, ...options };
    this.isMonitoring = true;

    // Monitor First Contentful Paint
    this.observePaint();
    
    // Monitor Largest Contentful Paint
    this.observeLCP();
    
    // Monitor First Input Delay
    this.observeFID();
    
    // Monitor Cumulative Layout Shift
    this.observeCLS();
    
    // Monitor Time to First Byte
    this.observeTTFB();
  }

  /**
   * Stop monitoring
   */
  stop() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Observe paint metrics (FCP)
   */
  observePaint() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const metric = {
              name: 'FCP',
              value: entry.startTime,
              type: METRIC_TYPES.PAINT,
              timestamp: Date.now(),
            };
            
            this.updateMetric(metric);
            this.checkPerformanceBudget(metric);
          }
        }
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    } catch (error) {
      console.warn('FCP monitoring error:', error);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        const metric = {
          name: 'LCP',
          value: lastEntry.startTime,
          type: METRIC_TYPES.LARGEST_CONTENTFUL_PAINT,
          timestamp: Date.now(),
        };
        
        this.updateMetric(metric);
        this.checkPerformanceBudget(metric);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP monitoring error:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const metric = {
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            type: METRIC_TYPES.FIRST_INPUT,
            timestamp: Date.now(),
          };
          
          this.updateMetric(metric);
          this.checkPerformanceBudget(metric);
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn('FID monitoring error:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        const metric = {
          name: 'CLS',
          value: clsValue,
          type: METRIC_TYPES.LAYOUT_SHIFT,
          timestamp: Date.now(),
        };
        
        this.updateMetric(metric);
        this.checkPerformanceBudget(metric);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS monitoring error:', error);
    }
  }

  /**
   * Observe Time to First Byte
   */
  observeTTFB() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const metric = {
        name: 'TTFB',
        value: navigationEntry.responseStart - navigationEntry.requestStart,
        type: METRIC_TYPES.NAVIGATION,
        timestamp: Date.now(),
      };
      
      this.updateMetric(metric);
      this.checkPerformanceBudget(metric);
    }
  }

  /**
   * Update metrics and trigger callbacks
   * @param {Object} metric - Performance metric
   */
  updateMetric(metric) {
    this.metrics[metric.name] = metric;
    this.callbacks.onMetric(metric);
  }

  /**
   * Check if metric exceeds performance budget
   * @param {Object} metric - Performance metric
   */
  checkPerformanceBudget(metric) {
    const budget = PERFORMANCE_BUDGETS[metric.name];
    if (budget && metric.value > budget) {
      const alert = {
        type: 'PERFORMANCE_BUDGET_EXCEEDED',
        metric: metric.name,
        value: metric.value,
        budget: budget,
        severity: 'high',
        timestamp: Date.now(),
      };
      
      this.callbacks.onAlert(alert);
    }
  }

  /**
   * Get current performance score (0-100)
   * @returns {number} Performance score
   */
  getPerformanceScore() {
    const scores = Object.entries(PERFORMANCE_BUDGETS).map(([metric, budget]) => {
      const value = this.metrics[metric]?.value;
      if (!value) return 100;
      
      const ratio = value / budget;
      return Math.max(0, Math.min(100, (1 - ratio) * 100));
    });
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
  }

  /**
   * Get all current metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get specific metric
   * @param {string} name - Metric name
   * @returns {Object|null} Metric data
   */
  getMetric(name) {
    return this.metrics[name] || null;
  }

  /**
   * Check if monitoring is active
   * @returns {boolean} Monitoring status
   */
  isActive() {
    return this.isMonitoring;
  }
}

// Export singleton instance
const webVitalsMonitor = new WebVitalsMonitor();

// Export utilities
export const webVitalsUtils = {
  // Start monitoring
  start: (options) => webVitalsMonitor.start(options),
  
  // Stop monitoring
  stop: () => webVitalsMonitor.stop(),
  
  // Get performance score
  getScore: () => webVitalsMonitor.getPerformanceScore(),
  
  // Get metrics
  getMetrics: () => webVitalsMonitor.getMetrics(),
  
  // Get specific metric
  getMetric: (name) => webVitalsMonitor.getMetric(name),
  
  // Check if active
  isActive: () => webVitalsMonitor.isActive(),
  
  // Performance budgets
  budgets: PERFORMANCE_BUDGETS,
};

export default webVitalsMonitor; 