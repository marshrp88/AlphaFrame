import React, { useState, useEffect } from 'react';
import './SimulationInsights.css';

/**
 * SimulationInsights - Financial projections and scenario analysis
 * 
 * Purpose: Shows users how their financial decisions today impact
 * their future financial health through interactive simulations.
 * 
 * Procedure:
 * 1. Displays current financial trajectory
 * 2. Shows alternative scenarios and outcomes
 * 3. Provides actionable insights for improvement
 * 4. Allows users to explore different financial paths
 * 
 * Conclusion: Users understand the long-term impact of their
 * financial decisions and can make informed choices.
 */
const SimulationInsights = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('current');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="simulation-insights-section">
        <h3>Financial Insights</h3>
        <p>Loading simulation data...</p>
      </div>
    );
  }

  const {
    currentTrajectory = {},
    scenarios = {},
    projections = {},
    insights = []
  } = data;

  const scenariosList = Object.entries(scenarios);

  const getScenarioIcon = (scenario) => {
    switch (scenario) {
      case 'optimistic': return '🚀';
      case 'conservative': return '🛡️';
      case 'aggressive': return '⚡';
      default: return '📊';
    }
  };

  const getScenarioColor = (scenario) => {
    switch (scenario) {
      case 'optimistic': return 'var(--color-success)';
      case 'conservative': return 'var(--color-primary)';
      case 'aggressive': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className={`simulation-insights-section ${isVisible ? 'visible' : ''}`}>
      <header className="section-header">
        <h3>Financial Insights</h3>
        <p className="section-subtitle">Your financial future projections</p>
      </header>

      {/* Current Trajectory */}
      <div className="current-trajectory">
        <h4>Current Trajectory</h4>
        <div className="trajectory-metrics">
          <div className="trajectory-metric">
            <span className="metric-label">5-Year Net Worth</span>
            <span className="metric-value">${currentTrajectory.fiveYearNetWorth?.toLocaleString() || '0'}</span>
          </div>
          <div className="trajectory-metric">
            <span className="metric-label">Retirement Age</span>
            <span className="metric-value">{currentTrajectory.retirementAge || '65'}</span>
          </div>
          <div className="trajectory-metric">
            <span className="metric-label">Financial Freedom</span>
            <span className="metric-value">{currentTrajectory.financialFreedomAge || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="scenario-comparison">
        <h4>Explore Scenarios</h4>
        <div className="scenarios-grid">
          {scenariosList.map(([scenario, data]) => (
            <div 
              key={scenario}
              className={`scenario-card ${selectedScenario === scenario ? 'active' : ''}`}
              onClick={() => setSelectedScenario(scenario)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedScenario(scenario);
                }
              }}
            >
              <div className="scenario-header">
                <span className="scenario-icon">{getScenarioIcon(scenario)}</span>
                <span className="scenario-name">{scenario.charAt(0).toUpperCase() + scenario.slice(1)}</span>
              </div>
              <div className="scenario-metrics">
                <div className="scenario-metric">
                  <span className="metric-label">Net Worth</span>
                  <span className="metric-value">${data.netWorth?.toLocaleString() || '0'}</span>
                </div>
                <div className="scenario-metric">
                  <span className="metric-label">Years to Goal</span>
                  <span className="metric-value">{data.yearsToGoal || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && scenarios[selectedScenario] && (
        <div className="scenario-details">
          <h4>{selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)} Scenario</h4>
          <div className="scenario-description">
            <p>{scenarios[selectedScenario].description || 'Explore this financial scenario to see potential outcomes.'}</p>
          </div>
          
          <div className="scenario-actions">
            <h5>Key Actions</h5>
            <ul className="action-list">
              {scenarios[selectedScenario].actions?.map((action, index) => (
                <li key={index} className="action-item">
                  <span className="action-icon">💡</span>
                  <span className="action-text">{action}</span>
                </li>
              )) || []}
            </ul>
          </div>
        </div>
      )}

      {/* Projections Chart */}
      <div className="projections-chart">
        <h4>Net Worth Projection</h4>
        <div className="chart-container">
          <div className="chart-placeholder">
            <div className="chart-line" style={{ 
              background: `linear-gradient(90deg, ${getScenarioColor(selectedScenario)}, ${getScenarioColor(selectedScenario)}80)` 
            }}></div>
            <div className="chart-points">
              {[1, 2, 3, 4, 5].map((year) => (
                <div key={year} className="chart-point" style={{ 
                  left: `${(year - 1) * 20}%`,
                  backgroundColor: getScenarioColor(selectedScenario)
                }}>
                  <span className="point-value">${(projections[selectedScenario]?.[year] || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-labels">
            <span>Now</span>
            <span>1 Year</span>
            <span>2 Years</span>
            <span>3 Years</span>
            <span>4 Years</span>
            <span>5 Years</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="key-insights">
        <h4>Key Insights</h4>
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">{insight.icon || '💡'}</div>
              <div className="insight-content">
                <h5>{insight.title}</h5>
                <p>{insight.description}</p>
                {insight.impact && (
                  <span className="insight-impact">
                    Potential impact: {insight.impact}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="action-recommendations">
        <h4>Recommended Actions</h4>
        <div className="recommendations-list">
          {scenarios[selectedScenario]?.recommendations?.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-priority">
                <span className={`priority-dot ${rec.priority}`}></span>
                <span className="priority-text">{rec.priority} priority</span>
              </div>
              <div className="recommendation-content">
                <h5>{rec.title}</h5>
                <p>{rec.description}</p>
                <button className="action-button">
                  Learn More
                </button>
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

export default SimulationInsights; 