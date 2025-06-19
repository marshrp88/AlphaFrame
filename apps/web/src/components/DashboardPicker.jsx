/**
 * DashboardPicker.jsx
 * 
 * Purpose: Component for selecting and customizing dashboard modes
 * with preview capabilities and feature descriptions.
 * 
 * Procedure:
 * 1. Display available dashboard modes with descriptions
 * 2. Show feature previews for each mode
 * 3. Allow mode selection and customization
 * 4. Provide quick mode switching
 * 5. Save user preferences
 * 
 * Conclusion: Provides intuitive dashboard mode selection with
 * clear feature descriptions and customization options.
 */

import React, { useState } from 'react';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Badge } from './ui/badge.jsx';

const DASHBOARD_MODES = {
  PLANNER: {
    id: 'PLANNER',
    name: 'Planner',
    description: 'Comprehensive view for detailed financial planning',
    icon: '📊',
    color: 'blue',
    features: [
      { name: 'Budget Tracking', description: 'Detailed budget monitoring and forecasting' },
      { name: 'Cash Flow Analysis', description: 'Income and expense flow visualization' },
      { name: 'Goal Progress', description: 'Track progress toward financial goals' },
      { name: 'Detailed Insights', description: 'AI-powered financial recommendations' }
    ],
    bestFor: 'Users who want comprehensive financial oversight'
  },
  INVESTOR: {
    id: 'INVESTOR',
    name: 'Investor',
    description: 'Portfolio-focused view for investment decisions',
    icon: '📈',
    color: 'green',
    features: [
      { name: 'Portfolio Analysis', description: 'Asset allocation and performance metrics' },
      { name: 'Allocation Drift', description: 'Monitor portfolio rebalancing needs' },
      { name: 'Performance Metrics', description: 'Returns, volatility, and risk analysis' },
      { name: 'Rebalancing Alerts', description: 'Automated rebalancing recommendations' }
    ],
    bestFor: 'Active investors and portfolio managers'
  },
  MINIMALIST: {
    id: 'MINIMALIST',
    name: 'Minimalist',
    description: 'Clean, essential view for quick overview',
    icon: '🎯',
    color: 'purple',
    features: [
      { name: 'Key Metrics', description: 'Essential financial indicators at a glance' },
      { name: 'Recent Activity', description: 'Latest transactions and updates' },
      { name: 'Quick Actions', description: 'Fast access to common tasks' },
      { name: 'Essential Alerts', description: 'Critical notifications only' }
    ],
    bestFor: 'Users who prefer simplicity and quick insights'
  }
};

const DashboardPicker = ({ selectedMode, onModeChange, className = '' }) => {
  const [previewMode, setPreviewMode] = useState(null);

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
      green: 'border-green-200 bg-green-50 hover:bg-green-100',
      purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getActiveColorClasses = (color) => {
    const colorMap = {
      blue: 'border-blue-500 bg-blue-100',
      green: 'border-green-500 bg-green-100',
      purple: 'border-purple-500 bg-purple-100'
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleModeSelect = (modeId) => {
    onModeChange(modeId);
  };

  const handlePreview = (modeId) => {
    setPreviewMode(previewMode === modeId ? null : modeId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(DASHBOARD_MODES).map((mode) => (
          <Card
            key={mode.id}
            className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
              selectedMode === mode.id
                ? getActiveColorClasses(mode.color)
                : getColorClasses(mode.color)
            }`}
            onClick={() => handleModeSelect(mode.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{mode.name}</h3>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </div>
              </div>
              {selectedMode === mode.id && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {mode.features.slice(0, 2).map((feature) => (
                  <Badge key={feature.name} variant="outline" className="text-xs">
                    {feature.name}
                  </Badge>
                ))}
                {mode.features.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{mode.features.length - 2} more
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(mode.id);
                  }}
                  className="flex-1"
                >
                  {previewMode === mode.id ? 'Hide' : 'Preview'}
                </Button>
                <Button
                  size="sm"
                  variant={selectedMode === mode.id ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModeSelect(mode.id);
                  }}
                  className="flex-1"
                >
                  {selectedMode === mode.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Panel */}
      {previewMode && (
        <Card className="p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{DASHBOARD_MODES[previewMode].icon}</span>
              <h3 className="text-lg font-semibold">
                {DASHBOARD_MODES[previewMode].name} Dashboard Preview
              </h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewMode(null)}
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Features</h4>
              <div className="space-y-3">
                {DASHBOARD_MODES[previewMode].features.map((feature) => (
                  <div key={feature.name} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{feature.name}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Best For</h4>
              <p className="text-sm text-gray-600 mb-4">
                {DASHBOARD_MODES[previewMode].bestFor}
              </p>

              <h4 className="font-medium text-gray-900 mb-3">Sample Layout</h4>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Ready to switch to {DASHBOARD_MODES[previewMode].name} mode?
              </p>
              <Button
                onClick={() => {
                  handleModeSelect(previewMode);
                  setPreviewMode(null);
                }}
                className="ml-4"
              >
                Switch to {DASHBOARD_MODES[previewMode].name}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Mode Switcher */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Quick Mode Switcher</h3>
            <p className="text-sm text-gray-600">
              Quickly switch between dashboard modes
            </p>
          </div>
          <div className="flex space-x-2">
            {Object.values(DASHBOARD_MODES).map((mode) => (
              <Button
                key={mode.id}
                size="sm"
                variant={selectedMode === mode.id ? 'default' : 'outline'}
                onClick={() => handleModeSelect(mode.id)}
                className="flex items-center space-x-1"
              >
                <span>{mode.icon}</span>
                <span className="hidden sm:inline">{mode.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPicker; 