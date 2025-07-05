/**
 * RetirementSimulator.jsx
 * 
 * PURPOSE: Provides comprehensive retirement planning simulation interface for AlphaFrame Galileo V2.2
 * This component allows users to input retirement data, run simulations, and view detailed
 * analysis with Monte Carlo forecasting and explainable insights.
 * 
 * PROCEDURE:
 * 1. Collects user retirement data through intuitive forms
 * 2. Runs retirement readiness calculations and Monte Carlo simulations
 * 3. Displays comprehensive results with visualizations
 * 4. Provides explainable insights and actionable recommendations
 * 5. Enables scenario comparison and optimization
 * 
 * CONCLUSION: Empowers users to make informed retirement planning decisions
 * with professional-grade analysis and clear, actionable guidance.
 */

import React, { useState, useEffect } from 'react';
import RetirementService from '../../lib/services/RetirementService.js';
import MonteCarloRunner from '../../lib/services/MonteCarloRunner.js';
import ExplainabilityEngine from '../../lib/services/ExplainabilityEngine.js';
import { Card, Button, Input, Select, ProgressBar, Alert, Spinner } from '../../shared/ui/index.js';
import './ProPlannerPage.css';

const RetirementSimulator = () => {
  const [formData, setFormData] = useState({
    currentAge: 35,
    currentIncome: 75000,
    expectedRetirementAge: 67,
    expectedLifeExpectancy: 90,
    monthlyContributions: 1000,
    retirementAccounts: [
      { name: '401(k)', balance: 50000 },
      { name: 'IRA', balance: 25000 }
    ]
  });

  const [results, setResults] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [userSophistication, setUserSophistication] = useState('intermediate');

  const retirementService = new RetirementService();
  const monteCarloRunner = new MonteCarloRunner();
  const explainabilityEngine = new ExplainabilityEngine();

  /**
   * Handle form input changes
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Add new retirement account
   */
  const addRetirementAccount = () => {
    setFormData(prev => ({
      ...prev,
      retirementAccounts: [
        ...prev.retirementAccounts,
        { name: 'New Account', balance: 0 }
      ]
    }));
  };

  /**
   * Update retirement account
   * @param {number} index - Account index
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const updateRetirementAccount = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      retirementAccounts: prev.retirementAccounts.map((account, i) => 
        i === index ? { ...account, [field]: value } : account
      )
    }));
  };

  /**
   * Remove retirement account
   * @param {number} index - Account index
   */
  const removeRetirementAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      retirementAccounts: prev.retirementAccounts.filter((_, i) => i !== index)
    }));
  };

  /**
   * Run retirement analysis
   */
  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Run basic retirement analysis
      const basicResults = await retirementService.calculateRetirementReadiness(formData);
      setResults(basicResults);

      // Run Monte Carlo simulation
      const simulationConfig = {
        simulations: 5000,
        marketParams: {
          marketReturn: { mean: 0.07, stdDev: 0.15 },
          inflation: { mean: 0.025, stdDev: 0.01 }
        },
        userData: {
          currentSavings: basicResults.breakdown.currentSavings,
          monthlyContribution: formData.monthlyContributions,
          yearsToRetirement: basicResults.yearsToRetirement,
          targetRetirementIncome: basicResults.retirementIncomeNeeds
        }
      };
      
      const simulationData = await monteCarloRunner.runSimulation(simulationConfig);
      setSimulationResults(simulationData);

      // Generate explanations
      const explanationData = await explainabilityEngine.generateExplanation(
        basicResults,
        'retirement',
        { sophisticationLevel: userSophistication }
      );
      setExplanation(explanationData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Get readiness score color
   * @param {number} score - Readiness score
   * @returns {string} Color class
   */
  const getReadinessColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <div className="retirement-simulator">
      <div className="simulator-header">
        <h2>Retirement Planning Simulator</h2>
        <p>Plan your retirement with comprehensive analysis and Monte Carlo simulations</p>
      </div>

      <div className="simulator-content">
        {/* Input Form */}
        <Card className="input-section">
          <h3>Your Retirement Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Current Age</label>
              <Input
                type="number"
                value={formData.currentAge}
                onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
                min="18"
                max="80"
              />
            </div>

            <div className="form-group">
              <label>Current Annual Income</label>
              <Input
                type="number"
                value={formData.currentIncome}
                onChange={(e) => handleInputChange('currentIncome', parseInt(e.target.value))}
                min="0"
                step="1000"
              />
            </div>

            <div className="form-group">
              <label>Expected Retirement Age</label>
              <Input
                type="number"
                value={formData.expectedRetirementAge}
                onChange={(e) => handleInputChange('expectedRetirementAge', parseInt(e.target.value))}
                min="50"
                max="80"
              />
            </div>

            <div className="form-group">
              <label>Expected Life Expectancy</label>
              <Input
                type="number"
                value={formData.expectedLifeExpectancy}
                onChange={(e) => handleInputChange('expectedLifeExpectancy', parseInt(e.target.value))}
                min="70"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Monthly Retirement Contributions</label>
              <Input
                type="number"
                value={formData.monthlyContributions}
                onChange={(e) => handleInputChange('monthlyContributions', parseInt(e.target.value))}
                min="0"
                step="100"
              />
            </div>

            <div className="form-group">
              <label>Explanation Level</label>
              <Select
                value={userSophistication}
                onChange={(e) => setUserSophistication(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>
          </div>

          {/* Retirement Accounts */}
          <div className="retirement-accounts">
            <h4>Retirement Accounts</h4>
            {formData.retirementAccounts.map((account, index) => (
              <div key={index} className="account-row">
                <Input
                  placeholder="Account Name"
                  value={account.name}
                  onChange={(e) => updateRetirementAccount(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Balance"
                  value={account.balance}
                  onChange={(e) => updateRetirementAccount(index, 'balance', parseInt(e.target.value) || 0)}
                  min="0"
                  step="1000"
                />
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => removeRetirementAccount(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addRetirementAccount}>
              Add Account
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={runAnalysis}
            disabled={loading}
            className="run-analysis-btn"
          >
            {loading ? <Spinner size="small" /> : 'Run Analysis'}
          </Button>
        </Card>

        {/* Results Section */}
        {error && (
          <Alert variant="danger">
            <strong>Analysis Error:</strong> {error}
          </Alert>
        )}

        {results && (
          <div className="results-section">
            {/* Basic Results */}
            <Card className="basic-results">
              <h3>Retirement Readiness Analysis</h3>
              
              <div className="readiness-score">
                <h4>Your Retirement Readiness Score</h4>
                <div className={`score-display ${getReadinessColor(results.readinessScore)}`}>
                  <span className="score-number">{results.readinessScore}%</span>
                  <ProgressBar 
                    value={results.readinessScore} 
                    variant={getReadinessColor(results.readinessScore)}
                  />
                </div>
              </div>

              <div className="key-metrics">
                <div className="metric">
                  <label>Projected Retirement Savings</label>
                  <span className="value">{formatCurrency(results.projectedSavings)}</span>
                </div>
                <div className="metric">
                  <label>Annual Retirement Income Needed</label>
                  <span className="value">{formatCurrency(results.retirementIncomeNeeds)}</span>
                </div>
                <div className="metric">
                  <label>Years to Retirement</label>
                  <span className="value">{results.yearsToRetirement} years</span>
                </div>
                <div className="metric">
                  <label>Monthly Contribution Needed</label>
                  <span className="value">{formatCurrency(results.monthlyContributionNeeded)}</span>
                </div>
              </div>
            </Card>

            {/* Monte Carlo Results */}
            {simulationResults && (
              <Card className="monte-carlo-results">
                <h3>Monte Carlo Simulation Results</h3>
                <p>Based on {simulationResults.totalSimulations.toLocaleString()} simulations</p>
                
                <div className="simulation-stats">
                  <div className="stat">
                    <label>Average Readiness Score</label>
                    <span className="value">{simulationResults.statistics.readinessScore.mean.toFixed(1)}%</span>
                  </div>
                  <div className="stat">
                    <label>Success Probability</label>
                    <span className="value">{simulationResults.riskAssessment.successRate?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="stat">
                    <label>Risk Level</label>
                    <span className={`value risk-${simulationResults.riskAssessment.overallRisk.toLowerCase()}`}>
                      {simulationResults.riskAssessment.overallRisk}
                    </span>
                  </div>
                </div>

                <div className="confidence-intervals">
                  <h4>Confidence Intervals</h4>
                  <div className="interval-grid">
                    <div className="interval">
                      <label>25th Percentile</label>
                      <span>{simulationResults.confidenceIntervals.readinessScore['25th'].toFixed(1)}%</span>
                    </div>
                    <div className="interval">
                      <label>50th Percentile</label>
                      <span>{simulationResults.confidenceIntervals.readinessScore['50th'].toFixed(1)}%</span>
                    </div>
                    <div className="interval">
                      <label>75th Percentile</label>
                      <span>{simulationResults.confidenceIntervals.readinessScore['75th'].toFixed(1)}%</span>
                    </div>
                    <div className="interval">
                      <label>90th Percentile</label>
                      <span>{simulationResults.confidenceIntervals.readinessScore['90th'].toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Insights and Recommendations */}
            {explanation && (
              <Card className="insights-section">
                <h3>Insights & Recommendations</h3>
                
                <div className="explanation-summary">
                  <h4>Summary</h4>
                  <p>{explanation.summary}</p>
                </div>

                <div className="recommendations">
                  <h4>Recommendations</h4>
                  <ul>
                    {explanation.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="next-steps">
                  <h4>Next Steps</h4>
                  <ul>
                    {explanation.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="uncertainty">
                  <h4>Understanding Uncertainty</h4>
                  <p>{explanation.uncertaintyExplanation}</p>
                </div>
              </Card>
            )}

            {/* Detailed Breakdown */}
            {explanation && (
              <Card className="detailed-breakdown">
                <h3>Detailed Analysis</h3>
                
                <div className="breakdown-grid">
                  <div className="breakdown-section">
                    <h4>Key Metrics</h4>
                    {Object.entries(explanation.keyMetrics).map(([key, value]) => (
                      <div key={key} className="breakdown-item">
                        <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                        <span>{typeof value === 'number' ? formatCurrency(value) : value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="breakdown-section">
                    <h4>Assumptions</h4>
                    {Object.entries(explanation.detailedBreakdown.assumptions || {}).map(([key, value]) => (
                      <div key={key} className="breakdown-item">
                        <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="breakdown-section">
                    <h4>Calculations</h4>
                    {Object.entries(explanation.detailedBreakdown.calculations || {}).map(([key, value]) => (
                      <div key={key} className="breakdown-item">
                        <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementSimulator; 