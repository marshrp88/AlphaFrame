/**
 * BundleAnalyzer.js
 * 
 * PURPOSE: Bundle size monitoring and optimization for AlphaFrame Galileo V2.2
 * This service analyzes bundle composition, identifies optimization opportunities,
 * and ensures compliance with performance budgets for production launch.
 * 
 * PROCEDURE:
 * 1. Analyzes bundle composition and dependencies
 * 2. Identifies large packages and optimization opportunities
 * 3. Monitors bundle size against performance budgets
 * 4. Provides optimization recommendations
 * 5. Tracks bundle size trends over time
 * 
 * CONCLUSION: Ensures optimal bundle size and loading performance
 * for production launch readiness.
 */

import { ExecutionLogService } from './ExecutionLogService.js';

class BundleAnalyzer {
  constructor() {
    this.executionLog = new ExecutionLogService('BundleAnalyzer');
    this.bundleSize = 0;
    this.bundleComposition = {};
    this.optimizationOpportunities = [];
    this.sizeHistory = [];
    this.budgets = {
      warning: 1.5 * 1024 * 1024, // 1.5MB
      error: 2 * 1024 * 1024, // 2MB
      target: 1 * 1024 * 1024 // 1MB target
    };
  }

  /**
   * Analyze current bundle size and composition
   * @returns {Object} Bundle analysis results
   */
  async analyzeBundle() {
    try {
      this.executionLog.logExecution('analyzeBundle', { timestamp: Date.now() });

      // Get bundle size from performance API
      const bundleSize = await this.getBundleSize();
      this.bundleSize = bundleSize;

      // Analyze bundle composition
      const composition = await this.analyzeComposition();
      this.bundleComposition = composition;

      // Identify optimization opportunities
      const opportunities = this.identifyOptimizationOpportunities(composition);
      this.optimizationOpportunities = opportunities;

      // Update size history
      this.updateSizeHistory(bundleSize);

      // Check against budgets
      const budgetStatus = this.checkBudgetCompliance(bundleSize);

      const analysis = {
        bundleSize,
        composition,
        opportunities,
        budgetStatus,
        trends: this.analyzeTrends(),
        recommendations: this.generateRecommendations(),
        timestamp: new Date().toISOString()
      };

      this.executionLog.logExecution('analyzeBundle', { 
        output: analysis,
        success: true 
      });

      return analysis;
    } catch (error) {
      this.executionLog.logExecution('analyzeBundle', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Bundle analysis failed: ${error.message}`);
    }
  }

  /**
   * Get current bundle size
   * @returns {number} Bundle size in bytes
   */
  async getBundleSize() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation && navigation.transferSize) {
        return navigation.transferSize;
      }
    }

    // Fallback: estimate from loaded resources
    return this.estimateBundleSize();
  }

  /**
   * Estimate bundle size from loaded resources
   * @returns {number} Estimated bundle size
   */
  estimateBundleSize() {
    if (typeof window !== 'undefined') {
      const resources = performance.getEntriesByType('resource');
      const scriptResources = resources.filter(resource => 
        resource.name.includes('.js') || resource.name.includes('.mjs')
      );
      
      return scriptResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);
    }

    return 0;
  }

  /**
   * Analyze bundle composition
   * @returns {Object} Bundle composition analysis
   */
  async analyzeComposition() {
    const composition = {
      core: 0,
      ui: 0,
      services: 0,
      thirdParty: 0,
      utilities: 0,
      unknown: 0
    };

    if (typeof window !== 'undefined') {
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        const name = resource.name;

        if (name.includes('react') || name.includes('react-dom')) {
          composition.core += size;
        } else if (name.includes('ui') || name.includes('component')) {
          composition.ui += size;
        } else if (name.includes('service') || name.includes('engine')) {
          composition.services += size;
        } else if (name.includes('node_modules') || name.includes('vendor')) {
          composition.thirdParty += size;
        } else if (name.includes('util') || name.includes('helper')) {
          composition.utilities += size;
        } else {
          composition.unknown += size;
        }
      });
    }

    return composition;
  }

  /**
   * Identify optimization opportunities
   * @param {Object} composition - Bundle composition
   * @returns {Array} Optimization opportunities
   */
  identifyOptimizationOpportunities(composition) {
    const opportunities = [];

    // Check for large third-party dependencies
    if (composition.thirdParty > this.bundleSize * 0.4) {
      opportunities.push({
        type: 'third-party',
        priority: 'high',
        description: 'Third-party dependencies represent over 40% of bundle size',
        recommendation: 'Consider lazy loading or replacing heavy third-party libraries',
        potentialSavings: composition.thirdParty * 0.3
      });
    }

    // Check for large UI components
    if (composition.ui > this.bundleSize * 0.3) {
      opportunities.push({
        type: 'ui-components',
        priority: 'medium',
        description: 'UI components represent over 30% of bundle size',
        recommendation: 'Implement component-level code splitting',
        potentialSavings: composition.ui * 0.2
      });
    }

    // Check for large service layer
    if (composition.services > this.bundleSize * 0.25) {
      opportunities.push({
        type: 'services',
        priority: 'medium',
        description: 'Services represent over 25% of bundle size',
        recommendation: 'Implement service-level lazy loading',
        potentialSavings: composition.services * 0.15
      });
    }

    // Check for unused code
    if (composition.unknown > this.bundleSize * 0.1) {
      opportunities.push({
        type: 'unused-code',
        priority: 'high',
        description: 'Unknown/unused code represents over 10% of bundle size',
        recommendation: 'Remove dead code and unused dependencies',
        potentialSavings: composition.unknown * 0.8
      });
    }

    return opportunities;
  }

  /**
   * Update bundle size history
   * @param {number} size - Current bundle size
   */
  updateSizeHistory(size) {
    this.sizeHistory.push({
      size,
      timestamp: new Date().toISOString()
    });

    // Keep only last 30 entries
    if (this.sizeHistory.length > 30) {
      this.sizeHistory = this.sizeHistory.slice(-30);
    }
  }

  /**
   * Check budget compliance
   * @param {number} size - Bundle size
   * @returns {Object} Budget compliance status
   */
  checkBudgetCompliance(size) {
    const status = {
      compliant: true,
      level: 'good',
      message: 'Bundle size is within target budget',
      details: {}
    };

    if (size > this.budgets.error) {
      status.compliant = false;
      status.level = 'error';
      status.message = 'Bundle size exceeds error threshold';
    } else if (size > this.budgets.warning) {
      status.compliant = false;
      status.level = 'warning';
      status.message = 'Bundle size exceeds warning threshold';
    } else if (size > this.budgets.target) {
      status.level = 'info';
      status.message = 'Bundle size exceeds target but is within acceptable range';
    }

    status.details = {
      current: size,
      target: this.budgets.target,
      warning: this.budgets.warning,
      error: this.budgets.error,
      percentageOfTarget: (size / this.budgets.target) * 100
    };

    return status;
  }

  /**
   * Analyze bundle size trends
   * @returns {Object} Trend analysis
   */
  analyzeTrends() {
    if (this.sizeHistory.length < 2) {
      return {
        trend: 'stable',
        change: 0,
        average: this.bundleSize
      };
    }

    const recent = this.sizeHistory.slice(-5);
    const older = this.sizeHistory.slice(-10, -5);

    const recentAverage = recent.reduce((sum, entry) => sum + entry.size, 0) / recent.length;
    const olderAverage = older.reduce((sum, entry) => sum + entry.size, 0) / older.length;

    const change = recentAverage - olderAverage;
    const percentageChange = (change / olderAverage) * 100;

    let trend = 'stable';
    if (percentageChange > 5) {
      trend = 'increasing';
    } else if (percentageChange < -5) {
      trend = 'decreasing';
    }

    return {
      trend,
      change,
      percentageChange,
      recentAverage,
      olderAverage
    };
  }

  /**
   * Generate optimization recommendations
   * @returns {Array} Optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Bundle size recommendations
    if (this.bundleSize > this.budgets.target) {
      recommendations.push({
        category: 'bundle-size',
        priority: 'high',
        title: 'Reduce Bundle Size',
        description: 'Bundle size exceeds target of 1MB',
        actions: [
          'Implement code splitting for routes',
          'Use dynamic imports for heavy components',
          'Optimize and compress images',
          'Remove unused dependencies'
        ]
      });
    }

    // Third-party optimization
    if (this.bundleComposition.thirdParty > this.bundleSize * 0.3) {
      recommendations.push({
        category: 'third-party',
        priority: 'medium',
        title: 'Optimize Third-Party Dependencies',
        description: 'Third-party libraries are a significant portion of the bundle',
        actions: [
          'Replace heavy libraries with lighter alternatives',
          'Use CDN for large libraries where possible',
          'Implement lazy loading for non-critical libraries',
          'Bundle third-party libraries separately'
        ]
      });
    }

    // Code splitting recommendations
    recommendations.push({
      category: 'code-splitting',
      priority: 'medium',
      title: 'Implement Advanced Code Splitting',
      description: 'Further optimize loading performance',
      actions: [
        'Split vendor and application code',
        'Implement route-based code splitting',
        'Use React.lazy for component-level splitting',
        'Preload critical chunks'
      ]
    });

    return recommendations;
  }

  /**
   * Get bundle size report
   * @returns {Object} Comprehensive bundle size report
   */
  getBundleReport() {
    return {
      currentSize: this.bundleSize,
      composition: this.bundleComposition,
      opportunities: this.optimizationOpportunities,
      trends: this.analyzeTrends(),
      recommendations: this.generateRecommendations(),
      history: this.sizeHistory,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export bundle data for external monitoring
   * @returns {Object} Bundle data for external systems
   */
  exportForMonitoring() {
    return {
      application: 'AlphaFrame Galileo V2.2',
      bundleSize: this.bundleSize,
      composition: this.bundleComposition,
      trends: this.analyzeTrends(),
      timestamp: new Date().toISOString()
    };
  }
}

export default BundleAnalyzer; 