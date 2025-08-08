/**
 * Demo Seed Data
 * Purpose (10th grade): Quick starter data so the app can run even if real
 * services are offline. Safe to use for demos and tests.
 */

export const demoAccounts = [
  { id: 'acc_demo_1', name: 'Demo Checking', type: 'depository', subtype: 'checking', balance: 5200 },
  { id: 'acc_demo_2', name: 'Demo Savings', type: 'depository', subtype: 'savings', balance: 15000 },
];

export const demoTransactions = [
  { id: 't1', date: '2025-01-10', amount: -42.5, merchant: 'Coffee Co', category: 'Food & Drink' },
  { id: 't2', date: '2025-01-11', amount: -120.0, merchant: 'Grocer', category: 'Groceries' },
  { id: 't3', date: '2025-01-12', amount: 2500.0, merchant: 'Employer', category: 'Income' },
];

export const demoInsights = [
  { id: 'i1', title: 'You are on track', detail: 'Spending is under your monthly target.' },
  { id: 'i2', title: 'Build emergency fund', detail: 'Set aside 3–6 months of expenses.' },
];

export default { demoAccounts, demoTransactions, demoInsights };


