/**
 * ruleEngine.js
 * This service provides functions for evaluating and managing financial rules.
 */

import { RuleSchema } from '../validation/schemas';

/**
 * Asynchronously evaluates a single rule against a transaction object.
 * @param {object} rule - The rule object to evaluate.
 * @param {object} transaction - The transaction data.
 * @returns {Promise<boolean>} - A promise that resolves to true if conditions are met, or rejects on invalid input.
 */
export const evaluateRule = async (rule, transaction) => {
  // Validate rule structure using Zod
  const parsed = RuleSchema.safeParse(rule);
  if (!parsed.success || !transaction) {
    throw new Error('Invalid rule or transaction object provided.');
  }
  rule = parsed.data;

  if (!rule || !rule.conditions || !Array.isArray(rule.conditions) || !transaction) {
    // This throw is for invalid rule/transaction structures.
    throw new Error('Invalid rule or transaction object provided.');
  }

  // Use a standard for...of loop to allow for early exit and error throwing.
  for (const condition of rule.conditions) {
    const { field, operator, value } = condition;
    const transactionValue = transaction[field];

    // If a field required by a condition doesn't exist on the transaction,
    // this is a processing error, and we should reject the promise.
    if (transactionValue === undefined) {
      throw new Error(`Field "${field}" not found on transaction.`);
    }

    let conditionMet = false;
    switch (operator) {
      case '>':
        conditionMet = transactionValue > value;
        break;
      case '<':
        conditionMet = transactionValue < value;
        break;
      case '===':
        conditionMet = transactionValue === value;
        break;
      case 'contains':
        conditionMet = typeof transactionValue === 'string' && transactionValue.toLowerCase().includes(String(value).toLowerCase());
        break;
      default:
        // If the operator is unknown, the condition is not met.
        conditionMet = false;
    }

    // If any single condition is not met, the entire rule is false.
    if (!conditionMet) {
      return false;
    }
  }

  // If the loop completes without returning false, all conditions were met.
  return true;
};

/**
 * Asynchronously simulates the execution of a rule's action.
 * @param {object} rule - The rule object containing the action.
 * @returns {Promise<object>} - A promise that resolves with the action object.
 */
export const executeRule = async (rule) => {
  return rule.action;
};

/**
 * Asynchronously validates the structure of a rule object.
 * @param {object} rule - The rule to validate.
 * @returns {Promise<boolean>} - A promise that resolves to true if the rule is valid, false otherwise.
 */
export const validateRule = async (rule) => {
  // Use Zod schema to validate rule
  const parsed = RuleSchema.safeParse(rule);
  return parsed.success;
};

/**
 * Asynchronously filters a list of rules to find all that match a given transaction.
 * @param {object} transaction - The transaction data.
 * @param {Array<object>} allRules - An array of all rule objects.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of matching rule objects.
 */
export const getMatchingRules = async (transaction, allRules) => {
  const evaluationPromises = allRules.map(rule => 
    evaluateRule(rule, transaction).catch(() => false) // .catch() now works because evaluateRule returns a Promise
  );

  const evaluationResults = await Promise.all(evaluationPromises);
  
  const matchingRules = allRules.filter((_, index) => evaluationResults[index]);
  return matchingRules;
}; 