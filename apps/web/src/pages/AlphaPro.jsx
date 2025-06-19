/**
 * AlphaPro.jsx
 * 
 * Purpose: Main AlphaPro dashboard that provides navigation to all
 * MVP-Pro features including portfolio optimization, budgeting,
 * reporting, and feedback systems.
 * 
 * Procedure:
 * 1. Display welcome message and feature overview
 * 2. Provide navigation cards to all major features
 * 3. Show quick stats and recent activity
 * 4. Include feedback and help options
 * 
 * Conclusion: Central hub for all AlphaPro functionality with
 * intuitive navigation and user-friendly interface.
 */

import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import AllocationAdvisor from '../components/AllocationAdvisor.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import DashboardPicker from '../components/DashboardPicker.jsx';
import budgetService from '../lib/services/BudgetService.js';
import cashFlowService from '../lib/services/CashFlowService.js';
import portfolioAnalyzer from '../lib/services/PortfolioAnalyzer.js';
import executionLogService from '../lib/services/ExecutionLogService.js';

// Import the Pro feature pages
import BudgetPage from './pro/budget.jsx';
import OptimizerPage from './pro/optimizer.jsx';
import ReportsPage from './pro/reports.jsx';

const FEATURES = [
  {
    id: 'portfolio',
    title: 'Portfolio Optimizer',
    description: 'Analyze and optimize your investment portfolio with real-time allocation tracking',
    icon: '📈',
    color: 'blue',
    path: '/pro/optimizer',
    status: 'active'
  },
  {
    id: 'budget',
    title: 'Budget & Cash Flow',
    description: 'Track spending, set budgets, and forecast your financial future',
    icon: '💰',
    color: 'green',
    path: '/pro/budget',
    status: 'active'
  },
  {
    id: 'reports',
    title: 'Reports & Insights',
    description: 'Comprehensive dashboards and financial insights',
    icon: '📊',
    color: 'purple',
    path: '/pro/reports',
    status: 'active'
  },
  {
    id: 'advisor',
    title: 'Asset Allocation Advisor',
    description: 'Get personalized investment recommendations and rebalancing advice',
    icon: '🎯',
    color: 'orange',
    status: 'active'
  },
  {
    id: 'feedback',
    title: 'Pioneer Feedback',
    description: 'Help us improve AlphaPro by sharing your feedback',
    icon: '💬',
    color: 'teal',
    status: 'active'
  }
];

const AlphaProDashboard = () => {
  const [quickStats, setQuickStats] = useState({
    portfolioValue: 0,
    monthlyBudget: 0,
    cashFlow: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Load quick stats
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const budgetSummary = budgetService.getBudgetSummary();
      const cashFlowSummary = cashFlowService.getCashFlowSummary();
      const portfolioSummary = portfolioAnalyzer.getPortfolioSummary();
      const recentLogs = await executionLogService.getLogs(5); // Last 5 activities

      setQuickStats({
        portfolioValue: portfolioSummary.totalValue || 0,
        monthlyBudget: budgetSummary.totalBudget || 0,
        cashFlow: cashFlowSummary.netCashFlow || 0,
        recentActivity: recentLogs.slice(0, 3)
      });
    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  };

  const getFeatureColor = (color) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
      green: 'border-green-200 bg-green-50 hover:bg-green-100',
      purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
      orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
      teal: 'border-teal-200 bg-teal-50 hover:bg-teal-100'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AlphaPro Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Your comprehensive financial management suite
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            MVP-Pro v1.0
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${quickStats.portfolioValue.toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">📈</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${quickStats.monthlyBudget.toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${quickStats.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${quickStats.cashFlow.toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">💸</span>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card 
              key={feature.id}
              className={`p-6 cursor-pointer transition-all duration-200 ${getFeatureColor(feature.color)}`}
            >
              {feature.path ? (
                <Link to={feature.path} className="block">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Link>
              ) : (
                <div className="block">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <Card className="p-6">
          {quickStats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {quickStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.split('.')[0]}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/pro/optimizer">Add Stock</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pro/budget">Set Budget</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pro/reports">View Reports</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/feedback">Send Feedback</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main AlphaPro component with routing
export default function AlphaPro() {
  return (
    <Routes>
      <Route path="/" element={<AlphaProDashboard />} />
      <Route path="/optimizer" element={<OptimizerPage />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/feedback" element={<FeedbackForm />} />
    </Routes>
  );
} 