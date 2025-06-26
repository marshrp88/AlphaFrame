import React, { useState, useEffect } from 'react';
import { RecommendationEngine } from '../../lib/services/RecommendationEngine';
import './WhatsNext.css';

/**
 * WhatsNext - Dynamic recommendation engine for financial actions
 * 
 * Purpose: Analyzes user's financial state and provides personalized,
 * actionable recommendations to improve their financial health.
 * 
 * Procedure:
 * 1. Analyzes financial data and user context
 * 2. Generates prioritized recommendations
 * 3. Presents clear calls-to-action
 * 4. Tracks user engagement with recommendations
 * 
 * Conclusion: Users get specific, actionable guidance on what to do next
 * to improve their financial situation.
 */
const WhatsNext = ({ financialState, userContext }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!financialState || !userContext) {
        setLoading(false);
        return;
      }

      try {
        const engine = new RecommendationEngine();
        const recs = await engine.generateRecommendations(financialState, userContext);
        setRecommendations(recs);
      } catch (error) {
        // Fallback recommendations
        setRecommendations([
          {
            id: 'emergency-fund',
            title: 'Build Emergency Fund',
            description: 'Start with $1,000 emergency fund',
            priority: 'high',
            impact: 'high',
            action: 'setup-automated-savings',
            icon: '🛡️'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [financialState, userContext]);

  const handleActionClick = async (recommendation) => {
    setSelectedAction(recommendation.id);
    
    try {
      // Track recommendation engagement
      await RecommendationEngine.trackEngagement(recommendation.id, 'clicked');
      
      // Execute the recommended action
      switch (recommendation.action) {
        case 'setup-automated-savings':
          window.location.href = '/onboarding/savings-setup';
          break;
        case 'review-spending':
          window.location.href = '/dashboard/spending-analysis';
          break;
        case 'optimize-budget':
          window.location.href = '/dashboard/budget-optimizer';
          break;
        case 'debt-payoff':
          window.location.href = '/dashboard/debt-strategy';
          break;
        default:
          console.log('Action not implemented:', recommendation.action);
      }
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return '🚀';
      case 'medium': return '📈';
      case 'low': return '📊';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="whats-next-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your financial situation...</p>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="whats-next-empty">
        <h3>Great job! 🎉</h3>
        <p>Your finances are looking good. Check back later for new recommendations.</p>
      </div>
    );
  }

  const primaryRecommendation = recommendations[0];

  return (
    <div className="whats-next">
      <header className="whats-next-header">
        <h2>What&apos;s Next?</h2>
        <p>Your personalized financial action plan</p>
      </header>

      {/* Primary Recommendation */}
      <div className="primary-recommendation">
        <div className="recommendation-card primary">
          <div className="recommendation-header">
            <span className="recommendation-icon">{primaryRecommendation.icon}</span>
            <div className="recommendation-meta">
              <span className={`priority-badge ${getPriorityColor(primaryRecommendation.priority)}`}>
                {primaryRecommendation.priority} priority
              </span>
              <span className="impact-indicator">
                {getImpactIcon(primaryRecommendation.impact)} High impact
              </span>
            </div>
          </div>
          
          <h3 className="recommendation-title">{primaryRecommendation.title}</h3>
          <p className="recommendation-description">{primaryRecommendation.description}</p>
          
          <button
            className="action-button primary"
            onClick={() => handleActionClick(primaryRecommendation)}
            disabled={selectedAction === primaryRecommendation.id}
          >
            {selectedAction === primaryRecommendation.id ? 'Setting up...' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Additional Recommendations */}
      {recommendations.length > 1 && (
        <div className="additional-recommendations">
          <h3>More Actions</h3>
          <div className="recommendations-grid">
            {recommendations.slice(1).map((rec) => (
              <div key={rec.id} className="recommendation-card secondary">
                <div className="recommendation-header">
                  <span className="recommendation-icon">{rec.icon}</span>
                  <span className={`priority-badge ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                
                <h4 className="recommendation-title">{rec.title}</h4>
                <p className="recommendation-description">{rec.description}</p>
                
                <button
                  className="action-button secondary"
                  onClick={() => handleActionClick(rec)}
                  disabled={selectedAction === rec.id}
                >
                  {selectedAction === rec.id ? 'Setting up...' : 'Learn More'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(recommendations.filter(r => r.completed).length / recommendations.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {recommendations.filter(r => r.completed).length} of {recommendations.length} actions completed
        </p>
      </div>
    </div>
  );
};

export default WhatsNext; 