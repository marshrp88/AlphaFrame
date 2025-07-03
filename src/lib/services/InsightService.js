export function getMockInsights() {
  return [
    { id: 1, type: 'spending_alert', title: 'Spending Limit Hit', message: 'You spent $300 on Groceries.' },
    { id: 2, type: 'budget_warning', title: 'Budget Warning', message: 'You are close to your budget limit.' },
    { id: 3, type: 'rule_triggered', title: 'Rule Triggered', message: 'Your rule for Dining Out was triggered.' }
  ];
} 