/**
 * Mock data structures for testing services
 * These mocks provide realistic test data for all major services
 */

// Crypto Service Mocks
export const cryptoMocks = {
  password: 'testPassword123!',
  salt: 'testSalt123',
  key: 'testKey123',
  data: {
    sensitive: 'sensitive data',
    timestamp: new Date().toISOString()
  },
  encryptedData: 'encrypted_test_data_123'
};

// Sync Engine Mocks
export const syncMocks = {
  plaidConfig: {
    clientId: 'test_client_id',
    secret: 'test_secret',
    env: 'sandbox'
  },
  account: {
    id: 'test_account_123',
    name: 'Test Checking',
    type: 'checking',
    balance: 5000.00,
    currency: 'USD'
  },
  transactions: [
    {
      id: 'tx_123',
      amount: 100.00,
      description: 'Test Transaction 1',
      date: new Date().toISOString(),
      category: 'groceries',
      accountId: 'test_account_123'
    },
    {
      id: 'tx_124',
      amount: -50.00,
      description: 'Test Transaction 2',
      date: new Date().toISOString(),
      category: 'utilities',
      accountId: 'test_account_123'
    }
  ],
  webhookEvent: {
    type: 'TRANSACTIONS_UPDATE',
    accountId: 'test_account_123',
    timestamp: new Date().toISOString()
  }
};

// Rule Engine Mocks
export const ruleMocks = {
  alertRule: {
    id: 'rule_123',
    type: 'alert',
    conditions: {
      amount: { greaterThan: 1000 },
      category: { equals: 'large_purchase' }
    },
    actions: {
      type: 'notification',
      message: 'Large purchase detected!'
    },
    enabled: true
  },
  automationRule: {
    id: 'rule_124',
    type: 'automation',
    conditions: {
      category: { equals: 'subscription' },
      amount: { lessThan: 50 }
    },
    actions: {
      type: 'categorize',
      category: 'recurring'
    },
    enabled: true
  },
  transaction: {
    id: 'tx_125',
    amount: 1500.00,
    description: 'Large Purchase',
    date: new Date().toISOString(),
    category: 'large_purchase',
    accountId: 'test_account_123'
  }
};

// Simulation Service Mocks
export const simulationMocks = {
  params: {
    initialDebt: 10000,
    interestRate: 0.05,
    investmentReturn: 0.07,
    monthlyPayment: 500,
    timeframe: 24
  },
  financialState: {
    debt: 10000,
    investments: 5000,
    monthlyIncome: 5000,
    monthlyExpenses: 3000
  },
  strategy: {
    type: 'aggressive',
    monthlyDebtPayment: 1000,
    monthlyInvestment: 500
  },
  scenario: {
    name: 'base_case',
    parameters: {
      incomeGrowth: 0.03,
      expenseGrowth: 0.02,
      marketReturn: 0.07
    }
  }
};

// Error State Mocks
export const errorMocks = {
  apiError: {
    code: 'API_ERROR',
    message: 'Failed to fetch data',
    details: 'Network timeout',
    timestamp: new Date()
  },
  validationError: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: 'Amount must be positive',
    timestamp: new Date()
  },
  authError: {
    code: 'AUTH_ERROR',
    message: 'Authentication failed',
    details: 'Invalid credentials',
    timestamp: new Date()
  }
};

// Export all mocks
export default {
  crypto: cryptoMocks,
  sync: syncMocks,
  rule: ruleMocks,
  simulation: simulationMocks,
  error: errorMocks
}; 