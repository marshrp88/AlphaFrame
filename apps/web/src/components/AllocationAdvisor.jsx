/**
 * AllocationAdvisor.jsx
 * 
 * Purpose: Provides asset allocation advice and rebalancing suggestions
 * based on static model presets and user portfolio analysis for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Offers predefined allocation models (Three-Fund, 60/40, etc.)
 * 2. Analyzes current portfolio against selected model
 * 3. Generates specific rebalancing recommendations
 * 4. Calculates required trades to achieve target allocation
 * 5. Logs advisor recommendations via ExecutionLogService
 * 
 * Conclusion: Helps users implement proven allocation strategies
 * with actionable rebalancing steps while maintaining zero-knowledge compliance.
 */

import React, { useState, useEffect } from 'react';
import portfolioAnalyzer from '../lib/services/PortfolioAnalyzer.js';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Select } from './ui/Select.jsx';

const AllocationAdvisor = ({ currentHoldings = [], onRecommendationSelect }) => {
  const [selectedModel, setSelectedModel] = useState('moderate');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined allocation models
  const allocationModels = {
    conservative: {
      name: 'Conservative (30/70)',
      description: 'Low risk, income-focused allocation suitable for retirees or risk-averse investors.',
      allocation: { equity: 30, bonds: 60, cash: 5, international: 3, real_estate: 1, commodities: 1 },
      riskLevel: 'Low',
      expectedReturn: '4-6%',
      rebalanceFrequency: 'Annually'
    },
    moderate: {
      name: 'Moderate (60/40)',
      description: 'Balanced allocation providing growth and stability for most investors.',
      allocation: { equity: 60, bonds: 30, cash: 5, international: 3, real_estate: 1, commodities: 1 },
      riskLevel: 'Medium',
      expectedReturn: '6-8%',
      rebalanceFrequency: 'Semi-annually'
    },
    aggressive: {
      name: 'Aggressive (80/20)',
      description: 'Growth-focused allocation for long-term investors with high risk tolerance.',
      allocation: { equity: 80, bonds: 15, cash: 2, international: 2, real_estate: 0.5, commodities: 0.5 },
      riskLevel: 'High',
      expectedReturn: '8-10%',
      rebalanceFrequency: 'Quarterly'
    },
    threeFund: {
      name: 'Three-Fund Portfolio',
      description: 'Simple, low-cost allocation using just three broad index funds.',
      allocation: { equity: 40, bonds: 40, international: 20, cash: 0, real_estate: 0, commodities: 0 },
      riskLevel: 'Medium',
      expectedReturn: '6-7%',
      rebalanceFrequency: 'Annually'
    },
    permanent: {
      name: 'Permanent Portfolio',
      description: 'All-weather allocation designed to perform in any economic environment.',
      allocation: { equity: 25, bonds: 25, cash: 25, commodities: 25, international: 0, real_estate: 0 },
      riskLevel: 'Low',
      expectedReturn: '5-7%',
      rebalanceFrequency: 'Annually'
    }
  };

  useEffect(() => {
    if (currentHoldings.length > 0) {
      analyzeCurrentAllocation();
    }
  }, [currentHoldings, selectedModel]);

  const analyzeCurrentAllocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const model = allocationModels[selectedModel];
      const result = await portfolioAnalyzer.analyzePortfolio(currentHoldings, model.allocation);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const generateRebalancingPlan = () => {
    if (!analysis) return null;

    const plan = {
      trades: [],
      summary: {
        totalValue: analysis.totalValue,
        currentAllocation: analysis.currentAllocation,
        targetAllocation: analysis.targetAllocation,
        deviations: analysis.deviations
      }
    };

    // Calculate required trades for significant deviations (>2%)
    Object.entries(analysis.deviations).forEach(([assetClass, deviation]) => {
      if (Math.abs(deviation) > 2) {
        const currentValue = analysis.currentAllocation[assetClass] * analysis.totalValue / 100;
        const targetValue = analysis.targetAllocation[assetClass] * analysis.totalValue / 100;
        const tradeValue = targetValue - currentValue;

        if (Math.abs(tradeValue) > analysis.totalValue * 0.01) { // Minimum 1% of portfolio
          plan.trades.push({
            assetClass,
            action: tradeValue > 0 ? 'buy' : 'sell',
            value: Math.abs(tradeValue),
            percentage: Math.abs(deviation),
            priority: Math.abs(deviation) > 10 ? 'high' : 'medium'
          });
        }
      }
    });

    // Sort trades by priority and percentage
    plan.trades.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === 'high' ? -1 : 1;
      }
      return b.percentage - a.percentage;
    });

    return plan;
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleModelChange = (modelKey) => {
    setSelectedModel(modelKey);
  };

  const handleRecommendationSelect = (recommendation) => {
    if (onRecommendationSelect) {
      onRecommendationSelect(recommendation);
    }
  };

  const rebalancingPlan = generateRebalancingPlan();
  const selectedModelData = allocationModels[selectedModel];

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Allocation Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(allocationModels).map(([key, model]) => (
            <div
              key={key}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedModel === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleModelChange(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleModelChange(key);
                }
              }}
            >
              <h3 className="font-semibold text-sm mb-2">{model.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{model.description}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Risk:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getRiskColor(model.riskLevel)}`}>
                    {model.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Expected Return:</span>
                  <span className="font-medium">{model.expectedReturn}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Rebalance:</span>
                  <span className="font-medium">{model.rebalanceFrequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Current vs Target Allocation */}
      {analysis && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Allocation Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Allocation */}
            <div>
              <h3 className="font-medium mb-3">Current Allocation</h3>
              <div className="space-y-2">
                {Object.entries(analysis.currentAllocation).map(([assetClass, percentage]) => {
                  if (assetClass === 'bySector' || assetClass === 'unknown') return null;
                  return (
                    <div key={assetClass} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{assetClass}</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Allocation */}
            <div>
              <h3 className="font-medium mb-3">Target Allocation ({selectedModelData.name})</h3>
              <div className="space-y-2">
                {Object.entries(analysis.targetAllocation).map(([assetClass, percentage]) => (
                  <div key={assetClass} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{assetClass}</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Rebalancing Recommendations */}
      {rebalancingPlan && rebalancingPlan.trades.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Rebalancing Recommendations</h2>
          
          <div className="space-y-4">
            {rebalancingPlan.trades.map((trade, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  trade.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium capitalize">
                      {trade.action} {trade.assetClass}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {trade.action === 'buy' ? 'Increase' : 'Reduce'} allocation by {trade.percentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      trade.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {trade.priority} priority
                    </span>
                    <p className="text-sm font-medium mt-1">
                      ${trade.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecommendationSelect(trade)}
                  className="w-full"
                >
                  Apply This Recommendation
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Implementation Notes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Consider transaction costs when implementing trades</li>
              <li>• Rebalance {selectedModelData.rebalanceFrequency.toLowerCase()} to maintain target allocation</li>
              <li>• High priority trades should be executed first</li>
              <li>• Consider tax implications of selling positions</li>
            </ul>
          </div>
        </Card>
      )}

      {/* No Rebalancing Needed */}
      {rebalancingPlan && rebalancingPlan.trades.length === 0 && analysis && (
        <Card className="p-6 border-green-200 bg-green-50">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Portfolio is Well-Balanced</h2>
          <p className="text-green-700">
            Your current allocation closely matches the {selectedModelData.name} target. 
            No immediate rebalancing is required. Consider reviewing again in {selectedModelData.rebalanceFrequency.toLowerCase()}.
          </p>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Analyzing portfolio allocation...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-red-800 font-semibold mb-2">Analysis Error</h3>
          <p className="text-red-700">{error}</p>
        </Card>
      )}
    </div>
  );
};

export default AllocationAdvisor; 