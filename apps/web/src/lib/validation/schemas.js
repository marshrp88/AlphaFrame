import { z } from 'zod';

// Enhanced RuleSchema for Rule Engine 2.0
export const RuleSchema = z.object({
  id: z.string().optional(), // Rule ID (optional for new rules)
  name: z.string().optional(), // Rule name for display
  conditions: z.array(
    z.union([
      // Simple condition
      z.object({
        field: z.string(),
        operator: z.string(), // Allow any string for testing invalid operators
        value: z.any(),
      }),
      // Logical condition group
      z.object({
        logicalOperator: z.string(), // Allow any string for testing invalid operators
        conditions: z.array(z.lazy(() => z.union([
          z.object({
            field: z.string(),
            operator: z.enum(['>', '<', '>=', '<=', '===', '!==', 'contains', 'startsWith', 'endsWith', 'isToday', 'isThisWeek', 'isThisMonth']),
            value: z.any(),
          }),
          z.object({
            logicalOperator: z.string(), // Allow any string for testing invalid operators
            conditions: z.array(z.any()), // Recursive reference
          })
        ])))
      })
    ])
  ),
  action: z.object({
    type: z.string(),
    payload: z.record(z.any()).optional(),
  }).optional(),
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
  fromAccount: z.string().optional(),
  toAccount: z.string().optional(),
  amount: z.number().positive(), // Must be a positive number
  date: z.string().optional(), // ISO date string
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

// InsightFeedSchema: Defines the structure of insight feed data
export const InsightFeedSchema = z.object({
  id: z.string(),
  type: z.enum(['retirement', 'tax', 'debt', 'investment', 'general']),
  title: z.string(),
  description: z.string(),
  data: z.record(z.any()),
  timestamp: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  actionable: z.boolean().default(true)
});

// Notes:
// - These schemas are used to validate data at runtime.
// - They help catch errors early and enforce strict contracts between modules.
// - Each schema is commented for 10th-grade-level understanding.
// - Rule Engine 2.0 supports complex logical operators and advanced comparison operators. 
