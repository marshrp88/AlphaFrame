/**
 * PerformanceMonitor Component
 * Monitors and reports performance metrics for AlphaFrame
 * 
 * Features:
 * - Core Web Vitals monitoring
 * - Custom performance metrics
 * - Performance budget tracking
 * - Real-time performance alerts
 */

import React, { useEffect, useState, useRef } from 'react';

// Performance budget thresholds
const PERFORMANCE_BUDGETS = {
  FCP: 1800, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 600, // Time to First Byte (ms)
};

// Performance metric types
const METRIC_TYPES = {
  NAVIGATION: 'navigation',
  PAINT: 'paint',
  LAYOUT_SHIFT: 'layout-shift',
  FIRST_INPUT: 'first-input',
  LARGEST_CONTENTFUL_PAINT: 'largest-contentful-paint',
};

/**
 * PerformanceMonitor Component
 * @param {Object} props - Component props
 * @param {boolean} props.enabled - Whether monitoring is enabled
 * @param {Function} props.onMetric - Callback for performance metrics
 * @param {Function} props.onAlert - Callback for performance alerts
 * @param {boolean} props.showUI - Whether to show performance UI
 * @returns {JSX.Element|null} Performance monitor component
 */
const PerformanceMonitor = ({ 
  enabled = true, 
  onMetric = () => {}, 
  onAlert = () => {},
  showUI = false 
}) => {
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const observerRef = useRef(null);

  // Initialize performance monitoring
  useEffect(() => {
    if (!enabled || !window.performance) return;

    const initMonitoring = () => {
      setIsMonitoring(true);
      
      // Monitor Core Web Vitals
      monitorCoreWebVitals();
      
      // Monitor custom metrics
      monitorCustomMetrics();
      
      // Monitor resource loading
      monitorResourceLoading();
      
      // Monitor memory usage
      monitorMemoryUsage();
    };

    // Start monitoring after page load
    if (document.readyState === 'complete') {
      initMonitoring();
    } else {
      window.addEventListener('load', initMonitoring);
      return () => window.removeEventListener('load', initMonitoring);
    }
  }, [enabled]);

  // Monitor Core Web Vitals
  const monitorCoreWebVitals = () => {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
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
              
              updateMetric(metric);
              checkPerformanceBudget(metric);
            }
          }
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
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
          
          updateMetric(metric);
          checkPerformanceBudget(metric);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP monitoring error:', error);
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const metric = {
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              type: METRIC_TYPES.FIRST_INPUT,
              timestamp: Date.now(),
            };
            
            updateMetric(metric);
            checkPerformanceBudget(metric);
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID monitoring error:', error);
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
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
          
          updateMetric(metric);
          checkPerformanceBudget(metric);
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS monitoring error:', error);
      }
    }
  };

  // Monitor custom metrics
  const monitorCustomMetrics = () => {
    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const metric = {
        name: 'TTFB',
        value: navigationEntry.responseStart - navigationEntry.requestStart,
        type: METRIC_TYPES.NAVIGATION,
        timestamp: Date.now(),
      };
      
      updateMetric(metric);
      checkPerformanceBudget(metric);
    }

    // DOM Content Loaded
    const domContentLoaded = performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd;
    if (domContentLoaded) {
      const metric = {
        name: 'DCL',
        value: domContentLoaded,
        type: METRIC_TYPES.NAVIGATION,
        timestamp: Date.now(),
      };
      
      updateMetric(metric);
    }

    // Load Complete
    const loadComplete = performance.getEntriesByType('navigation')[0]?.loadEventEnd;
    if (loadComplete) {
      const metric = {
        name: 'LC',
        value: loadComplete,
        type: METRIC_TYPES.NAVIGATION,
        timestamp: Date.now(),
      };
      
      updateMetric(metric);
    }
  };

  // Monitor resource loading
  const monitorResourceLoading = () => {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Track slow resources
            if (entry.duration > 1000) {
              const metric = {
                name: 'SLOW_RESOURCE',
                value: entry.duration,
                type: 'resource',
                resource: entry.name,
                timestamp: Date.now(),
              };
              
              updateMetric(metric);
              checkPerformanceBudget(metric);
            }
          }
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Resource monitoring error:', error);
      }
    }
  };

  // Monitor memory usage
  const monitorMemoryUsage = () => {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = performance.memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        
        const metric = {
          name: 'MEMORY_USAGE',
          value: usedMB,
          total: totalMB,
          type: 'memory',
          timestamp: Date.now(),
        };
        
        updateMetric(metric);
        
        // Alert if memory usage is high
        if (usedMB > 100) {
          createAlert('HIGH_MEMORY_USAGE', `Memory usage: ${usedMB.toFixed(2)}MB`);
        }
      };
      
      // Check memory every 30 seconds
      setInterval(checkMemory, 30000);
      checkMemory(); // Initial check
    }
  };

  // Update metrics state
  const updateMetric = (metric) => {
    setMetrics(prev => ({
      ...prev,
      [metric.name]: metric,
    }));
    
    onMetric(metric);
  };

  // Check performance budget
  const checkPerformanceBudget = (metric) => {
    const budget = PERFORMANCE_BUDGETS[metric.name];
    if (budget && metric.value > budget) {
      createAlert(
        'PERFORMANCE_BUDGET_EXCEEDED',
        `${metric.name}: ${metric.value}ms (budget: ${budget}ms)`
      );
    }
  };

  // Create performance alert
  const createAlert = (type, message) => {
    const alert = {
      id: Date.now(),
      type,
      message,
      timestamp: Date.now(),
      severity: type === 'PERFORMANCE_BUDGET_EXCEEDED' ? 'high' : 'medium',
    };
    
    setAlerts(prev => [...prev, alert]);
    onAlert(alert);
    
    // Remove alert after 5 minutes
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 300000);
  };

  // Get performance score (0-100)
  const getPerformanceScore = () => {
    const scores = Object.entries(PERFORMANCE_BUDGETS).map(([metric, budget]) => {
      const value = metrics[metric]?.value;
      if (!value) return 100;
      
      const ratio = value / budget;
      return Math.max(0, Math.min(100, (1 - ratio) * 100));
    });
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
  };

  // Performance UI component
  const PerformanceUI = () => {
    if (!showUI) return null;

    const score = getPerformanceScore();
    const scoreColor = score >= 90 ? 'green' : score >= 70 ? 'orange' : 'red';

    return (
      <div 
        className="performance-monitor-ui"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ marginBottom: '5px' }}>
          <strong>Performance Score: </strong>
          <span style={{ color: scoreColor }}>{score.toFixed(1)}/100</span>
        </div>
        
        {Object.entries(metrics).slice(0, 5).map(([name, metric]) => (
          <div key={name} style={{ marginBottom: '2px' }}>
            {name}: {metric.value?.toFixed(0) || 'N/A'}
            {PERFORMANCE_BUDGETS[name] && (
              <span style={{ color: 'gray' }}>
                /{PERFORMANCE_BUDGETS[name]}
              </span>
            )}
          </div>
        ))}
        
        {alerts.length > 0 && (
          <div style={{ marginTop: '5px', color: 'red' }}>
            ⚠️ {alerts.length} alert{alerts.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  return <PerformanceUI />;
};

// Export performance utilities
export const performanceUtils = {
  // Get current performance metrics
  getMetrics: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      TTFB: navigation?.responseStart - navigation?.requestStart,
      DCL: navigation?.domContentLoadedEventEnd,
      LC: navigation?.loadEventEnd,
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize / 1024 / 1024,
        total: performance.memory.totalJSHeapSize / 1024 / 1024,
      } : null,
    };
  },

  // Mark performance milestone
  mark: (name) => {
    if ('mark' in performance) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name, startMark, endMark) => {
    if ('measure' in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure?.duration;
      } catch (error) {
        console.warn('Performance measure error:', error);
        return null;
      }
    }
    return null;
  },

  // Clear performance marks and measures
  clear: () => {
    if ('clearMarks' in performance) {
      performance.clearMarks();
    }
    if ('clearMeasures' in performance) {
      performance.clearMeasures();
    }
  },
};

export default PerformanceMonitor; 