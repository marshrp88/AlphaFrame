/**
 * Mock Transactions Dataset - AlphaFrame Rule Testing
 * 
 * Purpose: Provide realistic transaction data for testing rule execution
 * and demonstrating financial monitoring functionality.
 * 
 * Procedure:
 * 1. Generate diverse transaction categories
 * 2. Include realistic amounts and timestamps
 * 3. Cover different spending patterns and scenarios
 * 4. Enable testing of all rule types
 * 
 * Conclusion: Comprehensive dataset for functional rule testing.
 */

// Generate transactions for the current month
const generateCurrentMonthTransactions = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const transactions = [];

  // Food & Dining transactions
  const foodTransactions = [
    { amount: 45.67, category: 'food', description: 'Grocery Store', timestamp: new Date(now.getFullYear(), now.getMonth(), 5) },
    { amount: 23.50, category: 'food', description: 'Coffee Shop', timestamp: new Date(now.getFullYear(), now.getMonth(), 7) },
    { amount: 67.89, category: 'food', description: 'Restaurant', timestamp: new Date(now.getFullYear(), now.getMonth(), 10) },
    { amount: 34.20, category: 'food', description: 'Takeout', timestamp: new Date(now.getFullYear(), now.getMonth(), 12) },
    { amount: 89.45, category: 'food', description: 'Grocery Store', timestamp: new Date(now.getFullYear(), now.getMonth(), 15) },
    { amount: 18.75, category: 'food', description: 'Coffee Shop', timestamp: new Date(now.getFullYear(), now.getMonth(), 18) },
    { amount: 56.30, category: 'food', description: 'Restaurant', timestamp: new Date(now.getFullYear(), now.getMonth(), 20) },
    { amount: 42.10, category: 'food', description: 'Takeout', timestamp: new Date(now.getFullYear(), now.getMonth(), 22) },
    { amount: 78.90, category: 'food', description: 'Grocery Store', timestamp: new Date(now.getFullYear(), now.getMonth(), 25) },
    { amount: 29.99, category: 'food', description: 'Coffee Shop', timestamp: new Date(now.getFullYear(), now.getMonth(), 28) }
  ];

  // Bills & Utilities
  const billTransactions = [
    { amount: 125.00, category: 'bills', description: 'Electric Bill', timestamp: new Date(now.getFullYear(), now.getMonth(), 3) },
    { amount: 89.99, category: 'bills', description: 'Internet Bill', timestamp: new Date(now.getFullYear(), now.getMonth(), 5) },
    { amount: 45.00, category: 'bills', description: 'Phone Bill', timestamp: new Date(now.getFullYear(), now.getMonth(), 8) },
    { amount: 15.99, category: 'subscriptions', description: 'Netflix', timestamp: new Date(now.getFullYear(), now.getMonth(), 10) },
    { amount: 9.99, category: 'subscriptions', description: 'Spotify', timestamp: new Date(now.getFullYear(), now.getMonth(), 12) },
    { amount: 12.99, category: 'subscriptions', description: 'Hulu', timestamp: new Date(now.getFullYear(), now.getMonth(), 15) }
  ];

  // Transportation
  const transportTransactions = [
    { amount: 45.00, category: 'transportation', description: 'Gas Station', timestamp: new Date(now.getFullYear(), now.getMonth(), 6) },
    { amount: 85.00, category: 'transportation', description: 'Gas Station', timestamp: new Date(now.getFullYear(), now.getMonth(), 16) },
    { amount: 12.50, category: 'transportation', description: 'Uber Ride', timestamp: new Date(now.getFullYear(), now.getMonth(), 14) },
    { amount: 8.75, category: 'transportation', description: 'Bus Fare', timestamp: new Date(now.getFullYear(), now.getMonth(), 19) }
  ];

  // Shopping & Entertainment
  const shoppingTransactions = [
    { amount: 129.99, category: 'shopping', description: 'Amazon Purchase', timestamp: new Date(now.getFullYear(), now.getMonth(), 4) },
    { amount: 67.50, category: 'shopping', description: 'Clothing Store', timestamp: new Date(now.getFullYear(), now.getMonth(), 11) },
    { amount: 45.00, category: 'entertainment', description: 'Movie Theater', timestamp: new Date(now.getFullYear(), now.getMonth(), 13) },
    { amount: 35.00, category: 'entertainment', description: 'Concert Tickets', timestamp: new Date(now.getFullYear(), now.getMonth(), 17) },
    { amount: 89.99, category: 'shopping', description: 'Electronics Store', timestamp: new Date(now.getFullYear(), now.getMonth(), 21) }
  ];

  // Savings & Income
  const savingsTransactions = [
    { amount: -2500.00, category: 'income', description: 'Salary Deposit', timestamp: new Date(now.getFullYear(), now.getMonth(), 1) },
    { amount: 500.00, category: 'savings', description: 'Savings Transfer', timestamp: new Date(now.getFullYear(), now.getMonth(), 2) },
    { amount: 300.00, category: 'savings', description: 'Emergency Fund', timestamp: new Date(now.getFullYear(), now.getMonth(), 9) },
    { amount: 200.00, category: 'savings', description: 'Investment Deposit', timestamp: new Date(now.getFullYear(), now.getMonth(), 16) }
  ];

  // Healthcare
  const healthcareTransactions = [
    { amount: 25.00, category: 'healthcare', description: 'Pharmacy', timestamp: new Date(now.getFullYear(), now.getMonth(), 7) },
    { amount: 150.00, category: 'healthcare', description: 'Doctor Visit', timestamp: new Date(now.getFullYear(), now.getMonth(), 14) }
  ];

  // Combine all transactions
  return [
    ...foodTransactions,
    ...billTransactions,
    ...transportTransactions,
    ...shoppingTransactions,
    ...savingsTransactions,
    ...healthcareTransactions
  ].map((tx, index) => ({
    id: `tx_${index + 1}`,
    ...tx,
    timestamp: tx.timestamp.toISOString()
  }));
};

// Generate transactions for previous month (for comparison)
const generatePreviousMonthTransactions = () => {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const transactions = [];

  // Similar structure but with different amounts for comparison
  const foodTransactions = [
    { amount: 52.30, category: 'food', description: 'Grocery Store', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 3) },
    { amount: 28.75, category: 'food', description: 'Coffee Shop', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 6) },
    { amount: 78.90, category: 'food', description: 'Restaurant', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 9) },
    { amount: 38.45, category: 'food', description: 'Takeout', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 12) },
    { amount: 95.20, category: 'food', description: 'Grocery Store', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 15) },
    { amount: 22.10, category: 'food', description: 'Coffee Shop', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 18) },
    { amount: 62.80, category: 'food', description: 'Restaurant', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 21) },
    { amount: 41.30, category: 'food', description: 'Takeout', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 24) },
    { amount: 82.15, category: 'food', description: 'Grocery Store', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 27) },
    { amount: 31.50, category: 'food', description: 'Coffee Shop', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 30) }
  ];

  const billTransactions = [
    { amount: 118.50, category: 'bills', description: 'Electric Bill', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 2) },
    { amount: 89.99, category: 'bills', description: 'Internet Bill', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 4) },
    { amount: 45.00, category: 'bills', description: 'Phone Bill', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 7) },
    { amount: 15.99, category: 'subscriptions', description: 'Netflix', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 9) },
    { amount: 9.99, category: 'subscriptions', description: 'Spotify', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 11) }
  ];

  const transportTransactions = [
    { amount: 42.00, category: 'transportation', description: 'Gas Station', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 5) },
    { amount: 88.00, category: 'transportation', description: 'Gas Station', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 17) },
    { amount: 15.25, category: 'transportation', description: 'Uber Ride', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 13) },
    { amount: 7.50, category: 'transportation', description: 'Bus Fare', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 20) }
  ];

  const savingsTransactions = [
    { amount: -2500.00, category: 'income', description: 'Salary Deposit', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1) },
    { amount: 450.00, category: 'savings', description: 'Savings Transfer', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 2) },
    { amount: 350.00, category: 'savings', description: 'Emergency Fund', timestamp: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 10) }
  ];

  return [
    ...foodTransactions,
    ...billTransactions,
    ...transportTransactions,
    ...savingsTransactions
  ].map((tx, index) => ({
    id: `tx_prev_${index + 1}`,
    ...tx,
    timestamp: tx.timestamp.toISOString()
  }));
};

// Get all transactions (current + previous month)
export const getMockTransactions = () => {
  return [
    ...generateCurrentMonthTransactions(),
    ...generatePreviousMonthTransactions()
  ];
};

// Get transactions for a specific timeframe
export const getTransactionsForTimeframe = (timeframe = 'monthly') => {
  const allTransactions = getMockTransactions();
  const now = new Date();
  
  let startDate;
  switch (timeframe) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  return allTransactions.filter(tx => 
    new Date(tx.timestamp) >= startDate && new Date(tx.timestamp) <= now
  );
};

// Get spending summary by category
export const getSpendingSummary = (transactions = getMockTransactions()) => {
  const summary = {};
  
  transactions.forEach(tx => {
    if (tx.amount > 0) { // Only count spending, not income
      const category = tx.category;
      if (!summary[category]) {
        summary[category] = { total: 0, count: 0, transactions: [] };
      }
      summary[category].total += tx.amount;
      summary[category].count += 1;
      summary[category].transactions.push(tx);
    }
  });
  
  return summary;
};

// Get top spending categories
export const getTopSpendingCategories = (limit = 5) => {
  const summary = getSpendingSummary();
  return Object.entries(summary)
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export default {
  getMockTransactions,
  getTransactionsForTimeframe,
  getSpendingSummary,
  getTopSpendingCategories
}; 