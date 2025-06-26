import React, { useState, useEffect } from 'react';
import './RecentChanges.css';

const RecentChanges = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="recent-changes-section">
        <h3>Recent Changes</h3>
        <p>Loading recent activity...</p>
      </div>
    );
  }

  const { changes = [] } = data;

  const getChangeIcon = (type) => {
    switch (type) {
      case 'income': return '💰';
      case 'expense': return '💸';
      case 'savings': return '🏦';
      case 'investment': return '📈';
      default: return '📊';
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'income': return 'var(--color-success)';
      case 'expense': return 'var(--color-error)';
      case 'savings': return 'var(--color-primary)';
      case 'investment': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className={`recent-changes-section ${isVisible ? 'visible' : ''}`}>
      <header className="section-header">
        <h3>Recent Changes</h3>
      </header>

      <div className="changes-list">
        {changes.length > 0 ? (
          changes.map((change, index) => (
            <div key={index} className="change-item">
              <div className="change-icon" style={{ color: getChangeColor(change.type) }}>
                {getChangeIcon(change.type)}
              </div>
              <div className="change-content">
                <h4>{change.title}</h4>
                <p>{change.description}</p>
                <span className="change-time">{change.timestamp}</span>
              </div>
              <div className="change-amount">
                {change.amount > 0 ? '+' : ''}${change.amount.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="no-changes">No recent changes to display.</p>
        )}
      </div>
    </div>
  );
};

export default RecentChanges; 