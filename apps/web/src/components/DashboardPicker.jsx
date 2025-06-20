import React, { useState } from 'react';
import { Card } from '../shared/ui/Card.jsx';
import { Button } from '../shared/ui/Button.jsx';
import { Badge } from '../shared/ui/badge.jsx';
import { Check } from 'lucide-react';

const DASHBOARD_MODES = {
  PLANNER: {
    id: 'PLANNER',
    name: 'Planner',
    description: 'Comprehensive view for detailed financial planning',
    icon: '📊',
    color: 'blue',
    features: [
      { name: 'Budget Tracking', description: 'Detailed budget monitoring' },
      { name: 'Cash Flow Analysis', description: 'Income and expense visualization' },
      { name: 'Goal Progress', description: 'Track progress toward financial goals' },
    ],
    bestFor: 'Users who want comprehensive financial oversight.'
  },
  INVESTOR: {
    id: 'INVESTOR',
    name: 'Investor',
    description: 'Portfolio-focused view for investment decisions',
    icon: '📈',
    color: 'green',
    features: [
      { name: 'Portfolio Analysis', description: 'Asset allocation and performance' },
      { name: 'Allocation Drift', description: 'Monitor rebalancing needs' },
      { name: 'Performance Metrics', description: 'Returns, volatility, and risk' },
    ],
    bestFor: 'Active investors and portfolio managers.'
  },
  MINIMALIST: {
    id: 'MINIMALIST',
    name: 'Minimalist',
    description: 'Clean, essential view for a quick overview',
    icon: '🎯',
    color: 'purple',
    features: [
      { name: 'Key Metrics', description: 'Essential financial indicators' },
      { name: 'Recent Activity', description: 'Latest transactions and updates' },
      { name: 'Quick Actions', description: 'Fast access to common tasks' },
    ],
    bestFor: 'Users who prefer simplicity and quick insights.'
  }
};

const DashboardPicker = ({ selectedMode, onModeChange, className = '' }) => {
  const [previewMode, setPreviewMode] = useState(null);

  const handleModeSelect = (modeId) => {
    onModeChange(modeId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(DASHBOARD_MODES).map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <Card
              key={mode.id}
              className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mode.name}</h3>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
              <div className="flex flex-wrap gap-1">
                {mode.features.map((feature) => (
                  <Badge key={feature.name} variant="outline" className="text-xs">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPicker;
