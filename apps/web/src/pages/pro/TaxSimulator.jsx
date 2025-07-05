import React, { useState, useEffect } from 'react';
import { TaxService } from '../../lib/services/TaxService';
import { ExplainabilityEngine } from '../../lib/services/ExplainabilityEngine';
import './ProPlannerPage.css';

/**
 * TaxSimulator Component
 * 
 * PURPOSE: Provides an interactive interface for tax optimization simulations
 * allowing users to explore different tax scenarios and see real-time
 * calculations of their tax liability and potential savings.
 * 
 * PROCEDURE: 
 * 1. Collects user financial data (income, deductions, credits)
 * 2. Runs tax calculations using TaxService
 * 3. Generates explanations using ExplainabilityEngine
 * 4. Displays results with visual charts and recommendations
 * 
 * CONCLUSION: Users can optimize their tax strategy by testing different
 * scenarios and understanding the impact of financial decisions.
 */
const TaxSimulator = () => {
  // State for user input data
  const [taxData, setTaxData] = useState({
    filingStatus: 'single',
    income: 75000,
    deductions: {
      standard: 13850,
      itemized: 0,
      useStandard: true
    },
    credits: {
      childTaxCredit: 0,
      earnedIncomeCredit: 0,
      educationCredits: 0
    },
    retirementContributions: {
      traditional401k: 0,
      traditionalIRA: 0,
      hsa: 0
    }
  });

  // State for calculation results
  const [results, setResults] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate tax liability whenever tax data changes
  useEffect(() => {
    const calculateTax = async () => {
      setIsCalculating(true);
      try {
        // Run tax calculation
        const taxResult = await TaxService.calculateTaxLiability(taxData);
        
        // Generate explanations
        const taxExplanations = await ExplainabilityEngine.generateTaxExplanations(
          taxData, 
          taxResult
        );

        setResults(taxResult);
        setExplanations(taxExplanations);
      } catch (error) {
        console.error('Tax calculation error:', error);
        setResults(null);
        setExplanations([]);
      } finally {
        setIsCalculating(false);
      }
    };

    // Debounce calculations to avoid excessive API calls
    const timeoutId = setTimeout(calculateTax, 500);
    return () => clearTimeout(timeoutId);
  }, [taxData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTaxData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setTaxData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Calculate potential savings from optimization
  const calculateOptimization = () => {
    if (!results) return null;

    // Simple optimization: increase 401k contribution
    const optimizedData = {
      ...taxData,
      retirementContributions: {
        ...taxData.retirementContributions,
        traditional401k: Math.min(taxData.retirementContributions.traditional401k + 5000, 22500)
      }
    };

    return TaxService.calculateTaxLiability(optimizedData);
  };

  const optimization = calculateOptimization();

  return (
    <div className="tax-simulator">
      <div className="simulator-header">
        <h2>Tax Optimization Simulator</h2>
        <p>Explore different tax scenarios and optimize your strategy</p>
      </div>

      <div className="simulator-content">
        {/* Input Section */}
        <div className="input-section">
          <h3>Financial Information</h3>
          
          <div className="input-group">
            <label>Filing Status</label>
            <select 
              value={taxData.filingStatus}
              onChange={(e) => handleInputChange('filingStatus', e.target.value)}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
          </div>

          <div className="input-group">
            <label>Annual Income ($)</label>
            <input
              type="number"
              value={taxData.income}
              onChange={(e) => handleInputChange('income', parseInt(e.target.value) || 0)}
              placeholder="75000"
            />
          </div>

          <div className="input-group">
            <label>Deductions</label>
            <div className="deduction-options">
              <label>
                <input
                  type="radio"
                  checked={taxData.deductions.useStandard}
                  onChange={() => handleNestedChange('deductions', 'useStandard', true)}
                />
                Standard Deduction
              </label>
              <label>
                <input
                  type="radio"
                  checked={!taxData.deductions.useStandard}
                  onChange={() => handleNestedChange('deductions', 'useStandard', false)}
                />
                Itemized Deductions
              </label>
            </div>
            
            {!taxData.deductions.useStandard && (
              <input
                type="number"
                value={taxData.deductions.itemized}
                onChange={(e) => handleNestedChange('deductions', 'itemized', parseInt(e.target.value) || 0)}
                placeholder="Itemized deduction amount"
              />
            )}
          </div>

          <div className="input-group">
            <label>Retirement Contributions</label>
            <div className="contribution-inputs">
              <div>
                <label>Traditional 401(k) ($)</label>
                <input
                  type="number"
                  value={taxData.retirementContributions.traditional401k}
                  onChange={(e) => handleNestedChange('retirementContributions', 'traditional401k', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <label>Traditional IRA ($)</label>
                <input
                  type="number"
                  value={taxData.retirementContributions.traditionalIRA}
                  onChange={(e) => handleNestedChange('retirementContributions', 'traditionalIRA', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <label>HSA ($)</label>
                <input
                  type="number"
                  value={taxData.retirementContributions.hsa}
                  onChange={(e) => handleNestedChange('retirementContributions', 'hsa', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h3>Tax Analysis</h3>
          
          {isCalculating && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Calculating your tax liability...</p>
            </div>
          )}

          {results && (
            <div className="tax-results">
              <div className="result-card primary">
                <h4>Current Tax Liability</h4>
                <div className="amount">${results.taxLiability.toLocaleString()}</div>
                <div className="breakdown">
                  <div>Effective Tax Rate: {results.effectiveTaxRate.toFixed(1)}%</div>
                  <div>Marginal Tax Rate: {results.marginalTaxRate.toFixed(1)}%</div>
                </div>
              </div>

              {optimization && (
                <div className="result-card optimization">
                  <h4>Optimization Opportunity</h4>
                  <div className="amount">${(results.taxLiability - optimization.taxLiability).toLocaleString()}</div>
                  <div className="savings-label">Potential Annual Savings</div>
                  <div className="optimization-details">
                    <p>Increase 401(k) contribution by $5,000</p>
                    <p>New tax liability: ${optimization.taxLiability.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="tax-breakdown">
                <h4>Tax Breakdown</h4>
                <div className="breakdown-item">
                  <span>Gross Income:</span>
                  <span>${results.grossIncome.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span>Adjusted Gross Income:</span>
                  <span>${results.adjustedGrossIncome.toLocaleString()}</span>
                </div>
                <div className="breakdown-item">
                  <span>Taxable Income:</span>
                  <span>${results.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="breakdown-item total">
                  <span>Total Tax:</span>
                  <span>${results.taxLiability.toLocaleString()}</span>
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

export default TaxSimulator; 