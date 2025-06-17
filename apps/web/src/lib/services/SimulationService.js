// SimulationService.js
// Service for simulating FrameSync actions
// Part of FrameSync - the execution and automation layer of AlphaFrame

/**
 * Simulates a Plaid transfer action
 * @param {Object} action - The action to simulate
 * @param {Object} financialState - The current financial state
 * @returns {Object} Simulation result
 */
const simulatePlaidTransfer = (action, financialState) => {
  const { amount, sourceAccount, destinationAccount } = action.payload;
  const sourceBalance = financialState.getAccountBalance(sourceAccount);
  const destinationBalance = financialState.getAccountBalance(destinationAccount);

  return {
    sourceBalance: sourceBalance - amount,
    destinationBalance: destinationBalance + amount,
    success: sourceBalance >= amount
  };
};

/**
 * Simulates a goal adjustment action
 * @param {Object} action - The action to simulate
 * @param {Object} financialState - The current financial state
 * @returns {Object} Simulation result
 */
const simulateGoalAdjustment = (action, financialState) => {
  const { goalId, adjustment } = action.payload;
  const goal = financialState.getGoal(goalId);
  const currentProgress = goal.currentAmount / goal.targetAmount * 100;
  const newProgress = Math.min(100, ((goal.currentAmount + adjustment) / goal.targetAmount) * 100);

  return {
    goalProgress: newProgress,
    remainingAmount: Math.max(0, goal.targetAmount - (goal.currentAmount + adjustment)),
    success: true
  };
};

/**
 * Runs a simulation for a given action
 * @param {Object} action - The action to simulate
 * @param {Object} financialState - The current financial state
 * @returns {Promise<Object>} Simulation result
 */
export const runSimulation = async (action, financialState) => {
  try {
    switch (action.actionType) {
      case 'PLAID_TRANSFER':
        return simulatePlaidTransfer(action, financialState);
      case 'ADJUST_GOAL':
        return simulateGoalAdjustment(action, financialState);
      default:
        throw new Error(`Unsupported action type for simulation: ${action.actionType}`);
    }
  } catch (error) {
    console.error('Simulation failed:', error);
    throw new Error(`Simulation failed: ${error.message}`);
  }
}; 