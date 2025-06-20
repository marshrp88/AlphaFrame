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

import React from 'react';
import { Card } from "@/shared/ui/Card.jsx";
import { Badge } from "@/shared/ui/badge.jsx";
import DashboardModeManager from "../features/pro/components/DashboardModeManager.jsx"; // Corrected import path

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
      
      {/* Dashboard Mode Manager is now the core of this page */}
      <div className="mb-8">
        <DashboardModeManager />
      </div>

      {/* The incorrect feature grid has been removed. Navigation is handled by the manager. */}
    </div>
  );
};

// Main AlphaPro component simplified
export default function AlphaPro() {
  return <AlphaProDashboard />;
} 