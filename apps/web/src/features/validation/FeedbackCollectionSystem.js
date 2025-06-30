/**
 * Feedback Collection System for AlphaFrame Helios Initiative
 * 
 * PURPOSE:
 * This system provides comprehensive feedback collection and analysis capabilities
 * to gather user insights through multiple channels and convert them into
 * actionable improvements. It supports our "Calm Confidence" brand goals by
 * ensuring user voices are heard and addressed systematically.
 * 
 * PROCEDURE:
 * 1. Define feedback collection channels and methods
 * 2. Create feedback analysis and categorization systems
 * 3. Establish feedback prioritization and action frameworks
 * 4. Set up feedback reporting and tracking mechanisms
 * 
 * CONCLUSION:
 * This system ensures continuous user feedback drives improvements
 * and maintains alignment with user needs and expectations.
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// FEEDBACK TYPES AND CATEGORIES
// ============================================================================

/**
 * Types of feedback that can be collected
 * Each type serves different purposes in understanding user experience
 */
export const FEEDBACK_TYPES = {
  USABILITY_FEEDBACK: 'usability_feedback',
  EMOTIONAL_FEEDBACK: 'emotional_feedback',
  FUNCTIONAL_FEEDBACK: 'functional_feedback',
  PERFORMANCE_FEEDBACK: 'performance_feedback',
  ACCESSIBILITY_FEEDBACK: 'accessibility_feedback',
  CONTENT_FEEDBACK: 'content_feedback',
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  GENERAL_FEEDBACK: 'general_feedback'
};

/**
 * Feedback categories for organization and analysis
 * These help categorize and prioritize feedback effectively
 */
export const FEEDBACK_CATEGORIES = {
  CRITICAL: 'critical', // Blocks user progress or causes data loss
  HIGH: 'high', // Significantly impacts user experience
  MEDIUM: 'medium', // Moderate impact on user experience
  LOW: 'low', // Minor impact or nice-to-have
  ENHANCEMENT: 'enhancement' // Improvement to existing functionality
};

/**
 * Feedback channels for collection
 * Different channels reach different user segments
 */
export const FEEDBACK_CHANNELS = {
  IN_APP_FEEDBACK: 'in_app_feedback',
  SURVEY: 'survey',
  INTERVIEW: 'interview',
  USABILITY_TEST: 'usability_test',
  SUPPORT_TICKET: 'support_ticket',
  SOCIAL_MEDIA: 'social_media',
  APP_STORE_REVIEW: 'app_store_review',
  EMAIL: 'email',
  PHONE: 'phone'
};

// ============================================================================
// FEEDBACK COLLECTION COMPONENTS
// ============================================================================

/**
 * In-App Feedback Widget
 * Provides immediate feedback collection within the application
 */
export function InAppFeedbackWidget({ 
  onFeedbackSubmit, 
  position = 'bottom-right',
  isVisible = true 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle feedback submission
   * Validates and submits feedback to the collection system
   */
  const handleSubmit = useCallback(async () => {
    if (!feedbackType || !feedbackText.trim()) {
      return; // Don't submit empty feedback
    }

    setIsSubmitting(true);

    try {
      const feedback = {
        id: `feedback_${Date.now()}`,
        type: feedbackType,
        text: feedbackText.trim(),
        rating,
        timestamp: new Date(),
        channel: FEEDBACK_CHANNELS.IN_APP_FEEDBACK,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: sessionStorage.getItem('sessionId') || 'unknown'
      };

      await onFeedbackSubmit(feedback);
      
      // Reset form
      setFeedbackType('');
      setFeedbackText('');
      setRating(0);
      setIsOpen(false);
      
      // Show success message
      showFeedbackSuccess();
      
    } catch (error) {
      console.error('Feedback submission failed:', error);
      showFeedbackError();
    } finally {
      setIsSubmitting(false);
    }
  }, [feedbackType, feedbackText, rating, onFeedbackSubmit]);

  /**
   * Show feedback success message
   * Provides positive reinforcement for user feedback
   */
  const showFeedbackSuccess = () => {
    // In a real implementation, this would show a toast or notification
    console.log('Feedback submitted successfully! Thank you for your input.');
  };

  /**
   * Show feedback error message
   * Handles submission failures gracefully
   */
  const showFeedbackError = () => {
    // In a real implementation, this would show an error message
    console.error('Failed to submit feedback. Please try again.');
  };

  if (!isVisible) return null;

  return (
    <div className={`feedback-widget feedback-widget--${position}`}>
      {/* Feedback Button */}
      {!isOpen && (
        <button
          className="feedback-widget__trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Provide feedback"
          title="Share your thoughts with us"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          <span>Feedback</span>
        </button>
      )}

      {/* Feedback Modal */}
      {isOpen && (
        <div className="feedback-widget__modal">
          <div className="feedback-widget__header">
            <h3>Share Your Thoughts</h3>
            <button
              className="feedback-widget__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback form"
            >
              ×
            </button>
          </div>

          <div className="feedback-widget__content">
            {/* Feedback Type Selection */}
            <div className="feedback-widget__section">
              <label htmlFor="feedback-type">What type of feedback do you have?</label>
              <select
                id="feedback-type"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                required
              >
                <option value="">Select feedback type...</option>
                <option value={FEEDBACK_TYPES.USABILITY_FEEDBACK}>Usability Issue</option>
                <option value={FEEDBACK_TYPES.EMOTIONAL_FEEDBACK}>How it makes me feel</option>
                <option value={FEEDBACK_TYPES.FUNCTIONAL_FEEDBACK}>Feature Request</option>
                <option value={FEEDBACK_TYPES.PERFORMANCE_FEEDBACK}>Performance Issue</option>
                <option value={FEEDBACK_TYPES.BUG_REPORT}>Bug Report</option>
                <option value={FEEDBACK_TYPES.GENERAL_FEEDBACK}>General Feedback</option>
              </select>
            </div>

            {/* Rating */}
            <div className="feedback-widget__section">
              <label>How would you rate your experience?</label>
              <div className="feedback-widget__rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`feedback-widget__star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="feedback-widget__section">
              <label htmlFor="feedback-text">Tell us more (optional)</label>
              <textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or describe any issues you encountered..."
                rows={4}
                maxLength={1000}
              />
              <div className="feedback-widget__char-count">
                {feedbackText.length}/1000
              </div>
            </div>

            {/* Submit Button */}
            <div className="feedback-widget__actions">
              <button
                className="feedback-widget__cancel"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="feedback-widget__submit"
                onClick={handleSubmit}
                disabled={!feedbackType || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FEEDBACK ANALYSIS SYSTEM
// ============================================================================

/**
 * Feedback Analysis Engine
 * Processes and analyzes collected feedback for insights
 */
export class FeedbackAnalysisEngine {
  constructor() {
    this.feedback = [];
    this.analysisResults = {};
  }

  /**
   * Add feedback to the analysis engine
   * @param {object} feedback - Feedback object to analyze
   */
  addFeedback(feedback) {
    this.feedback.push({
      ...feedback,
      id: feedback.id || `feedback_${Date.now()}`,
      timestamp: feedback.timestamp || new Date(),
      category: this.categorizeFeedback(feedback)
    });
  }

  /**
   * Categorize feedback based on content and type
   * @param {object} feedback - Feedback object to categorize
   */
  categorizeFeedback(feedback) {
    const { type, text, rating } = feedback;
    
    // Critical issues (rating 1-2 with negative text)
    if (rating <= 2 && text.toLowerCase().includes('broken') || 
        text.toLowerCase().includes('error') || 
        text.toLowerCase().includes('crash')) {
      return FEEDBACK_CATEGORIES.CRITICAL;
    }
    
    // High priority (rating 1-3 with usability issues)
    if (rating <= 3 && (type === FEEDBACK_TYPES.USABILITY_FEEDBACK || 
        type === FEEDBACK_TYPES.BUG_REPORT)) {
      return FEEDBACK_CATEGORIES.HIGH;
    }
    
    // Medium priority (rating 3-4 with suggestions)
    if (rating >= 3 && rating <= 4 && type === FEEDBACK_TYPES.FEATURE_REQUEST) {
      return FEEDBACK_CATEGORIES.MEDIUM;
    }
    
    // Enhancement (rating 4-5 with positive feedback)
    if (rating >= 4 && type === FEEDBACK_TYPES.GENERAL_FEEDBACK) {
      return FEEDBACK_CATEGORIES.ENHANCEMENT;
    }
    
    return FEEDBACK_CATEGORIES.LOW;
  }

  /**
   * Analyze feedback patterns and trends
   * @param {object} options - Analysis options
   */
  analyzeFeedback(options = {}) {
    const { timeRange, feedbackTypes, categories } = options;
    
    let filteredFeedback = this.feedback;
    
    // Filter by time range
    if (timeRange) {
      const startDate = new Date(Date.now() - timeRange);
      filteredFeedback = filteredFeedback.filter(
        f => new Date(f.timestamp) >= startDate
      );
    }
    
    // Filter by feedback types
    if (feedbackTypes && feedbackTypes.length > 0) {
      filteredFeedback = filteredFeedback.filter(
        f => feedbackTypes.includes(f.type)
      );
    }
    
    // Filter by categories
    if (categories && categories.length > 0) {
      filteredFeedback = filteredFeedback.filter(
        f => categories.includes(f.category)
      );
    }
    
    // Calculate metrics
    const analysis = {
      totalFeedback: filteredFeedback.length,
      averageRating: this.calculateAverageRating(filteredFeedback),
      categoryDistribution: this.calculateCategoryDistribution(filteredFeedback),
      typeDistribution: this.calculateTypeDistribution(filteredFeedback),
      sentimentAnalysis: this.analyzeSentiment(filteredFeedback),
      trendingTopics: this.identifyTrendingTopics(filteredFeedback),
      priorityIssues: this.identifyPriorityIssues(filteredFeedback)
    };
    
    this.analysisResults = analysis;
    return analysis;
  }

  /**
   * Calculate average rating from feedback
   * @param {Array} feedback - Array of feedback objects
   */
  calculateAverageRating(feedback) {
    const ratedFeedback = feedback.filter(f => f.rating > 0);
    if (ratedFeedback.length === 0) return 0;
    
    const totalRating = ratedFeedback.reduce((sum, f) => sum + f.rating, 0);
    return totalRating / ratedFeedback.length;
  }

  /**
   * Calculate distribution of feedback categories
   * @param {Array} feedback - Array of feedback objects
   */
  calculateCategoryDistribution(feedback) {
    const distribution = {};
    
    feedback.forEach(f => {
      distribution[f.category] = (distribution[f.category] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * Calculate distribution of feedback types
   * @param {Array} feedback - Array of feedback objects
   */
  calculateTypeDistribution(feedback) {
    const distribution = {};
    
    feedback.forEach(f => {
      distribution[f.type] = (distribution[f.type] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * Analyze sentiment of feedback text
   * @param {Array} feedback - Array of feedback objects
   */
  analyzeSentiment(feedback) {
    const sentimentKeywords = {
      positive: ['great', 'good', 'excellent', 'love', 'amazing', 'perfect', 'helpful', 'easy'],
      negative: ['bad', 'terrible', 'awful', 'hate', 'difficult', 'confusing', 'broken', 'error'],
      neutral: ['okay', 'fine', 'average', 'normal', 'standard']
    };
    
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    
    feedback.forEach(f => {
      if (!f.text) return;
      
      const text = f.text.toLowerCase();
      let sentiment = 'neutral';
      
      // Count positive keywords
      const positiveCount = sentimentKeywords.positive.filter(
        keyword => text.includes(keyword)
      ).length;
      
      // Count negative keywords
      const negativeCount = sentimentKeywords.negative.filter(
        keyword => text.includes(keyword)
      ).length;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
      }
      
      sentimentCounts[sentiment]++;
    });
    
    return sentimentCounts;
  }

  /**
   * Identify trending topics in feedback
   * @param {Array} feedback - Array of feedback objects
   */
  identifyTrendingTopics(feedback) {
    const topics = {};
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    feedback.forEach(f => {
      if (!f.text) return;
      
      const words = f.text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
      
      words.forEach(word => {
        topics[word] = (topics[word] || 0) + 1;
      });
    });
    
    // Return top 10 trending topics
    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  /**
   * Identify priority issues that need immediate attention
   * @param {Array} feedback - Array of feedback objects
   */
  identifyPriorityIssues(feedback) {
    return feedback
      .filter(f => f.category === FEEDBACK_CATEGORIES.CRITICAL || 
                   (f.category === FEEDBACK_CATEGORIES.HIGH && f.rating <= 2))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }

  /**
   * Generate actionable insights from feedback analysis
   */
  generateInsights() {
    const analysis = this.analysisResults;
    const insights = [];
    
    // Low rating insights
    if (analysis.averageRating < 3.5) {
      insights.push({
        type: 'warning',
        title: 'Low User Satisfaction',
        description: `Average rating is ${analysis.averageRating.toFixed(1)}/5. Consider reviewing recent changes and user experience.`,
        priority: 'high'
      });
    }
    
    // Critical issues insights
    if (analysis.categoryDistribution[FEEDBACK_CATEGORIES.CRITICAL] > 0) {
      insights.push({
        type: 'critical',
        title: 'Critical Issues Detected',
        description: `${analysis.categoryDistribution[FEEDBACK_CATEGORIES.CRITICAL]} critical issues need immediate attention.`,
        priority: 'critical'
      });
    }
    
    // Negative sentiment insights
    if (analysis.sentimentAnalysis.negative > analysis.sentimentAnalysis.positive) {
      insights.push({
        type: 'warning',
        title: 'Negative Sentiment Trend',
        description: 'More negative feedback than positive. Review user experience and communication.',
        priority: 'high'
      });
    }
    
    // Trending topics insights
    if (analysis.trendingTopics.length > 0) {
      const topTopic = analysis.trendingTopics[0];
      insights.push({
        type: 'info',
        title: 'Trending Topic',
        description: `"${topTopic.topic}" mentioned ${topTopic.count} times. Consider addressing this topic.`,
        priority: 'medium'
      });
    }
    
    return insights;
  }
}

// ============================================================================
// FEEDBACK REPORTING SYSTEM
// ============================================================================

/**
 * Feedback Reporting Component
 * Displays feedback analysis and insights
 */
export function FeedbackReport({ analysis, insights, onExport }) {
  if (!analysis) {
    return <div className="feedback-report">No feedback data available</div>;
  }

  return (
    <div className="feedback-report">
      <div className="feedback-report__header">
        <h2>Feedback Analysis Report</h2>
        <button
          className="feedback-report__export"
          onClick={() => onExport && onExport(analysis)}
        >
          Export Report
        </button>
      </div>

      <div className="feedback-report__metrics">
        <div className="feedback-report__metric">
          <h3>Total Feedback</h3>
          <div className="feedback-report__value">{analysis.totalFeedback}</div>
        </div>
        <div className="feedback-report__metric">
          <h3>Average Rating</h3>
          <div className="feedback-report__value">
            {analysis.averageRating.toFixed(1)}/5
          </div>
        </div>
        <div className="feedback-report__metric">
          <h3>Critical Issues</h3>
          <div className="feedback-report__value">
            {analysis.categoryDistribution[FEEDBACK_CATEGORIES.CRITICAL] || 0}
          </div>
        </div>
      </div>

      <div className="feedback-report__insights">
        <h3>Key Insights</h3>
        {insights.map((insight, index) => (
          <div key={index} className={`feedback-report__insight feedback-report__insight--${insight.type}`}>
            <h4>{insight.title}</h4>
            <p>{insight.description}</p>
            <span className="feedback-report__priority">{insight.priority}</span>
          </div>
        ))}
      </div>

      <div className="feedback-report__trending">
        <h3>Trending Topics</h3>
        <div className="feedback-report__topics">
          {analysis.trendingTopics.map((topic, index) => (
            <div key={index} className="feedback-report__topic">
              <span className="feedback-report__topic-name">{topic.topic}</span>
              <span className="feedback-report__topic-count">{topic.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEEDBACK HOOKS
// ============================================================================

/**
 * Hook for managing feedback collection
 * Provides feedback state and methods
 */
export function useFeedbackCollection() {
  const [feedback, setFeedback] = useState([]);
  const [analysisEngine] = useState(() => new FeedbackAnalysisEngine());

  /**
   * Submit feedback to the collection system
   * @param {object} feedbackData - Feedback data to submit
   */
  const submitFeedback = useCallback(async (feedbackData) => {
    // Add to local state
    setFeedback(prev => [...prev, feedbackData]);
    
    // Add to analysis engine
    analysisEngine.addFeedback(feedbackData);
    
    // In production, this would also send to backend
    try {
      // await api.submitFeedback(feedbackData);
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Failed to submit feedback:', error.message);
      throw error;
    }
  }, [analysisEngine]);

  /**
   * Analyze feedback with current data
   * @param {object} options - Analysis options
   */
  const analyzeFeedback = useCallback((options) => {
    return analysisEngine.analyzeFeedback(options);
  }, [analysisEngine]);

  /**
   * Generate insights from current feedback
   */
  const generateInsights = useCallback(() => {
    return analysisEngine.generateInsights();
  }, [analysisEngine]);

  return {
    feedback,
    submitFeedback,
    analyzeFeedback,
    generateInsights,
    analysisEngine
  };
}

export default {
  FEEDBACK_TYPES,
  FEEDBACK_CATEGORIES,
  FEEDBACK_CHANNELS,
  InAppFeedbackWidget,
  FeedbackAnalysisEngine,
  FeedbackReport,
  useFeedbackCollection
}; 