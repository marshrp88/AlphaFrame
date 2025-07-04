/**
 * DataStore.js - PHASE 4 IMPLEMENTATION
 * 
 * TODO [MVEP_PHASE_5]:
 * This module now uses Firestore real-time listeners for live sync.
 * Will be enhanced with collaboration and notifications in Phase 5.
 * 
 * Purpose: Provides Zustand store for data state management with real-time sync,
 * CRUD operations, and data synchronization for the MVEP rebuild.
 * 
 * Current Status: Real-time sync with Firestore listeners
 */

import { create } from 'zustand';
import { 
  initializeDataService,
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments,
  getUserPreferences,
  updateUserPreferences,
  exportUserData,
  importUserData,
  subscribeToCollection
} from '../../lib/services/DataService.js';

/**
 * Data store state and actions
 */
export const useDataStore = create((set, get) => ({
  // State
  rules: [],
  transactions: [],
  budgets: [],
  insights: [],
  userPreferences: null,
  isLoading: false,
  error: null,
  lastSync: null,
  listeners: {}, // Store unsubscribe functions
  triggeredRules: [], // NEW: List of triggered rule events
  latestTriggeredRule: null, // NEW: Most recent triggered rule event

  // Actions
  initialize: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if we're in demo mode
      const isDemo = typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true';
      
      if (isDemo) {
        // Demo mode: Load from localStorage
        console.log('🔍 [DataStore] Initializing in demo mode with localStorage');
        
        const rules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
        const transactions = JSON.parse(localStorage.getItem('alphaframe_user_transactions') || '[]');
        const budgets = JSON.parse(localStorage.getItem('alphaframe_user_budgets') || '[]');
        const insights = JSON.parse(localStorage.getItem('alphaframe_user_insights') || '[]');
        const triggeredRules = JSON.parse(localStorage.getItem('alphaframe_triggered_rules') || '[]');
        
        set({
          rules,
          transactions,
          budgets,
          insights,
          userPreferences: null,
          lastSync: new Date().toISOString(),
          isLoading: false,
          listeners: {},
          triggeredRules,
          latestTriggeredRule: triggeredRules.length > 0 ? triggeredRules[triggeredRules.length - 1] : null
        });
        
        console.log(`🔍 [DataStore] Demo mode loaded: ${rules.length} rules, ${transactions.length} transactions, ${triggeredRules.length} triggered rules`);
        
        // Evaluate rules after loading
        if (rules.length > 0 && transactions.length > 0) {
          setTimeout(() => {
            get().evaluateAndTriggerRules();
          }, 100);
        }
        
        return;
      }
      
      // Production mode: Initialize data service
      await initializeDataService();
      
      // Unsubscribe previous listeners
      const { listeners } = get();
      Object.values(listeners).forEach(unsub => { if (typeof unsub === 'function') unsub(); });
      const newListeners = {};

      if (userId) {
        // Set up real-time listeners for all collections
        newListeners.rules = subscribeToCollection('rules', { userId }, (docs) => set({ rules: docs }));
        newListeners.transactions = subscribeToCollection('transactions', { userId }, (docs) => set({ transactions: docs }));
        newListeners.budgets = subscribeToCollection('budgets', { userId }, (docs) => set({ budgets: docs }));
        newListeners.insights = subscribeToCollection('insights', { userId }, (docs) => set({ insights: docs }));

        // Load user preferences (not real-time, but can be polled)
        const preferences = await getUserPreferences(userId);
        set({
          userPreferences: preferences,
          lastSync: new Date().toISOString(),
          isLoading: false,
          listeners: newListeners
        });
      } else {
        set({ isLoading: false, listeners: {} });
      }
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  // NEW: Evaluate all rules against all transactions and update triggeredRules
  evaluateAndTriggerRules: async () => {
    const { rules, transactions } = get();
    console.log(`🔍 [DataStore] Evaluating ${rules.length} rules against ${transactions.length} transactions`);
    
    try {
      const ruleEngine = (await import('../../lib/services/ruleEngine.js')).default;
      let triggered = [];
      
      for (const transaction of transactions) {
        for (const rule of rules) {
          try {
            let ruleForEngine;
            if (rule.type === 'merchant') {
              ruleForEngine = {
                id: rule.id,
                name: rule.name,
                description: rule.description,
                logicOperator: 'AND',
                conditions: [{
                  field: 'merchant_name',
                  operator: 'contains',
                  value: rule.merchant
                }],
                action: {
                  type: 'notification',
                  notification: {
                    title: 'Rule Triggered',
                    message: rule.actionValue || 'Merchant rule met',
                    type: 'warning'
                  }
                },
                enabled: rule.isActive
              };
            } else if (rule.type === 'date') {
              ruleForEngine = {
                id: rule.id,
                name: rule.name,
                description: rule.description,
                logicOperator: 'AND',
                conditions: [{
                  field: 'date',
                  operator: rule.dateOperator || 'isToday',
                  value: null
                }],
                action: {
                  type: 'notification',
                  notification: {
                    title: 'Rule Triggered',
                    message: rule.actionValue || 'Date rule met',
                    type: 'warning'
                  }
                },
                enabled: rule.isActive
              };
            } else if (rule.type === 'compound' && Array.isArray(rule.compoundConditions)) {
              ruleForEngine = {
                id: rule.id,
                name: rule.name,
                description: rule.description,
                logicOperator: rule.compoundConditions[1]?.logical || 'AND',
                conditions: rule.compoundConditions.map(cond => ({
                  field: cond.field,
                  operator: cond.operator,
                  value: cond.value,
                  logicalOperator: cond.logical
                })),
                action: {
                  type: 'notification',
                  notification: {
                    title: 'Rule Triggered',
                    message: rule.actionValue || 'Compound rule met',
                    type: 'warning'
                  }
                },
                enabled: rule.isActive
              };
            } else {
              // Default: amount/category
              ruleForEngine = {
                id: rule.id,
                name: rule.name,
                description: rule.description,
                logicOperator: 'AND',
                conditions: [{
                  field: rule.type === 'transaction_amount' ? 'amount' : 'category',
                  operator: rule.type === 'transaction_amount' ? '>=' : '===',
                  value: rule.type === 'transaction_amount' ? parseFloat(rule.amount) : rule.category
                }],
                action: {
                  type: 'notification',
                  notification: {
                    title: 'Rule Triggered',
                    message: rule.actionValue || 'Rule condition met',
                    type: 'warning'
                  }
                },
                enabled: rule.isActive
              };
            }
            
            const result = await ruleEngine.evaluateRule(ruleForEngine, transaction);
            
            if (result && result.matched) {
              triggered.push({
                ruleId: rule.id,
                ruleName: rule.name,
                transactionId: transaction.id,
                triggeredAt: new Date().toISOString(),
                details: { ...result }
              });
              
              console.log(`🔍 [DataStore] Rule "${rule.name}" triggered for transaction "${transaction.description}"`);
            }
          } catch (error) {
            console.error(`🔍 [DataStore] Error evaluating rule ${rule.id}:`, error);
          }
        }
      }
      
      set({
        triggeredRules: triggered,
        latestTriggeredRule: triggered.length > 0 ? triggered[triggered.length - 1] : null
      });
      
      // Save triggered rules to localStorage for demo mode
      if (typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true') {
        localStorage.setItem('alphaframe_triggered_rules', JSON.stringify(triggered));
      }
      
      console.log(`🔍 [DataStore] Rule evaluation complete: ${triggered.length} rules triggered`);
    } catch (error) {
      console.error('🔍 [DataStore] Error in evaluateAndTriggerRules:', error);
    }
  },

  // Rules management
  createRule: async (ruleData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Check if we're in demo mode
      const isDemo = typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true';
      console.log('🔍 [DataStore] createRule - isDemo:', isDemo);
      
      if (isDemo) {
        // Demo mode: Save to localStorage
        const newRule = {
          ...ruleData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        const existingRules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
        const updatedRules = [newRule, ...existingRules];
        localStorage.setItem('alphaframe_user_rules', JSON.stringify(updatedRules));
        
        set({
          rules: updatedRules,
          isLoading: false
        });
        
        console.log(`🔍 [DataStore] Demo mode: Created rule "${newRule.name}"`);
        return newRule;
      } else {
        // Production mode: Use data service
        const newRule = await createDocument('rules', ruleData);
        const { rules } = get();
        
        set({
          rules: [newRule, ...rules],
          isLoading: false
        });
        
        // Evaluate rules after creation
        await get().evaluateAndTriggerRules();
        
        return newRule;
      }
    } catch (error) {
      console.error('🔍 [DataStore] createRule error:', error);
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  updateRule: async (ruleId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedRule = await updateDocument('rules', ruleId, updates);
      const { rules } = get();
      
      const updatedRules = rules.map(rule => 
        rule.id === ruleId ? updatedRule : rule
      );
      
      set({
        rules: updatedRules,
        isLoading: false
      });
      
      // Evaluate rules after update
      await get().evaluateAndTriggerRules();
      
      return updatedRule;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  deleteRule: async (ruleId) => {
    set({ isLoading: true, error: null });
    
    try {
      await deleteDocument('rules', ruleId);
      const { rules } = get();
      
      set({
        rules: rules.filter(rule => rule.id !== ruleId),
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Transactions management
  createTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });
    
    try {
      const isDemo = typeof window !== 'undefined' && sessionStorage.getItem('demo_user') === 'true';
      
      if (isDemo) {
        // Demo mode: Save to localStorage
        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        const existingTransactions = JSON.parse(localStorage.getItem('alphaframe_user_transactions') || '[]');
        const updatedTransactions = [newTransaction, ...existingTransactions];
        localStorage.setItem('alphaframe_user_transactions', JSON.stringify(updatedTransactions));
        
        set({
          transactions: updatedTransactions,
          isLoading: false
        });
        
        // Trigger rule evaluation
        await get().evaluateAndTriggerRules();
        
        console.log(`🔍 [DataStore] Demo mode: Created transaction "${newTransaction.description}"`);
        return newTransaction;
      } else {
        // Production mode: Use data service
        const newTransaction = await createDocument('transactions', transactionData);
        const { transactions } = get();
        
        set({
          transactions: [newTransaction, ...transactions],
          isLoading: false
        });
        
        // Evaluate rules after transaction creation
        await get().evaluateAndTriggerRules();
        
        return newTransaction;
      }
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  updateTransaction: async (transactionId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedTransaction = await updateDocument('transactions', transactionId, updates);
      const { transactions } = get();
      
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === transactionId ? updatedTransaction : transaction
      );
      
      set({
        transactions: updatedTransactions,
        isLoading: false
      });
      
      return updatedTransaction;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  deleteTransaction: async (transactionId) => {
    set({ isLoading: true, error: null });
    
    try {
      await deleteDocument('transactions', transactionId);
      const { transactions } = get();
      
      set({
        transactions: transactions.filter(transaction => transaction.id !== transactionId),
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Budgets management
  createBudget: async (budgetData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newBudget = await createDocument('budgets', budgetData);
      const { budgets } = get();
      
      set({
        budgets: [newBudget, ...budgets],
        isLoading: false
      });
      
      return newBudget;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  updateBudget: async (budgetId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedBudget = await updateDocument('budgets', budgetId, updates);
      const { budgets } = get();
      
      const updatedBudgets = budgets.map(budget => 
        budget.id === budgetId ? updatedBudget : budget
      );
      
      set({
        budgets: updatedBudgets,
        isLoading: false
      });
      
      return updatedBudget;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  deleteBudget: async (budgetId) => {
    set({ isLoading: true, error: null });
    
    try {
      await deleteDocument('budgets', budgetId);
      const { budgets } = get();
      
      set({
        budgets: budgets.filter(budget => budget.id !== budgetId),
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Insights management
  createInsight: async (insightData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newInsight = await createDocument('insights', insightData);
      const { insights } = get();
      
      set({
        insights: [newInsight, ...insights],
        isLoading: false
      });
      
      return newInsight;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  updateInsight: async (insightId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedInsight = await updateDocument('insights', insightId, updates);
      const { insights } = get();
      
      const updatedInsights = insights.map(insight => 
        insight.id === insightId ? updatedInsight : insight
      );
      
      set({
        insights: updatedInsights,
        isLoading: false
      });
      
      return updatedInsight;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  deleteInsight: async (insightId) => {
    set({ isLoading: true, error: null });
    
    try {
      await deleteDocument('insights', insightId);
      const { insights } = get();
      
      set({
        insights: insights.filter(insight => insight.id !== insightId),
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // User preferences management
  updateUserPreferences: async (userId, preferences) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedPreferences = await updateUserPreferences(userId, preferences);
      
      set({
        userPreferences: updatedPreferences,
        isLoading: false
      });
      
      return updatedPreferences;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Data export/import
  exportData: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const exportedData = await exportUserData(userId);
      set({ isLoading: false });
      return exportedData;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  importData: async (userId, data) => {
    set({ isLoading: true, error: null });
    
    try {
      await importUserData(userId, data);
      
      // Reload data after import
      const [rules, transactions, budgets, insights, preferences] = await Promise.all([
        getDocuments('rules', { userId }),
        getDocuments('transactions', { userId }),
        getDocuments('budgets', { userId }),
        getDocuments('insights', { userId }),
        getUserPreferences(userId)
      ]);

      set({
        rules,
        transactions,
        budgets,
        insights,
        userPreferences: preferences,
        lastSync: new Date().toISOString(),
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Query methods
  queryRules: async (query) => {
    try {
      return await queryDocuments('rules', query);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  queryTransactions: async (query) => {
    try {
      return await queryDocuments('transactions', query);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  queryBudgets: async (query) => {
    try {
      return await queryDocuments('budgets', query);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Utility methods
  clearError: () => {
    set({ error: null });
  },

  refreshData: async (userId) => {
    if (!userId) return;
    
    set({ isLoading: true });
    
    try {
      const [rules, transactions, budgets, insights, preferences] = await Promise.all([
        getDocuments('rules', { userId }),
        getDocuments('transactions', { userId }),
        getDocuments('budgets', { userId }),
        getDocuments('insights', { userId }),
        getUserPreferences(userId)
      ]);

      set({
        rules,
        transactions,
        budgets,
        insights,
        userPreferences: preferences,
        lastSync: new Date().toISOString(),
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  // Computed values
  getActiveRules: () => {
    const { rules } = get();
    return rules.filter(rule => rule.isActive !== false);
  },

  getTransactionsByCategory: (category) => {
    const { transactions } = get();
    return transactions.filter(transaction => transaction.category === category);
  },

  getTotalSpending: () => {
    const { transactions } = get();
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  },

  getBudgetUtilization: () => {
    const { budgets, transactions } = get();
    const budgetMap = {};
    
    budgets.forEach(budget => {
      budgetMap[budget.category] = budget.amount;
    });
    
    const spendingMap = {};
    transactions.forEach(transaction => {
      spendingMap[transaction.category] = (spendingMap[transaction.category] || 0) + transaction.amount;
    });
    
    return Object.keys(budgetMap).map(category => ({
      category,
      budget: budgetMap[category],
      spent: spendingMap[category] || 0,
      remaining: budgetMap[category] - (spendingMap[category] || 0),
      utilization: ((spendingMap[category] || 0) / budgetMap[category]) * 100
    }));
  }
})); 