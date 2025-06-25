import React, { useState, useEffect } from 'react';
import './ActionQueue.css';

const ActionQueue = ({ data, userContext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="action-queue-section">
        <h3>Action Queue</h3>
        <p>Loading actions...</p>
      </div>
    );
  }

  const { actions = [] } = data;

  const getActionIcon = (type) => {
    switch (type) {
      case 'review': return '👀';
      case 'approve': return '✅';
      case 'setup': return '⚙️';
      case 'complete': return '🎯';
      default: return '📋';
    }
  };

  const getActionColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-error)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className={`action-queue-section ${isVisible ? 'visible' : ''}`}>
      <header className="section-header">
        <h3>Action Queue</h3>
      </header>

      <div className="actions-list">
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <div key={index} className="action-item">
              <div className="action-icon">
                {getActionIcon(action.type)}
              </div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
                <span className="action-deadline">{action.deadline}</span>
              </div>
              <div className="action-priority">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getActionColor(action.priority) }}
                >
                  {action.priority}
                </span>
              </div>
              <button className="action-button">
                {action.type === 'review' ? 'Review' : 
                 action.type === 'approve' ? 'Approve' : 
                 action.type === 'setup' ? 'Setup' : 'Complete'}
              </button>
            </div>
          ))
        ) : (
          <p className="no-actions">No pending actions.</p>
        )}
      </div>
    </div>
  );
};

export default ActionQueue; 