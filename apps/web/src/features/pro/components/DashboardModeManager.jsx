import React, { useState, useEffect } from 'react';
import { useDashboardModeStore } from '@/core/store/dashboardModeStore.js';
import DashboardPicker from '@/components/DashboardPicker.jsx';
import Card from '@/shared/ui/Card.jsx';
import Button from '@/shared/ui/Button.jsx';
import Badge from '@/shared/ui/badge.jsx';
import executionLogService from '@/core/services/ExecutionLogService.js';

// Dashboard mode configurations (copied from DashboardPicker.jsx for consistency)
const MODE_CONFIGS = {
  PLANNER: {
    id: 'PLANNER',
    name: 'Planner',
    description: 'Comprehensive view for detailed financial planning',
    icon: '📊',
    color: 'blue',
    features: [
      'Budget Tracking',
      'Cash Flow Analysis',
      'Goal Progress',
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
      'Portfolio Analysis',
      'Allocation Drift',
      'Performance Metrics',
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
      'Key Metrics',
      'Recent Activity',
      'Quick Actions',
    ],
    bestFor: 'Users who prefer simplicity and quick insights.'
  }
};

const DashboardModeManager = ({ 
  showPicker = true, 
  showStatus = true, 
  onModeChange,
  className = '' 
}) => {
  const {
    currentMode,
    switchMode,
    getCurrentModeConfig,
    getAvailableModes,
    getModeHistory,
    isModeSwitchAllowed,
    hasRequiredServices
  } = useDashboardModeStore();

  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const currentConfig = getCurrentModeConfig();

  const handleModeSwitch = async (newMode) => {
    if (isSwitching) return;
    setIsSwitching(true);
    setSwitchError(null);
    try {
      if (!isModeSwitchAllowed(newMode)) {
        throw new Error(`Mode switch to ${newMode} is not allowed`);
      }
      if (!hasRequiredServices()) {
        throw new Error('Required services are not available');
      }
      await switchMode(newMode);
      await executionLogService.log('dashboard.mode.manager.switched', { newMode, timestamp: new Date().toISOString() });
      if (onModeChange) {
        onModeChange(newMode);
      }
    } catch (error) {
      setSwitchError(error.message);
      await executionLogService.logError('dashboard.mode.manager.switch.failed', error, { attemptedMode: newMode, currentMode });
    } finally {
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('dashboardMode', currentMode);
  }, [currentMode]);

  return (
    <div className={`dashboard-mode-manager ${className}`}>
      {showStatus && currentConfig && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentConfig.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{currentConfig.name} Mode</h3>
                <p className="text-sm text-gray-600">{currentConfig.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">Active</Badge>
              {isSwitching && <Badge variant="outline" className="text-xs">Switching...</Badge>}
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Features:</h4>
            <div className="flex flex-wrap gap-2">
              {currentConfig.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
              ))}
            </div>
          </div>
          {switchError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{switchError}</div>
          )}
        </Card>
      )}
      {showPicker && (
        <DashboardPicker selectedMode={currentMode} onModeChange={handleModeSwitch} className="mb-4" />
      )}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Mode History</h3>
          <Button size="sm" variant="outline" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
        </div>
        {showHistory && (
          <div className="space-y-2">
            {getModeHistory(5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{MODE_CONFIGS[entry.fromMode]?.name} → {MODE_CONFIGS[entry.toMode]?.name}</span>
                <span className="text-gray-500 font-mono text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-3">Quick Mode Switcher</h3>
        <div className="flex flex-wrap gap-2">
          {getAvailableModes().map((mode) => {
            const config = MODE_CONFIGS[mode];
            const isActive = mode === currentMode;
            return (
              <Button key={mode} size="sm" variant={isActive ? 'default' : 'outline'} onClick={() => handleModeSwitch(mode)} disabled={isSwitching || isActive} className="flex items-center space-x-1">
                <span>{config.icon}</span>
                <span>{config.name}</span>
                {isActive && <Badge variant="secondary" className="text-xs">Active</Badge>}
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DashboardModeManager; 