/**
 * ProPlannerPage Component
 * 
 * PURPOSE: Provides a comprehensive financial planning interface for Pro users
 * with access to advanced tax optimization, debt management, and retirement
 * planning tools through an intuitive tabbed interface.
 * 
 * PROCEDURE: 
 * 1. Displays a professional header with value proposition
 * 2. Provides tab navigation between different planning tools
 * 3. Renders appropriate simulator components based on active tab
 * 4. Maintains state for active tab and user preferences
 * 
 * CONCLUSION: Pro users can access all advanced planning features in one
 * cohesive interface with professional design and intuitive navigation.
 */

import React, { useState } from 'react';
import TaxSimulator from './TaxSimulator';
import DebtSimulator from './DebtSimulator';
import RetirementSimulator from './RetirementSimulator';
import './ProPlannerPage.css';

const TABS = [
  { id: 'tax', label: 'Tax Optimization' },
  { id: 'debt', label: 'Debt Management' },
  { id: 'retirement', label: 'Retirement Planning' }
];

export default function ProPlannerPage() {
  const [activeTab, setActiveTab] = useState('tax');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="pro-planner-page">
      <div className="pro-planner-header">
        <h1>AlphaFrame Pro Planner</h1>
        <p>Advanced financial intelligence and optimization tools for serious wealth building</p>
      </div>

      <div className="tab-navigation">
        {TABS.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'tax' && <TaxSimulator />}
        {activeTab === 'debt' && <DebtSimulator />}
        {activeTab === 'retirement' && <RetirementSimulator />}
      </div>
    </div>
  );
} 