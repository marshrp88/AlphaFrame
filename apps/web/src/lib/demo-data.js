export async function getDemoTransactions() {
  return Promise.resolve({
    net: 1200,
    rules: [{ description: 'Spend > $200 on Groceries' }],
    lastUpdated: new Date().toLocaleString(),
  });
} 