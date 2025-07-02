import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StyledButton from './StyledButton.jsx';
import { X, Zap, Target, DollarSign, Calendar } from 'lucide-react';
import { useToast } from './use-toast.jsx';

const RuleCreationModal = ({ isOpen, onClose, onRuleCreated }) => {
  console.log('RuleCreationModal render - isOpen:', isOpen);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ruleData, setRuleData] = useState({
    name: '',
    description: '',
    type: 'spending_limit',
    amount: '',
    category: 'general',
    frequency: 'monthly'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRule = {
        id: Date.now().toString(),
        ...ruleData,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // Save to localStorage
      const existingRules = JSON.parse(localStorage.getItem('alphaframe_user_rules') || '[]');
      existingRules.push(newRule);
      localStorage.setItem('alphaframe_user_rules', JSON.stringify(existingRules));

      // Show success toast
      toast({
        title: "Rule Created Successfully!",
        description: `"${newRule.name}" is now active and monitoring your finances.`,
        variant: "default"
      });

      // Call parent callback
      onRuleCreated(newRule);
      onClose();
    } catch (error) {
      toast({
        title: "Error Creating Rule",
        description: "There was an issue creating your rule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRuleData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
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
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <CompositeCard variant="elevated">
            <div style={{ padding: '2rem' }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}>
                    Create Your First Rule
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    margin: '0.5rem 0 0 0'
                  }}>
                    Set up automated financial monitoring
                  </p>
                </div>
                <StyledButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  style={{ padding: '0.5rem' }}
                >
                  <X size={20} />
                </StyledButton>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Rule Name */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      Rule Name
                    </label>
                    <input
                      type="text"
                      value={ruleData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Monthly Coffee Budget"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-base)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-primary)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Rule Type */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      Rule Type
                    </label>
                    <select
                      value={ruleData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-base)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-primary)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="spending_limit">Spending Limit</option>
                      <option value="savings_goal">Savings Goal</option>
                      <option value="bill_reminder">Bill Reminder</option>
                      <option value="category_tracking">Category Tracking</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      Amount
                    </label>
                    <input
                      type="number"
                      value={ruleData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-base)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-primary)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      Description
                    </label>
                    <textarea
                      value={ruleData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what this rule should monitor..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-base)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        resize: 'vertical',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary-500)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border-primary)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '2rem',
                  justifyContent: 'flex-end'
                }}>
                  <StyledButton
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    type="submit"
                    disabled={isLoading || !ruleData.name || !ruleData.amount}
                    style={{
                      background: 'var(--color-primary-600)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="loader-spinner" style={{ width: '16px', height: '16px' }}></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Create Rule
                      </>
                    )}
                  </StyledButton>
                </div>
              </form>
            </div>
          </CompositeCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RuleCreationModal; 