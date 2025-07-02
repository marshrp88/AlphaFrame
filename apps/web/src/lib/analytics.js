/**
 * Analytics Service - Galileo Initiative User Tracking
 * 
 * Purpose: Track user behavior and events for market validation and feedback collection
 * Procedure: Provides event tracking functions that log to console and localStorage
 * Conclusion: Enables data-driven insights for product improvement and user experience optimization
 */

// Event types for Galileo Initiative tracking
export const EVENT_TYPES = {
  USER_ONBOARD_STARTED: 'user_onboard_started',
  USER_ONBOARD_COMPLETED: 'user_onboard_completed',
  RULE_CREATED: 'rule_created',
  INSIGHT_CLICKED: 'insight_clicked',
  UPGRADE_CLICKED: 'upgrade_clicked',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  DEMO_MODE_VIEWED: 'demo_mode_viewed',
  TRUST_PAGE_VISITED: 'trust_page_visited',
  SOFT_LAUNCH_ACCESSED: 'soft_launch_accessed'
};

// Analytics configuration
const ANALYTICS_CONFIG = {
  enabled: true,
  logToConsole: true,
  logToStorage: true,
  sessionId: generateSessionId()
};

// Generate unique session ID for user tracking
function generateSessionId() {
  const existingId = localStorage.getItem('alphaframe_session_id');
  if (existingId) return existingId;
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('alphaframe_session_id', newId);
  return newId;
}

// Get user identifier (email or anonymous ID)
function getUserIdentifier() {
  const userEmail = localStorage.getItem('alphaframe_user_email');
  const anonymousId = localStorage.getItem('alphaframe_anonymous_id');
  
  if (userEmail) return userEmail;
  if (anonymousId) return anonymousId;
  
  const newAnonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('alphaframe_anonymous_id', newAnonymousId);
  return newAnonymousId;
}

// Track event with metadata
export function trackEvent(eventType, properties = {}) {
  if (!ANALYTICS_CONFIG.enabled) return;

  const event = {
    eventType,
    timestamp: new Date().toISOString(),
    sessionId: ANALYTICS_CONFIG.sessionId,
    userId: getUserIdentifier(),
    properties,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console for development
  if (ANALYTICS_CONFIG.logToConsole) {
    console.log('📊 AlphaFrame Analytics Event:', event);
  }

  // Store in localStorage for persistence
  if (ANALYTICS_CONFIG.logToStorage) {
    const events = JSON.parse(localStorage.getItem('alphaframe_events') || '[]');
    events.push(event);
    
    // Keep only last 100 events to prevent storage bloat
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('alphaframe_events', JSON.stringify(events));
  }
}

// Specific event tracking functions
export function trackOnboardStarted() {
  trackEvent(EVENT_TYPES.USER_ONBOARD_STARTED, {
    source: 'home_page',
    timestamp: Date.now()
  });
}

export function trackOnboardCompleted() {
  trackEvent(EVENT_TYPES.USER_ONBOARD_COMPLETED, {
    completionTime: Date.now(),
    stepsCompleted: 4
  });
}

export function trackRuleCreated(ruleData = {}) {
  trackEvent(EVENT_TYPES.RULE_CREATED, {
    ruleType: ruleData.type || 'custom',
    ruleName: ruleData.name || 'unnamed',
    templateUsed: ruleData.template || false
  });
}

export function trackInsightClicked(insightData = {}) {
  trackEvent(EVENT_TYPES.INSIGHT_CLICKED, {
    insightType: insightData.type || 'unknown',
    insightId: insightData.id || 'unknown'
  });
}

export function trackUpgradeClicked() {
  trackEvent(EVENT_TYPES.UPGRADE_CLICKED, {
    source: 'dashboard_banner',
    timestamp: Date.now()
  });
}

export function trackFeedbackSubmitted(feedbackData = {}) {
  trackEvent(EVENT_TYPES.FEEDBACK_SUBMITTED, {
    feedbackType: feedbackData.type || 'general',
    hasContactInfo: !!feedbackData.contactInfo,
    sentiment: feedbackData.sentiment || 'neutral'
  });
}

export function trackDemoModeViewed() {
  trackEvent(EVENT_TYPES.DEMO_MODE_VIEWED, {
    source: 'banner',
    timestamp: Date.now()
  });
}

export function trackTrustPageVisited() {
  trackEvent(EVENT_TYPES.TRUST_PAGE_VISITED, {
    timestamp: Date.now()
  });
}

export function trackSoftLaunchAccessed() {
  trackEvent(EVENT_TYPES.SOFT_LAUNCH_ACCESSED, {
    timestamp: Date.now()
  });
}

// Get analytics data for export
export function getAnalyticsData() {
  const events = JSON.parse(localStorage.getItem('alphaframe_events') || '[]');
  const sessionId = ANALYTICS_CONFIG.sessionId;
  const userId = getUserIdentifier();
  
  return {
    sessionId,
    userId,
    totalEvents: events.length,
    events,
    summary: generateEventSummary(events)
  };
}

// Generate summary statistics
function generateEventSummary(events) {
  const summary = {};
  
  events.forEach(event => {
    if (!summary[event.eventType]) {
      summary[event.eventType] = 0;
    }
    summary[event.eventType]++;
  });
  
  return summary;
}

// Clear analytics data (for testing)
export function clearAnalyticsData() {
  localStorage.removeItem('alphaframe_events');
  localStorage.removeItem('alphaframe_session_id');
  localStorage.removeItem('alphaframe_anonymous_id');
  console.log('🧹 AlphaFrame Analytics data cleared');
}

// Analytics hook for React components
export function useAnalytics() {
  return {
    trackEvent,
    trackOnboardStarted,
    trackOnboardCompleted,
    trackRuleCreated,
    trackInsightClicked,
    trackUpgradeClicked,
    trackFeedbackSubmitted,
    trackDemoModeViewed,
    trackTrustPageVisited,
    trackSoftLaunchAccessed,
    getAnalyticsData,
    clearAnalyticsData
  };
}

export default {
  trackEvent,
  trackOnboardStarted,
  trackOnboardCompleted,
  trackRuleCreated,
  trackInsightClicked,
  trackUpgradeClicked,
  trackFeedbackSubmitted,
  trackDemoModeViewed,
  trackTrustPageVisited,
  trackSoftLaunchAccessed,
  getAnalyticsData,
  clearAnalyticsData,
  useAnalytics
}; 