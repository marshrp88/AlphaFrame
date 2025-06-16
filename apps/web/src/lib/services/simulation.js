/**
 * SimulationService handles financial scenario simulations
 */

// Helper function to validate parameters
function validateParams(params) {
  if (
    params.initialDebt < 0 ||
    params.interestRate < 0 ||
    params.investmentReturn < 0 ||
    params.monthlyPayment < 0 ||
    params.timeframe <= 0
  ) {
    throw new Error('Invalid parameters');
  }
}

/**
 * Runs a debt vs investment simulation
 * Compares paying down debt vs. investing extra money over time.
 */
export const runDebtVsInvestment = async (params) => {
  validateParams(params);
  const { initialDebt, interestRate, investmentReturn, monthlyPayment, timeframe } = params;

  // Debt repayment scenario
  let debt = initialDebt;
  let totalDebtPaid = 0;
  for (let i = 0; i < timeframe; i++) {
    if (debt <= 0) break;
    // Apply interest to remaining debt
    debt = debt * (1 + interestRate / 12);
    // Pay monthly payment
    const payment = Math.min(monthlyPayment, debt);
    debt -= payment;
    totalDebtPaid += payment;
  }

  // Investment scenario
  let investment = 0;
  for (let i = 0; i < timeframe; i++) {
    // Add monthly payment to investment
    investment += monthlyPayment;
    // Apply investment return
    investment = investment * (1 + investmentReturn / 12);
  }
  const totalInvestmentGain = investment;

  // Net benefit: compare final outcomes
  const netBenefit = totalInvestmentGain - (initialDebt - debt);

  return {
    totalDebtPaid: Math.round(totalDebtPaid),
    totalInvestmentGain: Math.round(totalInvestmentGain),
    netBenefit: Math.round(netBenefit)
  };
};

/**
 * Generates a scenario based on current financial state
 */
export const generateScenario = async (financialState) => {
  // Calculate monthly cash flow
  const monthlyCashFlow = financialState.monthlyIncome - financialState.monthlyExpenses;
  // Projected debt after 1 year (12 months) with no extra payments
  const projectedDebt = financialState.debt * Math.pow(1.01, 12); // Assume 1% monthly interest
  // Projected investments after 1 year with no extra contributions
  const projectedInvestments = financialState.investments * Math.pow(1.005, 12); // Assume 0.5% monthly growth
  return {
    projectedDebt: Math.round(projectedDebt),
    projectedInvestments: Math.round(projectedInvestments),
    monthlyCashFlow: Math.round(monthlyCashFlow)
  };
};

/**
 * Calculates optimal payment strategy
 */
export const calculateOptimalStrategy = async (params) => {
  validateParams(params);
  // Simple rule: if investment return > interest rate, invest more; else, pay debt
  let monthlyDebtPayment, monthlyInvestment, expectedOutcome;
  if (params.investmentReturn > params.interestRate) {
    monthlyInvestment = Math.round(params.monthlyPayment * 0.7);
    monthlyDebtPayment = params.monthlyPayment - monthlyInvestment;
    expectedOutcome = 'investment';
  } else {
    monthlyDebtPayment = Math.round(params.monthlyPayment * 0.7);
    monthlyInvestment = params.monthlyPayment - monthlyDebtPayment;
    expectedOutcome = 'debt';
  }
  return {
    monthlyDebtPayment,
    monthlyInvestment,
    expectedOutcome
  };
};

/**
 * Projects future financial state
 */
export const projectFutureState = async (currentState, strategy) => {
  // Project 12 months into the future
  let debt = currentState.debt;
  let investments = currentState.investments;
  for (let i = 0; i < 12; i++) {
    // Apply debt payment and interest
    debt = debt * 1.01 - (strategy.monthlyDebtPayment || 0); // 1% monthly interest
    if (debt < 0) debt = 0;
    // Apply investment and growth
    investments = (investments + (strategy.monthlyInvestment || 0)) * 1.005; // 0.5% monthly growth
  }
  const projectedNetWorth = investments - debt;
  return {
    projectedDebt: Math.round(debt),
    projectedInvestments: Math.round(investments),
    projectedNetWorth: Math.round(projectedNetWorth)
  };
}; 