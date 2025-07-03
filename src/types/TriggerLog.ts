/**
 * TriggerLog - Cross-Phase Data Contract
 * 
 * Purpose: Shared interface for trigger logs that must support:
 * - Phase 7: Rule Debugging Console
 * - Phase 11: Timeline Interaction Layer
 * - Phase 12-13: Analytics and A/B Testing
 * 
 * This contract ensures trigger consistency across all phases and enables
 * the governance infrastructure to track automation performance longitudinally.
 */

export interface TriggerLog {
  // Core Log Data
  triggerId: string;
  ruleId: string;
  ruleName: string;
  triggerType: 'rule_execution' | 'user_action' | 'system_event' | 'scheduled' | 'webhook';
  triggeredAt: string;
  status: 'success' | 'failure' | 'partial' | 'timeout';
  
  // Execution Context (for debugging - Phase 7)
  executionContext: {
    userId: string;
    sessionId?: string;
    requestId: string;
    phase: number; // which phase generated this trigger
    environment: 'development' | 'staging' | 'production';
    dataSource: 'plaid' | 'simulation' | 'mock' | 'user_input';
  };
  
  // Trigger Data (for analysis)
  triggerData: {
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    conditions: {
      condition: string;
      result: boolean;
      value?: any;
    }[];
    metadata: Record<string, any>;
  };
  
  // Performance Metrics (for analytics - Phase 12-13)
  performance: {
    totalDurationMs: number;
    dataFetchDurationMs: number;
    ruleEvaluationDurationMs: number;
    actionExecutionDurationMs: number;
    memoryUsageKb: number;
    cpuUsagePercent: number;
  };
  
  // Actions Taken (for timeline - Phase 11)
  actions: {
    actionId: string;
    actionType: 'notification' | 'insight_generation' | 'data_update' | 'external_api_call' | 'user_redirect';
    actionName: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    startedAt: string;
    completedAt?: string;
    durationMs?: number;
    result?: any;
    error?: {
      code: string;
      message: string;
      stack?: string;
    };
  }[];
  
  // User Impact (for engagement tracking)
  userImpact: {
    notificationsSent: number;
    insightsGenerated: number;
    userActionsTriggered: number;
    userEngagementTimeMs?: number;
    userSatisfactionScore?: number; // 1-5
  };
  
  // Error Handling (for robustness - Phase 14)
  errors?: {
    errorId: string;
    errorType: 'validation' | 'execution' | 'timeout' | 'external_service' | 'data';
    errorCode: string;
    errorMessage: string;
    recoverable: boolean;
    fallbackUsed?: string;
    retryCount: number;
    maxRetries: number;
  }[];
  
  // Timeline Integration (for Phase 11)
  timeline?: {
    previousTriggers: string[]; // trigger IDs
    nextScheduledTrigger?: string;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    historicalPattern: {
      averageFrequency: number;
      successRate: number;
      commonFailureModes: string[];
    };
  };
  
  // Analytics Integration (for Phase 12-13)
  analytics?: {
    cohort: string;
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
  
  // Metadata (for governance)
  metadata: {
    version: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    retention: '30_days' | '90_days' | '1_year' | 'permanent';
  };
}

// Timeline-specific extensions (Phase 11)
export interface TimelineTriggerLog extends TriggerLog {
  timeline: {
    previousTriggers: string[];
    nextScheduledTrigger?: string;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    historicalPattern: {
      averageFrequency: number;
      successRate: number;
      commonFailureModes: string[];
    };
    sequence: number; // position in timeline
    relatedEvents: string[]; // related event IDs
  };
}

// Debug-specific extensions (Phase 7)
export interface DebugTriggerLog extends TriggerLog {
  debug: {
    executionSteps: {
      step: string;
      input: any;
      output: any;
      durationMs: number;
      success: boolean;
      error?: string;
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
      actionExecution: number;
      notificationDispatch: number;
    };
    memorySnapshot: {
      heapUsed: number;
      heapTotal: number;
      external: number;
    };
  };
}

// Analytics-specific extensions (Phase 12-13)
export interface AnalyticsTriggerLog extends TriggerLog {
  analytics: {
    cohort: string;
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
    performance: {
      triggerRate: number;
      successRate: number;
      averageResponseTime: number;
      userEngagementRate: number;
    };
  };
}

// Validation functions for governance
export function validateTriggerLog(log: TriggerLog): boolean {
  return !!(
    log.triggerId &&
    log.ruleId &&
    log.ruleName &&
    log.triggerType &&
    log.triggeredAt &&
    log.status &&
    log.executionContext &&
    log.triggerData &&
    log.performance &&
    log.actions &&
    log.userImpact &&
    log.metadata
  );
}

export function isTimelineCompatible(log: TriggerLog): log is TimelineTriggerLog {
  return 'timeline' in log && !!log.timeline;
}

export function isDebugCompatible(log: TriggerLog): log is DebugTriggerLog {
  return 'debug' in log;
}

export function isAnalyticsCompatible(log: TriggerLog): log is AnalyticsTriggerLog {
  return 'analytics' in log;
}

// Factory functions for creating trigger logs in different phases
export function createBaseTriggerLog(
  ruleId: string,
  ruleName: string,
  triggerType: TriggerLog['triggerType'],
  userId: string,
  phase: number
): TriggerLog {
  return {
    triggerId: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ruleId,
    ruleName,
    triggerType,
    triggeredAt: new Date().toISOString(),
    status: 'success',
    executionContext: {
      userId,
      requestId: `req_${Date.now()}`,
      phase,
      environment: 'development',
      dataSource: 'mock'
    },
    triggerData: {
      inputs: {},
      outputs: {},
      conditions: [],
      metadata: {}
    },
    performance: {
      totalDurationMs: 0,
      dataFetchDurationMs: 0,
      ruleEvaluationDurationMs: 0,
      actionExecutionDurationMs: 0,
      memoryUsageKb: 0,
      cpuUsagePercent: 0
    },
    actions: [],
    userImpact: {
      notificationsSent: 0,
      insightsGenerated: 0,
      userActionsTriggered: 0
    },
    metadata: {
      version: '1.0.0',
      tags: [],
      priority: 'medium',
      retention: '90_days'
    }
  };
}

// Trigger log creation helpers
export function createRuleExecutionTriggerLog(
  ruleId: string,
  ruleName: string,
  userId: string,
  phase: number,
  inputs: Record<string, any>,
  outputs: Record<string, any>
): TriggerLog {
  const log = createBaseTriggerLog(ruleId, ruleName, 'rule_execution', userId, phase);
  
  log.triggerData = {
    inputs,
    outputs,
    conditions: [
      {
        condition: 'rule_evaluation',
        result: true,
        value: outputs
      }
    ],
    metadata: {
      evaluationMethod: 'standard',
      confidence: 0.9
    }
  };
  
  log.actions = [
    {
      actionId: `action_${Date.now()}`,
      actionType: 'insight_generation',
      actionName: 'Generate Insight',
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 100,
      result: { insightGenerated: true }
    }
  ];
  
  log.userImpact = {
    notificationsSent: 1,
    insightsGenerated: 1,
    userActionsTriggered: 0
  };
  
  return log;
}

export function createUserActionTriggerLog(
  ruleId: string,
  ruleName: string,
  userId: string,
  phase: number,
  action: string,
  parameters: Record<string, any>
): TriggerLog {
  const log = createBaseTriggerLog(ruleId, ruleName, 'user_action', userId, phase);
  
  log.triggerData = {
    inputs: { action, parameters },
    outputs: { success: true },
    conditions: [
      {
        condition: 'user_action_detected',
        result: true,
        value: { action, parameters }
      }
    ],
    metadata: {
      userIntent: 'explicit',
      actionSource: 'ui_interaction'
    }
  };
  
  log.actions = [
    {
      actionId: `action_${Date.now()}`,
      actionType: 'data_update',
      actionName: action,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 50,
      result: { success: true }
    }
  ];
  
  log.userImpact = {
    notificationsSent: 0,
    insightsGenerated: 0,
    userActionsTriggered: 1
  };
  
  return log;
}

// Export for cross-phase compatibility
export default {
  TriggerLog,
  TimelineTriggerLog,
  DebugTriggerLog,
  AnalyticsTriggerLog,
  validateTriggerLog,
  isTimelineCompatible,
  isDebugCompatible,
  isAnalyticsCompatible,
  createBaseTriggerLog,
  createRuleExecutionTriggerLog,
  createUserActionTriggerLog
}; 