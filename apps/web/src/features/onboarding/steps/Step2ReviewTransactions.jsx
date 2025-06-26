/**
 * Step2ReviewTransactions.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Second onboarding step that allows users to review
 * and categorize imported transactions from their bank.
 * 
 * Procedure:
 * 1. Fetch recent transactions from Plaid
 * 2. Display transactions in reviewable format
 * 3. Allow categorization and editing
 * 4. Store categorized transactions for budget setup
 * 
 * Conclusion: Provides users with control over their
 * transaction data and categorization.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button.jsx';
import { Card } from '../../../shared/ui/Card.jsx';
import { Input } from '../../../shared/ui/Input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/Select.jsx';
import { FileText, DollarSign, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { getTransactions } from '../../../lib/services/syncEngine.js';

/**
 * Transaction categories for initial setup
 */
const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Insurance',
  'Investments',
  'Income',
  'Other'
];

/**
 * Transaction review step component
 */
const Step2ReviewTransactions = ({ onComplete, onSkip, isLoading }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  /**
   * Load transactions from Plaid
   */
  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const connectionData = JSON.parse(localStorage.getItem('plaid_connection') || '{}');
      
      if (!connectionData.accessToken) {
        throw new Error('No bank connection found');
      }

      // Get transactions from the last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const transactionsData = await getTransactions(
        connectionData.accessToken,
        startDate,
        endDate
      );

      // Process and categorize transactions
      const processedTransactions = transactionsData.map(transaction => ({
        ...transaction,
        category: transaction.category?.[0] || 'Other',
        amount: Math.abs(transaction.amount),
        isExpense: transaction.amount < 0
      }));

      setTransactions(processedTransactions);
      
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update transaction category
   */
  const updateTransactionCategory = (transactionId, category) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, category } 
          : t
      )
    );
  };

  /**
   * Toggle transaction selection
   */
  const toggleTransactionSelection = (transactionId) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  /**
   * Select all transactions
   */
  const selectAllTransactions = () => {
    setSelectedTransactions(new Set(transactions.map(t => t.id)));
  };

  /**
   * Deselect all transactions
   */
  const deselectAllTransactions = () => {
    setSelectedTransactions(new Set());
  };

  /**
   * Complete step
   */
  const handleComplete = () => {
    const categorizedTransactions = transactions.filter(t => 
      selectedTransactions.has(t.id)
    );

    onComplete({
      transactions: categorizedTransactions,
      totalTransactions: transactions.length,
      selectedCount: selectedTransactions.size
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Your Transactions
          </h2>
          <p className="text-gray-600">
            We&apos;re securely fetching your recent transactions...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Transactions
          </h2>
          
          <p className="text-gray-600 mb-4">
            {error}
          </p>

          <div className="space-x-3">
            <Button
              onClick={loadTransactions}
              variant="outline"
            >
              Try Again
            </Button>
            
            <Button
              onClick={onSkip}
              variant="outline"
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Review Your Transactions
          </h2>
          
          <p className="text-gray-600">
            We found {transactions.length} transactions from the last 30 days. 
            Select the transactions you&apos;d like to include in your budget.
          </p>
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
            <div className="text-sm text-gray-500">Total Transactions</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${transactions.reduce((sum, t) => sum + (t.isExpense ? 0 : t.amount), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Income</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              ${transactions.reduce((sum, t) => sum + (t.isExpense ? t.amount : 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Expenses</div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            {selectedTransactions.size} of {transactions.length} selected
          </div>
          <div className="space-x-2">
            <Button
              onClick={selectAllTransactions}
              size="sm"
              variant="outline"
            >
              Select All
            </Button>
            <Button
              onClick={deselectAllTransactions}
              size="sm"
              variant="outline"
            >
              Deselect All
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-4 border rounded-lg transition-colors ${
                selectedTransactions.has(transaction.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.has(transaction.id)}
                    onChange={() => toggleTransactionSelection(transaction.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {transaction.merchant_name || transaction.name}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        transaction.isExpense 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.isExpense ? 'Expense' : 'Income'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <Select
                    value={transaction.category}
                    onValueChange={(category) => updateTransactionCategory(transaction.id, category)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleComplete}
            disabled={selectedTransactions.size === 0 || isLoading}
            className="flex items-center mx-auto"
          >
            Continue with Selected Transactions
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Step2ReviewTransactions; 