import React, { useState, useEffect } from 'react';
import './NetWorthTrajectory.css';

const NetWorthTrajectory = ({ data, userContext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="networth-section">
        <h3>Net Worth</h3>
        <p>Loading net worth data...</p>
      </div>
    );
  }

  const { current = 0, history = [], milestones = [] } = data;

  return (
    <div className={`networth-section ${isVisible ? 'visible' : ''}`}>
      <header className="section-header">
        <h3>Net Worth Trajectory</h3>
      </header>

      <div className="networth-overview">
        <div className="current-networth">
          <h4>Current Net Worth</h4>
          <p className="networth-amount">${current.toLocaleString()}</p>
        </div>

        <div className="milestones">
          <h4>Milestones</h4>
          <div className="milestone-list">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <span className="milestone-name">{milestone.name}</span>
                <span className="milestone-amount">${milestone.amount.toLocaleString()}</span>
                <div className="milestone-progress">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min((current / milestone.amount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthTrajectory; 