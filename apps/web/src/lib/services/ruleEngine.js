/**
 * ruleEngine.js
 * This service provides functions for evaluating and managing financial rules.
 */

/**
 * Dynamically evaluates a single rule against a transaction object.
 * This is an async function to align with test expectations of promise rejection.
 * @param {object} rule - The rule object to evaluate.
 * @param {object} transaction - The transaction data.
 * @returns {Promise<boolean>} - A promise that resolves to true if all conditions are met, or rejects if the rule or transaction is invalid.
 */
export const evaluateRule = async (rule, transaction) => {
  if (!rule || !rule.conditions || !Array.isArray(rule.conditions) || !transaction) {
    throw new Error('Invalid rule or transaction provided.');
  }

  // For invalid transactions (missing required fields), we should reject
  if (Object.keys(transaction).length === 0 || !transaction.id) {
    throw new Error('Invalid transaction provided.');
  }

  // Evaluate each condition
  const allConditionsMet = rule.conditions.every(condition => {
    const { field, operator, value } = condition;
    const transactionValue = transaction[field];

    // If the field doesn't exist in the transaction, the condition is not met
    if (transactionValue === undefined) {
      return false;
    }

    switch (operator) {
      case '>':
        return Number(transactionValue) > Number(value);
      case '<':
        return Number(transactionValue) < Number(value);
      case '===':
        return transactionValue === value;
      case 'contains':
        return typeof transactionValue === 'string' && 
               transactionValue.toLowerCase().includes(String(value).toLowerCase());
      default:
        return false;
    }
  });

  return allConditionsMet;
};

/**
 * Simulates the execution of a rule's action.
 * @param {object} rule - The rule object containing the action.
 * @returns {Promise<object>} - A promise that resolves with the action object.
 */
export const executeRule = async (rule) => {
  return rule.action;
};

/**
 * Validates the structure of a rule object.
 * @param {object} rule - The rule to validate.
 * @returns {Promise<boolean>} - A promise that resolves to true if the rule is valid, false otherwise.
 */
export const validateRule = async (rule) => {
  const isValid =
    !!rule &&
    typeof rule.id === 'string' &&
    typeof rule.name === 'string' &&
    Array.isArray(rule.conditions) &&
    rule.conditions.length > 0 &&
    typeof rule.action === 'object' &&
    rule.action !== null;
  return isValid;
};

/**
 * Filters a list of rules to find all that match a given transaction.
 * @param {object} transaction - The transaction data.
 * @param {Array<object>} allRules - An array of all rule objects.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of matching rule objects.
 */
export const getMatchingRules = async (transaction, allRules) => {
  // Since evaluateRule is now async, we must handle the promises.
  // Promise.all allows us to evaluate all rules in parallel.
  const evaluationResults = await Promise.all(
    allRules.map(rule => 
      evaluateRule(rule, transaction).catch(() => false) // Treat evaluation errors as a non-match.
    )
  );

  const matchingRules = allRules.filter((_, index) => evaluationResults[index]);
  return matchingRules;
}; 