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

// Import Pro feature pages
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
  }
];

const AlphaProDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">AlphaPro Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Your comprehensive financial management suite
            </p>
          </div>
          <Badge variant="outline">MVP-Pro v1.0</Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card 
              key={feature.id}
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
            >
              <Link to={feature.path} className="block">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Link>
            </Card>
          ))}
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
    </Routes>
  );
} 