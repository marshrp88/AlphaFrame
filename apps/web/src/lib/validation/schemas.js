import { z } from 'zod';

// RuleSchema: Defines the structure of a rule object
export const RuleSchema = z.object({
  id: z.string().optional(), // Rule ID (optional for new rules)
  condition: z.string(), // The rule logic as a string
  actionType: z.string(), // The type of action to trigger
  isActive: z.boolean().default(true), // Whether the rule is enabled
});

// ActionSchema: Defines the structure of an action payload
export const ActionSchema = z.object({
  type: z.string(), // Action type (e.g., 'PLAID_TRANSFER')
  payload: z.record(z.any()), // Action-specific data
});

// TransactionSchema: Defines the structure of a transaction object
export const TransactionSchema = z.object({
  id: z.string(), // Transaction ID
  fromAccount: z.string(),
  toAccount: z.string(),
  amount: z.number().positive(), // Must be a positive number
  date: z.string(), // ISO date string
  status: z.enum(['pending', 'completed', 'failed']),
});

// Notes:
// - These schemas are used to validate data at runtime.
// - They help catch errors early and enforce strict contracts between modules.
// - Each schema is commented for 10th-grade-level understanding. 
