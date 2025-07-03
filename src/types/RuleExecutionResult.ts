/**
 * RuleExecutionResult - Cross-Phase Data Contract
 * 
 * Purpose: Shared interface for rule execution results that must support:
 * - Phase 7: Rule Debugging Console
 * - Phase 11: Timeline Interaction Layer  
 * - Phase 12-13: Analytics and A/B Testing
 * 
 * This contract ensures data consistency across all phases and enables
 * the governance infrastructure to track rule performance longitudinally.
 */

export interface RuleExecutionResult {
  // Core Execution Data
  ruleId: string;
  ruleName: string;
  ruleType: 'spending_limit' | 'balance_monitor' | 'category_alert' | 'custom';
  executionId: string;
  executedAt: string;
  status: 'triggered' | 'missed' | 'error' | 'warning';
  
  // Input Data (for debugging - Phase 7)
  inputs: {
    transactions: TransactionInput[];
    thresholds: Record<string, number>;
    categories: string[];
    timeRange: {
      start: string;
      end: string;
    };
  };
  
  // Evaluation Context (for timeline - Phase 11)
  context: {
    userId: string;
    accountId?: string;
    dataSource: 'plaid' | 'simulation' | 'mock';
    evaluationMethod: string;
    confidence: number; // 0-1
  };
  
  // Results (for insights - Phase 2)
  results: {
    triggered: boolean;
    triggerReason?: string;
    matchedTransactions?: string[];
    calculatedValue: number;
    threshold: number;
    variance: number; // difference from threshold
  };
  
  // Performance Metrics (for analytics - Phase 12-13)
  performance: {
    evaluationTimeMs: number;
    dataFetchTimeMs: number;
    ruleComplexity: 'simple' | 'medium' | 'complex';
    memoryUsageKb: number;
  };
  
  // User Impact (for feedback - Phase 3)
  userImpact: {
    insightGenerated: boolean;
    notificationSent: boolean;
    userActionTaken?: string;
    actionTimestamp?: string;
  };
  
  // Error Handling (for robustness - Phase 14)
  errors?: {
    code: string;
    message: string;
    recoverable: boolean;
    fallbackUsed?: string;
  }[];
  
  // Metadata (for governance)
  metadata: {
    phase: number; // which phase generated this result
    version: string;
    environment: 'development' | 'staging' | 'production';
    tags: string[]; // for filtering and categorization
  };
}

export interface TransactionInput {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  accountId?: string;
  source: 'plaid' | 'simulation' | 'mock';
}

// Timeline-specific extensions (Phase 11)
export interface TimelineRuleExecutionResult extends RuleExecutionResult {
  timeline: {
    previousExecutions: string[]; // execution IDs
    nextScheduledExecution?: string;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    historicalTrend: {
      triggerRate: number;
      averageValue: number;
      trendDirection: 'increasing' | 'decreasing' | 'stable';
    };
  };
}

// Debug-specific extensions (Phase 7)
export interface DebugRuleExecutionResult extends RuleExecutionResult {
  debug: {
    evaluationSteps: {
      step: string;
      input: any;
      output: any;
      durationMs: number;
      success: boolean;
    }[];
    decisionTree: {
      node: string;
      condition: string;
      result: boolean;
      children?: string[];
    }[];
    performanceBreakdown: {
      dataFetch: number;
      ruleEvaluation: number;
      insightGeneration: number;
      notificationDispatch: number;
    };
  };
}

// Analytics-specific extensions (Phase 12-13)
export interface AnalyticsRuleExecutionResult extends RuleExecutionResult {
  analytics: {
    cohort: string;
    userSegment: string;
    experimentVariant?: string;
    conversionEvents: {
      event: string;
      timestamp: string;
      value?: number;
    }[];
    attribution: {
      source: string;
      campaign?: string;
      medium?: string;
    };
  };
}

// Validation functions for governance
export function validateRuleExecutionResult(result: RuleExecutionResult): boolean {
  return !!(
    result.ruleId &&
    result.ruleName &&
    result.executionId &&
    result.executedAt &&
    result.status &&
    result.inputs &&
    result.context &&
    result.results &&
    result.performance &&
    result.userImpact &&
    result.metadata
  );
}

export function isTimelineCompatible(result: RuleExecutionResult): result is TimelineRuleExecutionResult {
  return 'timeline' in result;
}

export function isDebugCompatible(result: RuleExecutionResult): result is DebugRuleExecutionResult {
  return 'debug' in result;
}

export function isAnalyticsCompatible(result: RuleExecutionResult): result is AnalyticsRuleExecutionResult {
  return 'analytics' in result;
}

// Factory functions for creating results in different phases
export function createBaseRuleExecutionResult(
  ruleId: string,
  ruleName: string,
  status: RuleExecutionResult['status'],
  phase: number
): RuleExecutionResult {
  return {
    ruleId,
    ruleName,
    ruleType: 'custom',
    executionId: `${ruleId}_${Date.now()}`,
    executedAt: new Date().toISOString(),
    status,
    inputs: {
      transactions: [],
      thresholds: {},
      categories: [],
      timeRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString()
      }
    },
    context: {
      userId: '',
      dataSource: 'mock',
      evaluationMethod: 'default',
      confidence: 0.5
    },
    results: {
      triggered: false,
      calculatedValue: 0,
      threshold: 0,
      variance: 0
    },
    performance: {
      evaluationTimeMs: 0,
      dataFetchTimeMs: 0,
      ruleComplexity: 'simple',
      memoryUsageKb: 0
    },
    userImpact: {
      insightGenerated: false,
      notificationSent: false
    },
    metadata: {
      phase,
      version: '1.0.0',
      environment: 'development',
      tags: []
    }
  };
}

// Export for cross-phase compatibility
export default {
  RuleExecutionResult,
  TimelineRuleExecutionResult,
  DebugRuleExecutionResult,
  AnalyticsRuleExecutionResult,
  validateRuleExecutionResult,
  isTimelineCompatible,
  isDebugCompatible,
  isAnalyticsCompatible,
  createBaseRuleExecutionResult
}; 