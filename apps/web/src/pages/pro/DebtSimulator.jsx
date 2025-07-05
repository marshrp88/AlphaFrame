import React, { useState, useEffect } from 'react';
import { DebtService } from '../../lib/services/DebtService';
import { ExplainabilityEngine } from '../../lib/services/ExplainabilityEngine';
import './ProPlannerPage.css';

/**
 * DebtSimulator Component
 * 
 * PURPOSE: Provides an interactive interface for debt payoff strategy simulations
 * allowing users to compare different payoff methods (avalanche, snowball, hybrid)
 * and see the impact on total interest paid and payoff timeline.
 * 
 * PROCEDURE: 
 * 1. Collects user debt information (balances, interest rates, minimum payments)
 * 2. Runs debt calculations using DebtService for different strategies
 * 3. Generates explanations using ExplainabilityEngine
 * 4. Displays results with visual charts and payoff timelines
 * 
 * CONCLUSION: Users can optimize their debt payoff strategy by comparing
 * different methods and understanding the financial impact of each approach.
 */
const DebtSimulator = () => {
  // State for user debt data
  const [debtData, setDebtData] = useState({
    debts: [
      {
        id: 1,
        name: 'Credit Card 1',
        balance: 5000,
        interestRate: 18.99,
        minimumPayment: 150
      },
      {
        id: 2,
        name: 'Student Loan',
        balance: 25000,
        interestRate: 6.8,
        minimumPayment: 300
      },
      {
        id: 3,
        name: 'Car Loan',
        balance: 15000,
        interestRate: 4.5,
        minimumPayment: 350
      }
    ],
    extraPayment: 500,
    strategy: 'avalanche' // avalanche, snowball, hybrid
  });

  // State for calculation results
  const [results, setResults] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate debt payoff whenever debt data changes
  useEffect(() => {
    const calculateDebt = async () => {
      setIsCalculating(true);
      try {
        // Run debt calculations for all strategies
        const debtResults = await Promise.all([
          DebtService.calculatePayoffStrategy(debtData.debts, debtData.extraPayment, 'avalanche'),
          DebtService.calculatePayoffStrategy(debtData.debts, debtData.extraPayment, 'snowball'),
          DebtService.calculatePayoffStrategy(debtData.debts, debtData.extraPayment, 'hybrid')
        ]);

        const [avalanche, snowball, hybrid] = debtResults;
        
        // Get current strategy result
        const currentStrategy = debtData.strategy === 'avalanche' ? avalanche : 
                               debtData.strategy === 'snowball' ? snowball : hybrid;

        // Generate explanations
        const debtExplanations = await ExplainabilityEngine.generateDebtExplanations(
          debtData, 
          { avalanche, snowball, hybrid },
          currentStrategy
        );

        setResults({ avalanche, snowball, hybrid, current: currentStrategy });
        setExplanations(debtExplanations);
      } catch (error) {
        console.error('Debt calculation error:', error);
        setResults(null);
        setExplanations([]);
      } finally {
        setIsCalculating(false);
      }
    };

    // Debounce calculations to avoid excessive API calls
    const timeoutId = setTimeout(calculateDebt, 500);
    return () => clearTimeout(timeoutId);
  }, [debtData]);

  // Handle strategy change
  const handleStrategyChange = (strategy) => {
    setDebtData(prev => ({
      ...prev,
      strategy
    }));
  };

  // Handle debt changes
  const handleDebtChange = (id, field, value) => {
    setDebtData(prev => ({
      ...prev,
      debts: prev.debts.map(debt => 
        debt.id === id ? { ...debt, [field]: value } : debt
      )
    }));
  };

  // Add new debt
  const addDebt = () => {
    const newId = Math.max(...debtData.debts.map(d => d.id)) + 1;
    setDebtData(prev => ({
      ...prev,
      debts: [...prev.debts, {
        id: newId,
        name: `Debt ${newId}`,
        balance: 0,
        interestRate: 0,
        minimumPayment: 0
      }]
    }));
  };

  // Remove debt
  const removeDebt = (id) => {
    setDebtData(prev => ({
      ...prev,
      debts: prev.debts.filter(debt => debt.id !== id)
    }));
  };

  // Handle extra payment change
  const handleExtraPaymentChange = (value) => {
    setDebtData(prev => ({
      ...prev,
      extraPayment: parseInt(value) || 0
    }));
  };

  if (!results) {
    return (
      <div className="debt-simulator">
        <div className="simulator-header">
          <h2>Debt Payoff Simulator</h2>
          <p>Compare different debt payoff strategies and optimize your approach</p>
        </div>
        
        {isCalculating && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Calculating payoff strategies...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="debt-simulator">
      <div className="simulator-header">
        <h2>Debt Payoff Simulator</h2>
        <p>Compare different debt payoff strategies and optimize your approach</p>
      </div>

      <div className="simulator-content">
        {/* Input Section */}
        <div className="input-section">
          <h3>Debt Information</h3>
          
          <div className="strategy-selector">
            <h4>Payoff Strategy</h4>
            <div className="strategy-options">
              <label className={debtData.strategy === 'avalanche' ? 'active' : ''}>
                <input
                  type="radio"
                  checked={debtData.strategy === 'avalanche'}
                  onChange={() => handleStrategyChange('avalanche')}
                />
                <div className="strategy-info">
                  <strong>Avalanche Method</strong>
                  <span>Pay highest interest rate first</span>
                </div>
              </label>
              
              <label className={debtData.strategy === 'snowball' ? 'active' : ''}>
                <input
                  type="radio"
                  checked={debtData.strategy === 'snowball'}
                  onChange={() => handleStrategyChange('snowball')}
                />
                <div className="strategy-info">
                  <strong>Snowball Method</strong>
                  <span>Pay smallest balance first</span>
                </div>
              </label>
              
              <label className={debtData.strategy === 'hybrid' ? 'active' : ''}>
                <input
                  type="radio"
                  checked={debtData.strategy === 'hybrid'}
                  onChange={() => handleStrategyChange('hybrid')}
                />
                <div className="strategy-info">
                  <strong>Hybrid Method</strong>
                  <span>Balance interest rate and balance</span>
                </div>
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Extra Monthly Payment ($)</label>
            <input
              type="number"
              value={debtData.extraPayment}
              onChange={(e) => handleExtraPaymentChange(e.target.value)}
              placeholder="500"
            />
          </div>

          <div className="debts-list">
            <h4>Your Debts</h4>
            {debtData.debts.map((debt) => (
              <div key={debt.id} className="debt-item">
                <div className="debt-header">
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => handleDebtChange(debt.id, 'name', e.target.value)}
                    placeholder="Debt name"
                  />
                  <button 
                    onClick={() => removeDebt(debt.id)}
                    className="remove-debt"
                  >
                    ×
                  </button>
                </div>
                
                <div className="debt-inputs">
                  <div>
                    <label>Balance ($)</label>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => handleDebtChange(debt.id, 'balance', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={debt.interestRate}
                      onChange={(e) => handleDebtChange(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label>Minimum Payment ($)</label>
                    <input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => handleDebtChange(debt.id, 'minimumPayment', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button onClick={addDebt} className="add-debt-btn">
              + Add Another Debt
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h3>Payoff Analysis</h3>
          
          {isCalculating && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Recalculating strategies...</p>
            </div>
          )}

          {results && (
            <div className="debt-results">
              {/* Strategy Comparison */}
              <div className="strategy-comparison">
                <h4>Strategy Comparison</h4>
                <div className="comparison-grid">
                  <div className="comparison-header">
                    <div>Strategy</div>
                    <div>Total Interest</div>
                    <div>Payoff Time</div>
                    <div>Monthly Payment</div>
                  </div>
                  
                  <div className={`comparison-row ${debtData.strategy === 'avalanche' ? 'selected' : ''}`}>
                    <div>Avalanche</div>
                    <div>${results.avalanche.totalInterest.toLocaleString()}</div>
                    <div>{results.avalanche.payoffMonths} months</div>
                    <div>${results.avalanche.monthlyPayment.toLocaleString()}</div>
                  </div>
                  
                  <div className={`comparison-row ${debtData.strategy === 'snowball' ? 'selected' : ''}`}>
                    <div>Snowball</div>
                    <div>${results.snowball.totalInterest.toLocaleString()}</div>
                    <div>{results.snowball.payoffMonths} months</div>
                    <div>${results.snowball.monthlyPayment.toLocaleString()}</div>
                  </div>
                  
                  <div className={`comparison-row ${debtData.strategy === 'hybrid' ? 'selected' : ''}`}>
                    <div>Hybrid</div>
                    <div>${results.hybrid.totalInterest.toLocaleString()}</div>
                    <div>{results.hybrid.payoffMonths} months</div>
                    <div>${results.hybrid.monthlyPayment.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Current Strategy Details */}
              <div className="current-strategy">
                <h4>{debtData.strategy.charAt(0).toUpperCase() + debtData.strategy.slice(1)} Method Details</h4>
                
                <div className="strategy-summary">
                  <div className="summary-card">
                    <h5>Total Savings</h5>
                    <div className="amount">${results.current.totalInterest.toLocaleString()}</div>
                    <div className="label">Interest Paid</div>
                  </div>
                  
                  <div className="summary-card">
                    <h5>Payoff Timeline</h5>
                    <div className="amount">{results.current.payoffMonths}</div>
                    <div className="label">Months</div>
                  </div>
                  
                  <div className="summary-card">
                    <h5>Monthly Payment</h5>
                    <div className="amount">${results.current.monthlyPayment.toLocaleString()}</div>
                    <div className="label">Total</div>
                  </div>
                </div>

                {/* Payoff Timeline */}
                <div className="payoff-timeline">
                  <h5>Payoff Order</h5>
                  <div className="timeline-items">
                    {results.current.payoffOrder.map((debt, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-number">{index + 1}</div>
                        <div className="timeline-content">
                          <div className="debt-name">{debt.name}</div>
                          <div className="debt-details">
                            Balance: ${debt.balance.toLocaleString()} | 
                            Interest: {debt.interestRate}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explanations */}
          {explanations.length > 0 && (
            <div className="explanations">
              <h4>Insights & Recommendations</h4>
              {explanations.map((explanation, index) => (
                <div key={index} className="explanation-card">
                  <h5>{explanation.title}</h5>
                  <p>{explanation.description}</p>
                  {explanation.impact && (
                    <div className="impact">
                      <strong>Potential Impact:</strong> {explanation.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtSimulator; 