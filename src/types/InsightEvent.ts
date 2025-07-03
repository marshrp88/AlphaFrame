/**
 * InsightEvent - Cross-Phase Data Contract
 * 
 * Purpose: Shared interface for insight events that must support:
 * - Phase 2: Dynamic Rule-Based Insights
 * - Phase 11: Timeline Interaction Layer
 * - Phase 12-13: Analytics and A/B Testing
 * 
 * This contract ensures insight consistency across all phases and enables
 * the governance infrastructure to track user value delivery longitudinally.
 */

export interface InsightEvent {
  // Core Event Data
  insightId: string;
  type: 'rule_triggered' | 'spending_alert' | 'budget_warning' | 'trend_identified' | 'recommendation' | 'forecast';
  title: string;
  description: string;
  generatedAt: string;
  expiresAt?: string;
  
  // Rule Context (for debugging - Phase 7)
  ruleContext?: {
    ruleId: string;
    ruleName: string;
    ruleType: string;
    executionId: string;
  };
  
  // User Context (for personalization)
  userContext: {
    userId: string;
    userSegment: string;
    accountId?: string;
    phase: number; // which phase generated this insight
  };
  
  // Content (for display - Phase 2)
  content: {
    primaryMetric: {
      value: number;
      unit: string;
      format: 'currency' | 'percentage' | 'number' | 'text';
      trend?: 'up' | 'down' | 'stable';
    };
    secondaryMetrics?: {
      label: string;
      value: number;
      unit: string;
    }[];
    visualization?: {
      type: 'chart' | 'progress' | 'comparison' | 'timeline';
      data: any;
      config: any;
    };
    actions?: {
      label: string;
      action: string;
      url?: string;
      parameters?: Record<string, any>;
    }[];
  };
  
  // Impact Assessment (for analytics - Phase 12-13)
  impact: {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    category: 'spending' | 'saving' | 'investment' | 'budget' | 'general';
    estimatedValue?: number; // potential savings or impact
    confidence: number; // 0-1
  };
  
  // Engagement Tracking (for user behavior - Phase 12-13)
  engagement: {
    viewed: boolean;
    viewedAt?: string;
    clicked?: boolean;
    clickedAt?: string;
    actionTaken?: string;
    actionTimestamp?: string;
    dismissed?: boolean;
    dismissedAt?: string;
  };
  
  // Timeline Integration (for Phase 11)
  timeline?: {
    previousInsights: string[]; // insight IDs
    relatedEvents: string[]; // event IDs
    sequence: number; // position in timeline
    duration?: string; // how long this insight was relevant
  };
  
  // Metadata (for governance)
  metadata: {
    version: string;
    environment: 'development' | 'staging' | 'production';
    tags: string[];
    source: 'rule_execution' | 'analytics' | 'user_feedback' | 'system';
  };
}

// Timeline-specific extensions (Phase 11)
export interface TimelineInsightEvent extends InsightEvent {
  timeline: {
    previousInsights: string[];
    relatedEvents: string[];
    sequence: number;
    duration?: string;
    historicalContext: {
      similarInsights: number;
      averageEngagement: number;
      successRate: number;
    };
  };
}

// Analytics-specific extensions (Phase 12-13)
export interface AnalyticsInsightEvent extends InsightEvent {
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
      viewRate: number;
      clickRate: number;
      actionRate: number;
      timeToAction?: number;
    };
  };
}

// Validation functions for governance
export function validateInsightEvent(event: InsightEvent): boolean {
  return !!(
    event.insightId &&
    event.type &&
    event.title &&
    event.description &&
    event.generatedAt &&
    event.userContext &&
    event.content &&
    event.impact &&
    event.engagement &&
    event.metadata
  );
}

export function isTimelineCompatible(event: InsightEvent): event is TimelineInsightEvent {
  return 'timeline' in event && !!event.timeline;
}

export function isAnalyticsCompatible(event: InsightEvent): event is AnalyticsInsightEvent {
  return 'analytics' in event;
}

// Factory functions for creating insights in different phases
export function createBaseInsightEvent(
  type: InsightEvent['type'],
  title: string,
  description: string,
  userId: string,
  phase: number
): InsightEvent {
  return {
    insightId: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    description,
    generatedAt: new Date().toISOString(),
    userContext: {
      userId,
      userSegment: 'default',
      phase
    },
    content: {
      primaryMetric: {
        value: 0,
        unit: '',
        format: 'number'
      }
    },
    impact: {
      urgency: 'medium',
      category: 'general',
      confidence: 0.5
    },
    engagement: {
      viewed: false
    },
    metadata: {
      version: '1.0.0',
      environment: 'development',
      tags: [],
      source: 'rule_execution'
    }
  };
}

// Insight generation helpers
export function createRuleTriggeredInsight(
  ruleId: string,
  ruleName: string,
  triggerValue: number,
  threshold: number,
  userId: string,
  phase: number
): InsightEvent {
  const insight = createBaseInsightEvent(
    'rule_triggered',
    `Rule Alert: ${ruleName}`,
    `Your ${ruleName} rule has been triggered. Current value: $${triggerValue.toFixed(2)}, Threshold: $${threshold.toFixed(2)}`,
    userId,
    phase
  );
  
  insight.ruleContext = {
    ruleId,
    ruleName,
    ruleType: 'spending_limit',
    executionId: `${ruleId}_${Date.now()}`
  };
  
  insight.content.primaryMetric = {
    value: triggerValue,
    unit: 'USD',
    format: 'currency',
    trend: 'up'
  };
  
  insight.content.secondaryMetrics = [
    {
      label: 'Threshold',
      value: threshold,
      unit: 'USD'
    }
  ];
  
  insight.content.actions = [
    {
      label: 'View Details',
      action: 'navigate',
      url: `/rules/${ruleId}`
    },
    {
      label: 'Adjust Threshold',
      action: 'edit_rule',
      parameters: { ruleId }
    }
  ];
  
  insight.impact = {
    urgency: 'high',
    category: 'spending',
    estimatedValue: triggerValue - threshold,
    confidence: 0.9
  };
  
  return insight;
}

export function createSpendingAlertInsight(
  category: string,
  currentSpending: number,
  budgetLimit: number,
  userId: string,
  phase: number
): InsightEvent {
  const percentage = (currentSpending / budgetLimit) * 100;
  const remaining = budgetLimit - currentSpending;
  
  const insight = createBaseInsightEvent(
    'spending_alert',
    `Spending Alert: ${category}`,
    `You've spent $${currentSpending.toFixed(2)} of your $${budgetLimit.toFixed(2)} ${category} budget (${percentage.toFixed(1)}%)`,
    userId,
    phase
  );
  
  insight.content.primaryMetric = {
    value: percentage,
    unit: '%',
    format: 'percentage',
    trend: percentage > 80 ? 'up' : 'stable'
  };
  
  insight.content.secondaryMetrics = [
    {
      label: 'Remaining',
      value: remaining,
      unit: 'USD'
    }
  ];
  
  insight.content.actions = [
    {
      label: 'View Budget',
      action: 'navigate',
      url: '/budget'
    },
    {
      label: 'Adjust Spending',
      action: 'create_rule',
      parameters: { category }
    }
  ];
  
  insight.impact = {
    urgency: percentage > 90 ? 'critical' : percentage > 80 ? 'high' : 'medium',
    category: 'budget',
    estimatedValue: remaining,
    confidence: 0.8
  };
  
  return insight;
}

// Export for cross-phase compatibility
export default {
  InsightEvent,
  TimelineInsightEvent,
  AnalyticsInsightEvent,
  validateInsightEvent,
  isTimelineCompatible,
  isAnalyticsCompatible,
  createBaseInsightEvent,
  createRuleTriggeredInsight,
  createSpendingAlertInsight
}; 