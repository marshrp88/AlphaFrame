/**
 * Portfolio Optimizer Page
 * 
 * Purpose: Provides a comprehensive interface for portfolio analysis and optimization
 * with manual input capabilities, target allocation management, and real-time
 * deviation tracking for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Allows users to input portfolio holdings (ticker, quantity, current price)
 * 2. Provides target allocation configuration (e.g., 60/40 stocks/bonds)
 * 3. Displays real-time analysis with diversification scores
 * 4. Shows deviation from targets with visual indicators
 * 5. Generates actionable rebalancing recommendations
 * 
 * Conclusion: Empowers users to analyze and optimize their portfolios
 * with professional-grade tools while maintaining zero-knowledge compliance.
 */

import React, { useState, useEffect } from 'react';
import portfolioAnalyzer from '../../lib/services/PortfolioAnalyzer.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { Select } from '../../components/ui/Select.jsx';

const PortfolioOptimizer = () => {
  const [holdings, setHoldings] = useState([
    { ticker: '', quantity: '', currentPrice: '', costBasis: '' }
  ]);
  const [targets, setTargets] = useState(portfolioAnalyzer.getDefaultTargets());
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supportedAssets] = useState(portfolioAnalyzer.getSupportedAssets());

  // Predefined target allocation presets
  const allocationPresets = {
    'Conservative (30/70)': { equity: 30, bonds: 60, cash: 5, international: 3, real_estate: 1, commodities: 1 },
    'Moderate (60/40)': { equity: 60, bonds: 30, cash: 5, international: 3, real_estate: 1, commodities: 1 },
    'Aggressive (80/20)': { equity: 80, bonds: 15, cash: 2, international: 2, real_estate: 0.5, commodities: 0.5 },
    'Three-Fund Portfolio': { equity: 40, bonds: 40, international: 20, cash: 0, real_estate: 0, commodities: 0 }
  };

  useEffect(() => {
    // Auto-analyze when holdings or targets change
    if (holdings.length > 0 && holdings[0].ticker) {
      analyzePortfolio();
    }
  }, [holdings, targets]);

  const analyzePortfolio = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter out empty holdings
      const validHoldings = holdings.filter(h => h.ticker && h.quantity && h.currentPrice);
      
      if (validHoldings.length === 0) {
        setAnalysis(null);
        return;
      }

      // Convert to proper format
      const formattedHoldings = validHoldings.map(h => ({
        ticker: h.ticker.toUpperCase(),
        quantity: parseFloat(h.quantity),
        currentPrice: parseFloat(h.currentPrice),
        costBasis: parseFloat(h.costBasis) || parseFloat(h.currentPrice)
      }));

      const result = await portfolioAnalyzer.analyzePortfolio(formattedHoldings, targets);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const addHolding = () => {
    setHoldings([...holdings, { ticker: '', quantity: '', currentPrice: '', costBasis: '' }]);
  };

  const removeHolding = (index) => {
    const newHoldings = holdings.filter((_, i) => i !== index);
    setHoldings(newHoldings);
  };

  const updateHolding = (index, field, value) => {
    const newHoldings = [...holdings];
    newHoldings[index][field] = value;
    setHoldings(newHoldings);
  };

  const updateTarget = (assetClass, value) => {
    setTargets(prev => ({
      ...prev,
      [assetClass]: parseFloat(value) || 0
    }));
  };

  const applyPreset = (presetName) => {
    setTargets(allocationPresets[presetName]);
  };

  const getDeviationColor = (deviation) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation <= 5) return 'text-green-600';
    if (absDeviation <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDiversificationColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Optimizer</h1>
        <p className="text-gray-600">
          Analyze your portfolio allocation and get personalized optimization recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Input Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio Holdings</h2>
            
            <div className="space-y-4">
              {holdings.map((holding, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label htmlFor={`ticker-${index}`}>Ticker</Label>
                    <Input
                      id={`ticker-${index}`}
                      value={holding.ticker}
                      onChange={(e) => updateHolding(index, 'ticker', e.target.value)}
                      placeholder="AAPL"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      value={holding.quantity}
                      onChange={(e) => updateHolding(index, 'quantity', e.target.value)}
                      placeholder="100"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`currentPrice-${index}`}>Current Price</Label>
                    <Input
                      id={`currentPrice-${index}`}
                      type="number"
                      step="0.01"
                      value={holding.currentPrice}
                      onChange={(e) => updateHolding(index, 'currentPrice', e.target.value)}
                      placeholder="150.00"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`costBasis-${index}`}>Cost Basis</Label>
                    <Input
                      id={`costBasis-${index}`}
                      type="number"
                      step="0.01"
                      value={holding.costBasis}
                      onChange={(e) => updateHolding(index, 'costBasis', e.target.value)}
                      placeholder="140.00"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHolding(index)}
                      className="w-full"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button onClick={addHolding} variant="outline" className="w-full">
                + Add Holding
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Target Allocation</h2>
            
            <div className="mb-4">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(allocationPresets).map(preset => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(targets).map(([assetClass, percentage]) => (
                <div key={assetClass}>
                  <Label htmlFor={`target-${assetClass}`}>
                    {assetClass.charAt(0).toUpperCase() + assetClass.slice(1)} (%)
                  </Label>
                  <Input
                    id={`target-${assetClass}`}
                    type="number"
                    step="0.1"
                    value={percentage}
                    onChange={(e) => updateTarget(assetClass, e.target.value)}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Analysis Results Section */}
        <div className="space-y-6">
          {loading && (
            <Card className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Analyzing portfolio...</p>
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-6 border-red-200 bg-red-50">
              <h3 className="text-red-800 font-semibold mb-2">Analysis Error</h3>
              <p className="text-red-700">{error}</p>
            </Card>
          )}

          {analysis && (
            <>
              {/* Portfolio Summary */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">${analysis.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Holdings</p>
                    <p className="text-2xl font-bold">{analysis.currentAllocation.byTicker ? Object.keys(analysis.currentAllocation.byTicker).length : 0}</p>
                  </div>
                </div>
              </Card>

              {/* Diversification Score */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Diversification Analysis</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Overall Score</span>
                    <span className={`font-bold text-lg ${getDiversificationColor(analysis.diversificationScores.overall)}`}>
                      {analysis.diversificationScores.overall}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sector Diversity</span>
                    <span>{analysis.diversificationScores.sectorCount} sectors</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Asset Classes</span>
                    <span>{analysis.diversificationScores.assetClassCount} classes</span>
                  </div>
                </div>
              </Card>

              {/* Allocation vs Targets */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Allocation vs Targets</h2>
                <div className="space-y-3">
                  {Object.entries(analysis.currentAllocation).map(([assetClass, current]) => {
                    if (assetClass === 'bySector' || assetClass === 'unknown') return null;
                    
                    const target = analysis.targetAllocation[assetClass] || 0;
                    const deviation = analysis.deviations[assetClass] || 0;
                    
                    return (
                      <div key={assetClass} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{assetClass}</span>
                            <span className={getDeviationColor(deviation)}>
                              {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full relative"
                              style={{ width: `${Math.min(current, 100)}%` }}
                            >
                              <div 
                                className="absolute top-0 right-0 w-1 h-2 bg-red-500"
                                style={{ left: `${Math.min(target, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Current: {current.toFixed(1)}%</span>
                            <span>Target: {target.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        rec.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <p className="text-sm">{rec.message}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOptimizer; 