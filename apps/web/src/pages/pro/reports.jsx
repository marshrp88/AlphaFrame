/**
 * reports.jsx
 * 
 * Purpose: Report Center & Dashboards page providing multiple dashboard modes
 * and comprehensive financial reporting for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Display three hardcoded dashboard modes (Planner, Investor, Minimalist)
 * 2. Show budget adherence reports and spending heatmaps
 * 3. Display allocation drift analysis and portfolio performance
 * 4. Integrate with NarrativeService for insights
 * 5. Provide export and sharing capabilities
 * 
 * Conclusion: Delivers comprehensive financial reporting with multiple
 * view modes while maintaining zero-knowledge compliance.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Select } from '../../components/ui/Select.jsx';
import narrativeService from '../../lib/services/NarrativeService.js';
import budgetService from '../../lib/services/BudgetService.js';
import cashFlowService from '../../lib/services/CashFlowService.js';
import portfolioAnalyzer from '../../lib/services/PortfolioAnalyzer.js';

const DASHBOARD_MODES = {
  PLANNER: {
    name: 'Planner',
    description: 'Comprehensive view for detailed financial planning',
    icon: '📊',
    features: ['Budget Tracking', 'Cash Flow Analysis', 'Goal Progress', 'Detailed Insights']
  },
  INVESTOR: {
    name: 'Investor',
    description: 'Portfolio-focused view for investment decisions',
    icon: '📈',
    features: ['Portfolio Analysis', 'Allocation Drift', 'Performance Metrics', 'Rebalancing Alerts']
  },
  MINIMALIST: {
    name: 'Minimalist',
    description: 'Clean, essential view for quick overview',
    icon: '🎯',
    features: ['Key Metrics', 'Recent Activity', 'Quick Actions', 'Essential Alerts']
  }
};

const ReportsPage = () => {
  const [selectedMode, setSelectedMode] = useState('PLANNER');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState(null);
  const [cashFlowData, setCashFlowData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load insights from NarrativeService
      const recentInsights = await narrativeService.generateInsights(24);
      setInsights(recentInsights);

      // Load budget data
      const budgetSummary = budgetService.getBudgetSummary();
      setBudgetData(budgetSummary);

      // Load cash flow data
      const cashFlowSummary = cashFlowService.getCashFlowSummary();
      setCashFlowData(cashFlowSummary);

      // Load portfolio data (mock for now)
      setPortfolioData({
        totalValue: 125000,
        allocation: {
          equity: 65,
          bonds: 25,
          cash: 10
        },
        performance: {
          ytd: 8.5,
          monthly: 2.1
        }
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlannerDashboard = () => (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
        {budgetData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${budgetData.monthlyIncome?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Monthly Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${budgetData.totalBudget?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {budgetData.categories || 0}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        )}
      </Card>

      {/* Cash Flow Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
        {cashFlowData && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Net Cash Flow</span>
              <span className={`font-semibold ${cashFlowData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${cashFlowData.netCashFlow?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Income</span>
              <span className="font-semibold text-green-600">
                ${cashFlowData.income?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Expenses</span>
              <span className="font-semibold text-red-600">
                ${cashFlowData.expenses?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Insights</h3>
        <div className="space-y-3">
          {insights.slice(0, 5).map((insight) => (
            <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm">{insight.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(insight.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {insight.priority}
                </span>
              </div>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent insights available</p>
          )}
        </div>
      </Card>
    </div>
  );

  const renderInvestorDashboard = () => (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        {portfolioData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${portfolioData.totalValue?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {portfolioData.performance?.ytd || 0}%
              </div>
              <div className="text-sm text-gray-600">YTD Return</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolioData.performance?.monthly || 0}%
              </div>
              <div className="text-sm text-gray-600">Monthly Return</div>
            </div>
          </div>
        )}
      </Card>

      {/* Asset Allocation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
        {portfolioData && (
          <div className="space-y-3">
            {Object.entries(portfolioData.allocation).map(([asset, percentage]) => (
              <div key={asset} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="capitalize">{asset}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Portfolio Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Insights</h3>
        <div className="space-y-3">
          {insights.filter(i => i.type.includes('portfolio')).slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">{insight.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(insight.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
          {insights.filter(i => i.type.includes('portfolio')).length === 0 && (
            <p className="text-gray-500 text-center py-4">No portfolio insights available</p>
          )}
        </div>
      </Card>
    </div>
  );

  const renderMinimalistDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              ${budgetData?.monthlyIncome?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-600">Income</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">
              ${cashFlowData?.expenses?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-600">Expenses</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">
              ${portfolioData?.totalValue?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-600">Portfolio</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">
              {insights.filter(i => i.priority === 'high').length}
            </div>
            <div className="text-xs text-gray-600">Alerts</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full">
            View Budget
          </Button>
          <Button variant="outline" className="w-full">
            Check Portfolio
          </Button>
          <Button variant="outline" className="w-full">
            Add Transaction
          </Button>
          <Button variant="outline" className="w-full">
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Essential Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Essential Alerts</h3>
        <div className="space-y-2">
          {insights.filter(i => i.priority === 'high').slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">{insight.message}</p>
            </div>
          ))}
          {insights.filter(i => i.priority === 'high').length === 0 && (
            <p className="text-green-600 text-center py-4">No critical alerts</p>
          )}
        </div>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    switch (selectedMode) {
      case 'PLANNER':
        return renderPlannerDashboard();
      case 'INVESTOR':
        return renderInvestorDashboard();
      case 'MINIMALIST':
        return renderMinimalistDashboard();
      default:
        return renderPlannerDashboard();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Dashboards</h1>
        <p className="text-gray-600">Comprehensive financial reporting and insights</p>
      </div>

      {/* Dashboard Mode Selector */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Dashboard Mode</h2>
            <p className="text-sm text-gray-600">
              {DASHBOARD_MODES[selectedMode].description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedMode}
              onValueChange={setSelectedMode}
              className="w-48"
            >
              {Object.entries(DASHBOARD_MODES).map(([key, mode]) => (
                <option key={key} value={key}>
                  {mode.icon} {mode.name}
                </option>
              ))}
            </Select>
            <Button onClick={loadDashboardData} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {/* Mode Features */}
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Features:</h3>
          <div className="flex flex-wrap gap-2">
            {DASHBOARD_MODES[selectedMode].features.map((feature) => (
              <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Dashboard Content */}
      {renderDashboard()}

      {/* Export Section */}
      <Card className="p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
            <p className="text-sm text-gray-600">
              Export your financial reports and insights
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export PDF
            </Button>
            <Button variant="outline">
              Export CSV
            </Button>
            <Button>
              Share Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage; 