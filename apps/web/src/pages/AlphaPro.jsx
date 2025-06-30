import React from 'react';
import Card from '@/shared/ui/Card.jsx';
import Badge from '@/shared/ui/badge.jsx';
import DashboardModeManager from '../features/pro/components/DashboardModeManager.jsx';
import FeedbackModule from '../features/pro/components/FeedbackModule.jsx';

const AlphaProDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug span for test diagnostics */}
      <span data-testid="page-mounted" style={{ display: 'none' }}>AlphaPro Dashboard Mounted</span>
      
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
      <div className="mb-8">
        <DashboardModeManager />
      </div>
      <div className="mt-8">
        <FeedbackModule />
      </div>
    </div>
  );
};

export default function AlphaPro() {
  return <AlphaProDashboard />;
} 