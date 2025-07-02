/**
 * FeedbackButton Component - Galileo Initiative User Feedback Collection
 * 
 * Purpose: Provides a floating feedback button that allows users to submit feedback
 * about their experience with AlphaFrame during the Galileo Initiative validation
 * 
 * Procedure:
 * 1. Renders a floating button in the bottom-right corner
 * 2. Opens a modal with feedback form when clicked
 * 3. Collects user feedback and contact information
 * 4. Tracks feedback submission for analytics
 * 5. Stores feedback in localStorage for review
 * 
 * Conclusion: Enables direct user feedback collection to improve product-market fit
 * and identify usability issues during the Galileo Initiative
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackFeedbackSubmitted } from '@/lib/analytics.js';
import StyledButton from './StyledButton.jsx';
import CompositeCard from './CompositeCard.jsx';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track feedback submission
      trackFeedbackSubmitted({
        type: 'general',
        hasContactInfo: !!contactInfo,
        sentiment: 'neutral' // Could be enhanced with sentiment analysis
      });

      // Store feedback in localStorage
      const feedbackData = {
        id: `feedback_${Date.now()}`,
        timestamp: new Date().toISOString(),
        feedback,
        contactInfo,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      const existingFeedback = JSON.parse(localStorage.getItem('alphaframe_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('alphaframe_feedback', JSON.stringify(existingFeedback));

      // Show success state
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFeedback('');
        setContactInfo('');
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setFeedback('');
      setContactInfo('');
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.div
        className="feedback-button-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        <StyledButton
          onClick={() => setIsOpen(true)}
          variant="primary"
          size="md"
          className="feedback-button"
          style={{
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span role="img" aria-label="feedback">💬</span>
          <span>Send Feedback</span>
        </StyledButton>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="feedback-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <CompositeCard variant="elevated" className="feedback-modal">
                <div className="feedback-modal-header">
                  <h2>🚀 We're in Early Testing</h2>
                  <p>Tell us what works or sucks. Your feedback shapes AlphaFrame's future.</p>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="feedback-field">
                      <label htmlFor="feedback">Your Feedback *</label>
                      <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="What's working well? What's frustrating? What would make this better?"
                        required
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div className="feedback-field">
                      <label htmlFor="contactInfo">Contact Info (Optional)</label>
                      <input
                        id="contactInfo"
                        type="email"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="your@email.com - if you'd like us to follow up"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div className="feedback-actions">
                      <StyledButton
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </StyledButton>
                      <StyledButton
                        type="submit"
                        variant="primary"
                        disabled={!feedback.trim() || isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Feedback'}
                      </StyledButton>
                    </div>
                  </form>
                ) : (
                  <div className="feedback-success">
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <span role="img" aria-label="success" style={{ fontSize: '48px' }}>✅</span>
                      <h3>Thank You!</h3>
                      <p>Your feedback has been submitted. We'll use it to make AlphaFrame better.</p>
                    </div>
                  </div>
                )}
              </CompositeCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .feedback-modal {
          padding: 24px;
        }

        .feedback-modal-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .feedback-modal-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          color: #1a202c;
        }

        .feedback-modal-header p {
          margin: 0;
          color: #718096;
          font-size: 14px;
          line-height: 1.5;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feedback-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feedback-field label {
          font-weight: 500;
          color: #2d3748;
          font-size: 14px;
        }

        .feedback-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .feedback-success {
          text-align: center;
        }

        .feedback-success h3 {
          margin: 16px 0 8px 0;
          color: #2d3748;
        }

        .feedback-success p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default FeedbackButton; 