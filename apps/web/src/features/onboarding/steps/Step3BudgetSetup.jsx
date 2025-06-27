/**
 * Step3BudgetSetup.jsx - AlphaFrame VX.1 Finalization
 * 
 * Purpose: Third onboarding step that helps users create
 * their initial budget categories and spending limits.
 * 
 * Procedure:
 * 1. Analyze selected transactions for spending patterns
 * 2. Suggest budget categories and limits
 * 3. Allow customization of budget settings
 * 4. Store budget configuration for dashboard
 * 
 * Conclusion: Establishes user's financial planning
 * foundation with personalized budget categories.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button.jsx';
import { Card } from '../../../shared/ui/Card.jsx';
import { Input } from '../../../shared/ui/Input.jsx';
import Label from '../../../shared/ui/Label.jsx';
import { PieChart, DollarSign, TrendingUp, ArrowRight, Plus, Trash2 } from 'lucide-react';

/**
 * Budget setup step component
 */
const Step3BudgetSetup = ({ onComplete, data, isLoading }) => {
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [newCategory, setNewCategory] = useState({ name: '', limit: '' });

  // Initialize budget from transaction data
  useEffect(() => {
    if (data?.transactions) {
      initializeBudgetFromTransactions(data.transactions);
    }
  }, [data]);

  /**
   * Initialize budget categories from transactions
   */
  const initializeBudgetFromTransactions = (transactions) => {
    // Calculate total income
    const income = transactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
    
    setTotalIncome(income);

    // Group transactions by category
    const categoryTotals = transactions
      .filter(t => t.isExpense)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Create budget categories with suggested limits
    const categories = Object.entries(categoryTotals).map(([category, spent]) => ({
      id: Date.now() + Math.random(),
      name: category,
      limit: Math.round(spent * 1.2), // 20% buffer
      spent: spent,
      color: getCategoryColor(category)
    }));

    setBudgetCategories(categories);
    setTotalBudget(categories.reduce((sum, cat) => sum + cat.limit, 0));
  };

  /**
   * Get color for category
   */
  const getCategoryColor = (category) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[category.length % colors.length];
  };

  /**
   * Add new budget category
   */
  const addBudgetCategory = () => {
    if (newCategory.name && newCategory.limit) {
      const category = {
        id: Date.now() + Math.random(),
        name: newCategory.name,
        limit: parseFloat(newCategory.limit),
        spent: 0,
        color: getCategoryColor(newCategory.name)
      };

      setBudgetCategories(prev => [...prev, category]);
      setTotalBudget(prev => prev + category.limit);
      setNewCategory({ name: '', limit: '' });
    }
  };

  /**
   * Remove budget category
   */
  const removeBudgetCategory = (categoryId) => {
    const category = budgetCategories.find(c => c.id === categoryId);
    if (category) {
      setBudgetCategories(prev => prev.filter(c => c.id !== categoryId));
      setTotalBudget(prev => prev - category.limit);
    }
  };

  /**
   * Update budget category limit
   */
  const updateCategoryLimit = (categoryId, newLimit) => {
    setBudgetCategories(prev => 
      prev.map(cat => {
        if (cat.id === categoryId) {
          const oldLimit = cat.limit;
          const difference = newLimit - oldLimit;
          setTotalBudget(prev => prev + difference);
          return { ...cat, limit: newLimit };
        }
        return cat;
      })
    );
  };

  /**
   * Complete step
   */
  const handleComplete = () => {
    onComplete({
      budgetCategories,
      totalIncome,
      totalBudget,
      monthlyIncome: totalIncome,
      monthlyBudget: totalBudget
    });
  };

  const remainingBudget = totalIncome - totalBudget;
  const isOverBudget = remainingBudget < 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Set Up Your Budget
          </h2>
          
          <p className="text-gray-600">
            We&apos;ve analyzed your spending patterns and created suggested budget categories. 
            Customize them to match your financial goals.
          </p>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Monthly Income</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${totalBudget.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Budget</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            isOverBudget ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className={`text-2xl font-bold ${
              isOverBudget ? 'text-red-600' : 'text-gray-600'
            }`}>
              ${Math.abs(remainingBudget).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900">Budget Categories</h3>
          
          {budgetCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">{category.name}</Label>
                  <div className="text-sm text-gray-500">
                    ${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((category.spent / category.limit) * 100, 100)}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={category.limit}
                  onChange={(e) => updateCategoryLimit(category.id, parseFloat(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                  step="0.01"
                />
                <Button
                  onClick={() => removeBudgetCategory(category.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Category */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Entertainment"
              />
            </div>
            
            <div className="flex-1">
              <Label htmlFor="category-limit">Monthly Limit</Label>
              <Input
                id="category-limit"
                type="number"
                value={newCategory.limit}
                onChange={(e) => setNewCategory(prev => ({ ...prev, limit: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <Button
              onClick={addBudgetCategory}
              disabled={!newCategory.name || !newCategory.limit}
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Budget Warning */}
        {isOverBudget && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h4 className="font-medium text-red-800">Budget Exceeds Income</h4>
                <p className="text-sm text-red-600">
                  Your total budget is ${Math.abs(remainingBudget).toFixed(2)} more than your income. 
                  Consider adjusting your budget categories.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={handleComplete}
            disabled={budgetCategories.length === 0 || isLoading}
            className="flex items-center mx-auto"
          >
            Continue with Budget Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Step3BudgetSetup; 