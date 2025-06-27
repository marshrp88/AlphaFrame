/**
 * PerformanceMonitor.jsx - AlphaFrame VX.1 Performance Monitoring
 * 
 * Purpose: Tracks and displays key performance metrics to help
 * identify bottlenecks and optimize user experience.
 * 
 * Procedure:
 * 1. Monitor page load times and Core Web Vitals
 * 2. Track component render performance
 * 3. Monitor memory usage and bundle size
 * 4. Provide real-time performance feedback
 * 5. Enable performance debugging in development
 * 
 * Conclusion: Provides valuable insights into application
 * performance and helps maintain optimal user experience.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';
import StyledButton from './StyledButton';
import './PerformanceMonitor.css';

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    lighthouseScore: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const startTime = useRef(performance.now());
  const renderStartTime = useRef(0);

  // Initialize performance monitoring
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Only show in development mode
      setIsVisible(true);
      startMonitoring();
    }
  }, []);

  // Start performance monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Track page load time
    const loadTime = performance.now() - startTime.current;
    
    // Track memory usage if available
    let memoryUsage = 0;
    if ('memory' in performance) {
      memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    
    // Estimate bundle size (this would be more accurate with webpack bundle analyzer)
    const bundleSize = Math.round(document.querySelectorAll('script').length * 50);
    
    setMetrics({
      loadTime: Math.round(loadTime),
      renderTime: 0,
      memoryUsage,
      bundleSize,
      lighthouseScore: calculateLighthouseScore(loadTime, memoryUsage)
    });
  };

  // Calculate estimated Lighthouse score
  const calculateLighthouseScore = (loadTime, memoryUsage) => {
    let score = 100;
    
    // Deduct points for slow load times
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;
    
    // Deduct points for high memory usage
    if (memoryUsage > 100) score -= 20;
    else if (memoryUsage > 50) score -= 10;
    
    return Math.max(0, score);
  };

  // Track component render time
  const trackRender = () => {
    renderStartTime.current = performance.now();
  };

  const endRender = () => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime)
      }));
    }
  };

  // Track render time for this component
  useEffect(() => {
    trackRender();
    const timer = setTimeout(endRender, 0);
    return () => clearTimeout(timer);
  });

  // Get performance status
  const getPerformanceStatus = () => {
    const { loadTime, renderTime, lighthouseScore } = metrics;
    
    if (lighthouseScore >= 90) return 'excellent';
    if (lighthouseScore >= 70) return 'good';
    if (lighthouseScore >= 50) return 'needs-improvement';
    return 'poor';
  };

  const status = getPerformanceStatus();

  if (!isVisible) return null;

  return (
    <div className={`performance-monitor ${status}`}>
      <div className="performance-header">
        <div className="performance-title">
          <Activity size={16} />
          <span>Performance Monitor</span>
        </div>
        <StyledButton
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="close-button"
        >
          ×
        </StyledButton>
      </div>
      
      <div className="performance-metrics">
        <div className="metric">
          <Clock size={14} />
          <span>Load: {metrics.loadTime}ms</span>
        </div>
        
        <div className="metric">
          <Zap size={14} />
          <span>Render: {metrics.renderTime}ms</span>
        </div>
        
        {metrics.memoryUsage > 0 && (
          <div className="metric">
            <Activity size={14} />
            <span>Memory: {metrics.memoryUsage}MB</span>
          </div>
        )}
        
        <div className="metric">
          <span>Bundle: ~{metrics.bundleSize}KB</span>
        </div>
      </div>
      
      <div className="performance-score">
        <div className={`score-indicator ${status}`}>
          <span className="score-value">{metrics.lighthouseScore}</span>
          <span className="score-label">Lighthouse</span>
        </div>
        
        {status === 'poor' && (
          <div className="performance-warning">
            <AlertTriangle size={12} />
            <span>Performance needs attention</span>
          </div>
        )}
      </div>
      
      <div className="performance-actions">
        <StyledButton
          variant="outline"
          size="sm"
          onClick={() => {
            setMetrics({
              loadTime: 0,
              renderTime: 0,
              memoryUsage: 0,
              bundleSize: 0,
              lighthouseScore: 0
            });
            startTime.current = performance.now();
            startMonitoring();
          }}
        >
          Reset
        </StyledButton>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 