/**
 * RulesPage.jsx - PHASE 2 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_3]:
 * This module is currently using localStorage-based data persistence.
 * Will be upgraded to Firebase Firestore in Phase 3 for production scalability.
 * 
 * Purpose: Provides rules management interface with real data persistence,
 * rule creation, editing, and execution for the MVEP rebuild.
 * 
 * Current Status: Functional rules management with localStorage persistence
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../core/store/authStore.js';
import { useDataStore } from '../core/store/dataStore.js';
import StyledButton from '../components/ui/StyledButton.jsx';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import RuleCreationModal from '../components/ui/RuleCreationModal.jsx';
import RuleStatusCard from '../components/ui/RuleStatusCard.jsx';

const RulesPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    rules, 
    isLoading, 
    error, 
    createRule, 
    updateRule, 
    deleteRule,
    getActiveRules,
    initialize 
  } = useDataStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const isDemo = typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true';

  // Initialize dataStore and CTO-Level Diagnostic Logging
  useEffect(() => {
    console.log('🔍 [RulesPage] Component mounted at:', new Date().toISOString());
    console.log('🔍 [RulesPage] Browser:', navigator.userAgent);
    console.log('🔍 [RulesPage] Is demo mode:', isDemo);
    console.log('🔍 [RulesPage] Is authenticated:', isAuthenticated);
    console.log('🔍 [RulesPage] User:', user);
    
    // Initialize dataStore
    const initDataStore = async () => {
      try {
        console.log('🔍 [RulesPage] Starting dataStore initialization...');
        
        // Add a small delay to ensure localStorage is available after page refresh
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await initialize(user?.id);
        console.log('🔍 [RulesPage] DataStore initialized successfully');
        
        // Check what was loaded
        const { rules, transactions, triggeredRules } = useDataStore.getState();
        console.log('🔍 [RulesPage] DataStore state after init:', {
          rulesCount: rules.length,
          transactionsCount: transactions.length,
          triggeredRulesCount: triggeredRules.length
        });
      } catch (error) {
        console.error('🔍 [RulesPage] Failed to initialize DataStore:', error);
      }
    };
    
    initDataStore();
    
    // Performance timing
    const mountTime = performance.now();
    console.log('🔍 [RulesPage] Mount performance time:', mountTime);
    
    // Check if button container is ready
    setTimeout(() => {
      const buttonContainer = document.querySelector('[data-testid="create-rule-btn"]');
      if (buttonContainer) {
        console.log('🔍 [RulesPage] Button found in DOM after mount');
        const styles = window.getComputedStyle(buttonContainer);
        console.log('🔍 [RulesPage] Button computed styles:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          position: styles.position,
          zIndex: styles.zIndex,
          offsetParent: buttonContainer.offsetParent !== null
        });
      } else {
        console.log('🔍 [RulesPage] Button NOT found in DOM after mount');
      }
    }, 100);
  }, [initialize, user?.id]);

  // Log button render state
  useEffect(() => {
    console.log('🔍 [RulesPage] Button render state - showCreateModal:', showCreateModal);
    console.log('🔍 [RulesPage] Button render state - isDemo:', isDemo);
    console.log('🔍 [RulesPage] Button render state - isAuthenticated:', isAuthenticated);
  }, [showCreateModal, isDemo, isAuthenticated]);

  // Filter rules based on current filter
  const filteredRules = React.useMemo(() => {
    if (filter === 'active') {
      return getActiveRules();
    } else if (filter === 'inactive') {
      return rules.filter(rule => rule.isActive === false);
    }
    return rules;
  }, [rules, filter, getActiveRules]);

  const handleCreateRule = async (ruleData) => {
    try {
      const newRule = {
        ...ruleData,
        userId: user?.id || 'demo-user',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      await createRule(newRule);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  const handleUpdateRule = async (ruleId, updates) => {
    try {
      await updateRule(ruleId, updates);
      setSelectedRule(null);
    } catch (error) {
      console.error('Failed to update rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRule(ruleId);
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    }
  };

  const handleToggleRule = async (ruleId, isActive) => {
    try {
      await updateRule(ruleId, { isActive: !isActive });
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  if (!isAuthenticated && !isDemo) {
    return (
      <div className="rules-page">
        <div className="container mx-auto px-4 py-8">
          <CompositeCard variant="elevated" className="auth-required-card">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-4">
                Please log in to access your rules and automation settings.
              </p>
              <StyledButton variant="default" onClick={() => window.location.href = '/'}>
                Go to Login
              </StyledButton>
            </div>
          </CompositeCard>
        </div>
      </div>
    );
  }

  return (
    <div className="rules-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rules & Automation
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create and manage automated rules for your financial workflows
              </p>
            </div>
            <StyledButton 
              variant="default" 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
              data-testid="create-rule-btn"
              style={{ 
                display: 'block', 
                visibility: 'visible', 
                zIndex: 10,
                position: 'relative'
              }}
            >
              <span>➕</span>
              <span>Create Rule</span>
            </StyledButton>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6">
            <StyledButton
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Rules ({rules.length})
            </StyledButton>
            <StyledButton
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active ({getActiveRules().length})
            </StyledButton>
            <StyledButton
              variant={filter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('inactive')}
            >
              Inactive ({rules.filter(r => r.isActive === false).length})
            </StyledButton>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <CompositeCard variant="elevated" className="loading-card">
            <div className="text-center py-8">
              <div className="loader-spinner mb-4"></div>
              <p>Loading your rules...</p>
            </div>
          </CompositeCard>
        )}

        {/* Error State */}
        {error && (
          <CompositeCard variant="elevated" className="error-card">
            <div className="text-center py-8">
              <h3 className="text-red-600 font-semibold mb-2">Error Loading Rules</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <StyledButton variant="outline" onClick={() => window.location.reload()}>
                Retry
              </StyledButton>
            </div>
          </CompositeCard>
        )}

        {/* Rules Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRules.length === 0 ? (
              <div className="col-span-full">
                <CompositeCard variant="elevated" className="empty-state-card">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold mb-2">No Rules Yet</h3>
                    <p className="text-gray-600 mb-6">
                      {filter === 'all' 
                        ? "Create your first rule to start automating your financial workflows."
                        : filter === 'active'
                        ? "No active rules found. Create a rule to get started."
                        : "No inactive rules found."
                      }
                    </p>
                    {filter === 'all' && (
                      <StyledButton 
                        variant="default" 
                        onClick={() => setShowCreateModal(true)}
                      >
                        Create Your First Rule
                      </StyledButton>
                    )}
                  </div>
                </CompositeCard>
              </div>
            ) : (
              filteredRules.map((rule) => (
                <RuleStatusCard
                  key={rule.id}
                  rule={rule}
                  onEdit={() => setSelectedRule(rule)}
                  onDelete={() => handleDeleteRule(rule.id)}
                  onToggle={() => handleToggleRule(rule.id, rule.isActive)}
                />
              ))
            )}
          </div>
        )}

        {/* Create Rule Modal */}
        {showCreateModal && (
          <RuleCreationModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateRule}
            user={user}
          />
        )}

        {/* Edit Rule Modal */}
        {selectedRule && (
          <RuleCreationModal
            isOpen={!!selectedRule}
            onClose={() => setSelectedRule(null)}
            onSubmit={(updates) => handleUpdateRule(selectedRule.id, updates)}
            user={user}
            rule={selectedRule}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

export default RulesPage;
