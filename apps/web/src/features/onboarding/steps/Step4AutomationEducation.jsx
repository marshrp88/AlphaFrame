/**
 * Step4AutomationEducation.jsx - Phase 4 Automation Education
 * 
 * Purpose: Teach users about AlphaFrame's automation value proposition
 * through interactive demonstrations, visual rule mapping, and guided
 * explanations of how automation transforms financial monitoring.
 * 
 * Procedure:
 * 1. Introduce automation concepts with clear, simple language
 * 2. Show visual rule map demonstrating system behavior
 * 3. Provide interactive demonstration of rule triggers
 * 4. Explain the "aha moment" and immediate value
 * 5. Guide users toward creating their first rule
 * 
 * Conclusion: Users understand automation value and are excited
 * to create their first rule, leading to immediate engagement.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from '../../../components/ui/CompositeCard.jsx';
import StyledButton from '../../../components/ui/StyledButton.jsx';
import { 
  Brain, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  DollarSign,
  Clock,
  Play,
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Step4AutomationEducation = ({ onComplete, onStartDemo, automationDemoActive }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const [ruleMapVisible, setRuleMapVisible] = useState(false);

  const sections = [
    {
      title: "What is Financial Automation?",
      description: "AlphaFrame automatically monitors your spending and alerts you when you're approaching or exceeding your limits.",
      icon: Brain,
      color: "var(--color-primary-600)"
    },
    {
      title: "How Rules Work",
      description: "You set spending limits for categories like 'Food & Dining' or 'Entertainment'. We watch your transactions and notify you instantly.",
      icon: Target,
      color: "var(--color-success-600)"
    },
    {
      title: "Real-Time Alerts",
      description: "Get immediate notifications when your spending approaches limits, so you can adjust before it's too late.",
      icon: AlertTriangle,
      color: "var(--color-warning-600)"
    },
    {
      title: "Your Financial Guardian",
      description: "Think of AlphaFrame as your personal financial assistant, working 24/7 to keep you on track.",
      icon: CheckCircle,
      color: "var(--color-info-600)"
    }
  ];

  useEffect(() => {
    // Auto-advance sections for demonstration
    const timer = setInterval(() => {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        clearInterval(timer);
        setRuleMapVisible(true);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSection, sections.length]);

  const startDemo = () => {
    setDemoActive(true);
    if (onStartDemo) {
      onStartDemo();
    }
  };

  const handleComplete = () => {
    onComplete({
      automationUnderstood: true,
      demoCompleted: demoActive,
      sectionsViewed: currentSection + 1
    });
  };

  return (
    <div className="automation-education">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="education-header">
          <h2>Learn How Automation Works</h2>
          <p>Discover how AlphaFrame transforms your financial monitoring</p>
        </div>

        {/* Interactive Sections */}
        <div className="education-sections">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              className="education-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-content">
                <div className="section-icon">
                  {React.createElement(sections[currentSection].icon, {
                    size: 48,
                    color: sections[currentSection].color
                  })}
                </div>
                <h3>{sections[currentSection].title}</h3>
                <p>{sections[currentSection].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="section-progress">
            {sections.map((_, index) => (
              <motion.div
                key={index}
                className={`progress-dot ${index === currentSection ? 'active' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Visual Rule Map */}
        <AnimatePresence>
          {ruleMapVisible && (
            <motion.div
              className="rule-map-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CompositeCard variant="elevated" className="rule-map-card">
                <div className="rule-map-header">
                  <h3>How Your Rules Work</h3>
                  <p>Visual representation of automation flow</p>
                </div>

                <div className="rule-map-flow">
                  {/* Step 1: Transaction */}
                  <motion.div 
                    className="flow-step"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="step-icon">
                      <DollarSign size={24} color="var(--color-primary-600)" />
                    </div>
                    <div className="step-content">
                      <h4>Transaction Occurs</h4>
                      <p>You make a purchase</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flow-arrow"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>

                  {/* Step 2: Analysis */}
                  <motion.div 
                    className="flow-step"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="step-icon">
                      <Brain size={24} color="var(--color-success-600)" />
                    </div>
                    <div className="step-content">
                      <h4>AlphaFrame Analyzes</h4>
                      <p>Checks against your rules</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flow-arrow"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>

                  {/* Step 3: Alert */}
                  <motion.div 
                    className="flow-step"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="step-icon">
                      <AlertTriangle size={24} color="var(--color-warning-600)" />
                    </div>
                    <div className="step-content">
                      <h4>Instant Alert</h4>
                      <p>You get notified immediately</p>
                    </div>
                  </motion.div>
                </div>

                {/* Demo Button */}
                <div className="demo-section">
                  <StyledButton
                    variant="primary"
                    onClick={startDemo}
                    disabled={demoActive}
                    className="demo-button"
                  >
                    <Play size={16} />
                    {demoActive ? 'Demo Active...' : 'Try Demo Alert'}
                  </StyledButton>
                  <p className="demo-description">
                    Experience how you'll be notified when rules trigger
                  </p>
                </div>
              </CompositeCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Value Proposition */}
        <motion.div
          className="value-proposition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CompositeCard variant="elevated" className="value-card">
            <div className="value-header">
              <Sparkles size={32} color="var(--color-primary-600)" />
              <h3>The AlphaFrame Advantage</h3>
            </div>
            
            <div className="value-points">
              <div className="value-point">
                <Clock size={20} color="var(--color-success-600)" />
                <span>24/7 monitoring - never miss a spending alert</span>
              </div>
              <div className="value-point">
                <Zap size={20} color="var(--color-warning-600)" />
                <span>Instant notifications - react before it's too late</span>
              </div>
              <div className="value-point">
                <TrendingUp size={20} color="var(--color-info-600)" />
                <span>Proactive insights - stay ahead of your budget</span>
              </div>
            </div>
          </CompositeCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="education-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <StyledButton
            variant="primary"
            onClick={handleComplete}
            className="continue-button"
          >
            Create My First Rule
            <ArrowRight size={16} />
          </StyledButton>
          
          <p className="action-description">
            Ready to set up your first automated financial rule
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .automation-education {
          padding: 2rem 0;
        }

        .education-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .education-header h2 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .education-header p {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
        }

        .education-sections {
          margin-bottom: 2rem;
        }

        .education-section {
          text-align: center;
          padding: 2rem;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-primary);
        }

        .section-icon {
          margin-bottom: 1rem;
        }

        .section-content h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: 0.75rem;
        }

        .section-content p {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .section-progress {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-border-primary);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: var(--color-primary-600);
          transform: scale(1.2);
        }

        .rule-map-container {
          margin-bottom: 2rem;
        }

        .rule-map-card {
          padding: 2rem;
        }

        .rule-map-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .rule-map-header h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .rule-map-header p {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .rule-map-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .flow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--color-background-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          border: 2px solid var(--color-border-primary);
        }

        .step-content h4 {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .step-content p {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }

        .flow-arrow {
          color: var(--color-text-tertiary);
        }

        .demo-section {
          text-align: center;
          padding: 1.5rem;
          background: var(--color-background-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-secondary);
        }

        .demo-button {
          margin-bottom: 0.75rem;
        }

        .demo-description {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .value-proposition {
          margin-bottom: 2rem;
        }

        .value-card {
          padding: 2rem;
        }

        .value-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .value-header h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0;
        }

        .value-points {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .value-point {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .value-point span {
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
        }

        .education-actions {
          text-align: center;
        }

        .continue-button {
          margin-bottom: 0.75rem;
        }

        .action-description {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Step4AutomationEducation; 