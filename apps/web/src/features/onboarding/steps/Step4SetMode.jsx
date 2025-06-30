/**
 * Step4SetMode.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Fourth onboarding step that allows users to choose
 * their preferred dashboard mode and view preferences.
 * 
 * Procedure:
 * 1. Present different dashboard mode options
 * 2. Explain benefits of each mode
 * 3. Allow user to select preferred mode
 * 4. Store user preference for dashboard initialization
 * 
 * Conclusion: Personalizes the user experience by setting
 * their preferred dashboard view and interaction style.
 */

import React, { useState } from 'react';
import Button from '../../../shared/ui/Button.jsx';
import Card from '../../../shared/ui/Card.jsx';
import { RadioGroup, RadioGroupItem } from '../../../shared/ui/radio-group.jsx';
import Label from '../../../shared/ui/Label.jsx';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Eye,
  Target,
  Zap
} from 'lucide-react';

/**
 * Dashboard mode options
 */
const DASHBOARD_MODES = [
  {
    id: 'overview',
    name: 'Overview Mode',
    description: 'Get a quick snapshot of your financial health',
    icon: Eye,
    features: [
      'Key financial metrics at a glance',
      'Recent transactions summary',
      'Budget progress overview',
      'Quick action buttons'
    ],
    color: 'blue'
  },
  {
    id: 'analytics',
    name: 'Analytics Mode',
    description: 'Deep dive into your spending patterns and trends',
    icon: BarChart3,
    features: [
      'Detailed spending analytics',
      'Trend analysis and forecasting',
      'Category breakdowns',
      'Performance metrics'
    ],
    color: 'green'
  },
  {
    id: 'planning',
    name: 'Planning Mode',
    description: 'Focus on goal setting and financial planning',
    icon: Target,
    features: [
      'Goal tracking and progress',
      'Timeline simulations',
      'Scenario planning',
      'Investment insights'
    ],
    color: 'purple'
  },
  {
    id: 'automation',
    name: 'Automation Mode',
    description: 'Set up rules and automated financial management',
    icon: Zap,
    features: [
      'Rule engine configuration',
      'Automated categorization',
      'Smart notifications',
      'Action automation'
    ],
    color: 'orange'
  }
];

/**
 * Dashboard mode selection step component
 */
const Step4SetMode = ({ onComplete, data, isLoading }) => {
  const [selectedMode, setSelectedMode] = useState(data?.selectedMode || 'overview');
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Complete step
   */
  const handleComplete = () => {
    onComplete({
      selectedMode,
      dashboardPreferences: {
        defaultMode: selectedMode,
        showWelcomeMessage: true,
        enableNotifications: true,
        autoRefresh: true
      }
    });
  };

  const selectedModeConfig = DASHBOARD_MODES.find(mode => mode.id === selectedMode);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Choose Your Dashboard
          </h2>
          
          <p className="text-gray-600">
            Select the dashboard mode that best fits your financial management style. 
            You can always change this later in settings.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <RadioGroup
            value={selectedMode}
            onValueChange={setSelectedMode}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {DASHBOARD_MODES.map((mode) => {
              const IconComponent = mode.icon;
              const isSelected = selectedMode === mode.id;
              
              return (
                <div key={mode.id}>
                  <RadioGroupItem
                    value={mode.id}
                    id={mode.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={mode.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? `border-${mode.color}-500 bg-${mode.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? `bg-${mode.color}-100` : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isSelected ? `text-${mode.color}-600` : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{mode.name}</h3>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {mode.description}
                        </p>
                        
                        <div className="mt-3">
                          <ul className="text-xs text-gray-500 space-y-1">
                            {mode.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Selected Mode Preview */}
        {selectedModeConfig && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedModeConfig.name} Preview
              </h3>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                size="sm"
                variant="outline"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
            
            {showPreview && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="h-20 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-sm text-gray-500">Key Metrics Area</span>
                    </div>
                    <div className="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-sm text-gray-500">Main Content Area</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-24 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-sm text-gray-500">Sidebar/Controls</span>
                    </div>
                    <div className="h-28 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-sm text-gray-500">Additional Features</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode Benefits */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-blue-900 mb-2">
            Why {selectedModeConfig?.name}?
          </h4>
          <p className="text-sm text-blue-700">
            {selectedModeConfig?.description} This mode is perfect for users who want to 
            {selectedMode === 'overview' && ' get a quick understanding of their financial situation at a glance.'}
            {selectedMode === 'analytics' && ' understand their spending patterns and make data-driven decisions.'}
            {selectedMode === 'planning' && ' set and track financial goals with detailed planning tools.'}
            {selectedMode === 'automation' && ' automate their financial management and reduce manual work.'}
          </p>
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex items-center mx-auto"
          >
            Complete Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-2">
            You can change your dashboard mode anytime in settings
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Step4SetMode; 