/**
 * Budgeting & Cash Flow Page
 *
 * Purpose: Provides a user interface for managing budgets, viewing forecasts,
 * and tracking spending for the AlphaPro suite.
 *
 * Procedure:
 * 1. Allows users to set up and edit budget categories and monthly caps
 * 2. Displays 30/60/90 day budget forecasts and warnings
 * 3. Tracks spending against category limits
 * 4. Visualizes budget breakdowns and cash flow trends
 * 5. Surfaces actionable recommendations and warnings
 *
 * Conclusion: Empowers users to proactively manage their finances with
 * predictive analytics and clear visual feedback.
 */

import React, { useState, useEffect } from 'react';
import budgetService from '../../lib/services/BudgetService.js';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const BudgetPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [emergencyFund, setEmergencyFund] = useState(10000);
  const [budgetType, setBudgetType] = useState('category');
  const [categories, setCategories] = useState(budgetService.getCategories());
  const [forecast, setForecast] = useState(null);
  const [forecastDays, setForecastDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize budget on mount
    (async () => {
      await budgetService.initializeBudget(monthlyIncome, emergencyFund, budgetType);
      setCategories(budgetService.getCategories());
      await runForecast();
    })();
    // eslint-disable-next-line
  }, []);

  const runForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await budgetService.generateForecast(forecastDays);
      setForecast(result);
    } catch (err) {
      setError(err.message);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCapChange = (key, value) => {
    budgetService.updateCategoryCap(key, parseFloat(value) || 0);
    setCategories(budgetService.getCategories());
  };

  const handleForecastDaysChange = (e) => {
    setForecastDays(parseInt(e.target.value, 10));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budgeting & Cash Flow</h1>
        <p className="text-gray-600">
          Set up your budget, track spending, and forecast your financial future.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Budget Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={monthlyIncome}
              onChange={e => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="emergencyFund">Emergency Fund</Label>
            <Input
              id="emergencyFund"
              type="number"
              value={emergencyFund}
              onChange={e => setEmergencyFund(parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="budgetType">Budget Type</Label>
            <select
              id="budgetType"
              value={budgetType}
              onChange={e => setBudgetType(e.target.value)}
              className="text-sm border rounded px-2 py-1 w-full"
            >
              <option value="category">Category</option>
              <option value="envelope">Envelope</option>
            </select>
          </div>
        </div>
        <Button onClick={async () => {
          await budgetService.initializeBudget(monthlyIncome, emergencyFund, budgetType);
          setCategories(budgetService.getCategories());
          await runForecast();
        }}>
          Update Budget
        </Button>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>
        <div className="space-y-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label>{category.name}</Label>
                <span className="block text-xs text-gray-500">{category.type}</span>
              </div>
              <div className="col-span-4">
                <Label htmlFor={`cap-${key}`}>Monthly Cap</Label>
                <Input
                  id={`cap-${key}`}
                  type="number"
                  value={category.monthlyCap}
                  onChange={e => handleCapChange(key, e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Budget Forecast</h2>
        <div className="flex items-center gap-4 mb-4">
          <Label htmlFor="forecastDays">Forecast Period</Label>
          <select
            id="forecastDays"
            value={forecastDays}
            onChange={handleForecastDaysChange}
            className="text-sm border rounded px-2 py-1"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
          <Button onClick={runForecast} variant="outline">Run Forecast</Button>
        </div>
        {loading && <div>Loading forecast...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {forecast && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">${forecast.totalBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Spending</p>
                <p className="text-2xl font-bold">${forecast.projectedSpending.toLocaleString()}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Category Forecasts</h3>
              <div className="space-y-2">
                {Object.entries(forecast.categoryForecasts).map(([key, cat]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{cat.name}</span>
                    <span className={`font-medium ${cat.status === 'over' ? 'text-red-600' : cat.status === 'under' ? 'text-green-600' : 'text-gray-700'}`}>{cat.status}</span>
                    <span className="text-xs text-gray-500">Budget: ${cat.budget.toLocaleString()} | Projected: ${cat.projectedSpending.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            {forecast.warnings.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Warnings</h4>
                <ul className="text-red-700 text-sm list-disc ml-6">
                  {forecast.warnings.map((w, i) => <li key={i}>{w.message}</li>)}
                </ul>
              </div>
            )}
            {forecast.recommendations.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">Recommendations</h4>
                <ul className="text-yellow-700 text-sm list-disc ml-6">
                  {forecast.recommendations.map((r, i) => <li key={i}>{r.message}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Projected Savings</h4>
              <p className="text-lg font-bold">${forecast.projectedSavings.toLocaleString()}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BudgetPage; 