import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StyledButton from './StyledButton.jsx';
import { X, Zap, Target, DollarSign, Calendar, Sparkles, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { useToast } from './use-toast.jsx';
import ruleTemplateService from '../../lib/services/RuleTemplateService.js';
import { trackRuleCreated } from '@/lib/analytics.js';

const RuleCreationModal = ({ isOpen, onClose, onSubmit }) => {
  console.log('RuleCreationModal render - isOpen:', isOpen);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [templates, setTemplates] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [ruleData, setRuleData] = useState({
    name: '',
    description: '',
    type: 'spending_limit',
    amount: '',
    category: 'general',
    frequency: 'monthly'
  });
  const [compoundConditions, setCompoundConditions] = useState([
    { field: 'amount', operator: '>', value: '', logical: 'AND' }
  ]);

  // Load templates on mount
  useEffect(() => {
    if (isOpen) {
      const allTemplates = ruleTemplateService.getAllTemplates();
      setTemplates(allTemplates);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let newRule;
      
      if (selectedTemplate && !showCustomForm) {
        // Create rule from template with customizations
        newRule = ruleTemplateService.createRuleFromTemplate(selectedTemplate.id, customizations);
      } else {
        // Create custom rule
        newRule = {
          id: Date.now().toString(),
          ...ruleData,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        // Add advanced fields for merchant, date, compound
        if (ruleData.type === 'merchant') {
          newRule.merchant = ruleData.merchant;
        }
        if (ruleData.type === 'date') {
          newRule.dateOperator = ruleData.dateOperator;
        }
        if (ruleData.type === 'compound') {
          newRule.compoundConditions = compoundConditions;
        }
      }

      // Note: Rule will be saved via the parent's onSubmit callback
      // which uses the dataStore createRule function

      // Track rule creation
      trackRuleCreated({
        type: selectedTemplate ? 'template' : 'custom',
        name: newRule.name,
        template: selectedTemplate?.id || null
      });

      // Show success toast
      toast({
        title: "Rule Created Successfully!",
        description: `"${newRule.name}" is now active and monitoring your finances.`,
        variant: "default"
      });

      // Call parent callback
      onSubmit(newRule);
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

  const handleCustomizationChange = (key, value) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowCustomization(true);
    // Initialize customizations with template defaults
    const defaultCustomizations = {};
    if (template.customizationOptions) {
      template.customizationOptions.forEach(option => {
        defaultCustomizations[option.key] = option.default;
      });
    }
    setCustomizations(defaultCustomizations);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setShowCustomization(false);
    setCustomizations({});
  };

  // Handler to update a compound condition
  const handleCompoundChange = (idx, key, value) => {
    setCompoundConditions(prev => prev.map((cond, i) => i === idx ? { ...cond, [key]: value } : cond));
  };
  // Handler to add a new condition
  const addCompoundCondition = () => {
    setCompoundConditions(prev => [...prev, { field: 'amount', operator: '>', value: '', logical: 'AND' }]);
  };
  // Handler to remove a condition
  const removeCompoundCondition = (idx) => {
    setCompoundConditions(prev => prev.filter((_, i) => i !== idx));
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
        data-testid="rule-creation-modal"
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
          style={{ 
            width: '100%', 
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
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
                    {showCustomization && selectedTemplate ? `Customize ${selectedTemplate.name}` : 
                     showCustomForm ? 'Create Custom Rule' : 'Create Your First Rule'}
                  </h2>
                  <p style={{ 
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    margin: '0.5rem 0 0 0'
                  }}>
                    {showCustomization && selectedTemplate ? 'Configure your rule settings' :
                     showCustomForm ? 'Set up a custom financial rule' : 'Set up automated financial monitoring'}
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

              {/* Template Selection, Customization, or Custom Form */}
              <form onSubmit={handleSubmit}>
                {!showCustomForm && !showCustomization ? (
                  // Template Selection
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h3 style={{ 
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '1rem'
                      }}>
                        Choose a Rule Template
                      </h3>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                      }}>
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            style={{
                              padding: '1rem',
                              border: '2px solid var(--color-border-primary)',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--color-surface)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              ':hover': {
                                borderColor: 'var(--color-primary-500)',
                                backgroundColor: 'var(--color-primary-50)'
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'var(--color-primary-500)';
                              e.target.style.backgroundColor = 'var(--color-primary-50)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = 'var(--color-border-primary)';
                              e.target.style.backgroundColor = 'var(--color-surface)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
                              <h4 style={{ 
                                fontSize: 'var(--font-size-base)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)',
                                margin: 0
                              }}>
                                {template.name}
                              </h4>
                            </div>
                            <p style={{ 
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--color-text-secondary)',
                              margin: 0
                            }}>
                              {template.description}
                            </p>
                            <div style={{ 
                              marginTop: '0.5rem',
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'var(--color-muted-100)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--color-text-secondary)',
                              display: 'inline-block'
                            }}>
                              {template.difficulty} level
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Rule Option */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '1rem',
                      border: '1px dashed var(--color-border-primary)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <p style={{ 
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.5rem'
                      }}>
                        Don't see what you need?
                      </p>
                      <StyledButton
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomForm(true)}
                        data-testid="create-custom-rule"
                        style={{
                          marginTop: '1rem',
                          alignSelf: 'flex-start',
                          scrollMarginTop: '8px',
                        }}
                      >
                        Create Custom Rule
                      </StyledButton>
                    </div>
                  </div>
                ) : showCustomization && selectedTemplate ? (
                  // Template Customization
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Back to Templates */}
                    <div style={{ textAlign: 'left' }}>
                      <StyledButton
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToTemplates}
                      >
                        ← Back to Templates
                      </StyledButton>
                    </div>

                    {/* Template Info */}
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-200)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{selectedTemplate.icon}</span>
                        <h4 style={{ 
                          fontSize: 'var(--font-size-base)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                          margin: 0
                        }}>
                          {selectedTemplate.name}
                        </h4>
                      </div>
                      <p style={{ 
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                      }}>
                        {selectedTemplate.description}
                      </p>
                    </div>

                    {/* Customization Options */}
                    {selectedTemplate.customizationOptions && (
                      <div>
                        <h3 style={{ 
                          fontSize: 'var(--font-size-base)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                          marginBottom: '1rem'
                        }}>
                          Customize Your Rule
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {selectedTemplate.customizationOptions.map((option) => (
                            <div key={option.key}>
                              <label style={{ 
                                display: 'block',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-text-primary)',
                                marginBottom: '0.5rem'
                              }}>
                                {option.label}
                                {option.required && <span style={{ color: 'var(--color-destructive-500)' }}> *</span>}
                              </label>
                              
                              {option.type === 'select' ? (
                                <select
                                  value={customizations[option.key] || option.default || ''}
                                  onChange={(e) => handleCustomizationChange(option.key, e.target.value)}
                                  required={option.required}
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
                                >
                                  {option.options.map((opt) => (
                                    <option key={opt.value || opt} value={opt.value || opt}>
                                      {opt.label || opt}
                                    </option>
                                  ))}
                                </select>
                              ) : option.type === 'number' ? (
                                <input
                                  type="number"
                                  value={customizations[option.key] || option.default || ''}
                                  onChange={(e) => handleCustomizationChange(option.key, parseFloat(e.target.value))}
                                  placeholder={option.placeholder}
                                  min={option.min}
                                  max={option.max}
                                  step={option.step}
                                  required={option.required}
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
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={customizations[option.key] || option.default || ''}
                                  onChange={(e) => handleCustomizationChange(option.key, e.target.value)}
                                  placeholder={option.placeholder}
                                  required={option.required}
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
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Custom Form
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Back to Templates */}
                    <div style={{ textAlign: 'left' }}>
                      <StyledButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomForm(false)}
                      >
                        ← Back to Templates
                      </StyledButton>
                    </div>

                    {/* Custom Form Fields */}
                    <div>
                      <label htmlFor="rule-name-input" style={{ 
                        display: 'block',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem'
                      }}>
                        Rule Name
                      </label>
                      <input
                        id="rule-name-input"
                        data-testid="rule-name-input"
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
                      />
                    </div>

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
                        data-testid="rule-condition-select"
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
                      >
                        <option value="transaction_amount">Transaction Amount</option>
                        <option value="spending_limit">Spending Limit</option>
                        <option value="savings_goal">Savings Goal</option>
                        <option value="bill_reminder">Bill Reminder</option>
                        <option value="category_tracking">Category Tracking</option>
                        <option value="merchant">Merchant</option>
                        <option value="date">Date</option>
                        <option value="compound">Compound</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="rule-amount-input" style={{ 
                        display: 'block',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem'
                      }}>
                        Amount
                      </label>
                      <input
                        id="rule-amount-input"
                        data-testid="rule-condition-value"
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
                      />
                    </div>

                    <div>
                      <label htmlFor="rule-action-input" style={{ 
                        display: 'block',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem'
                      }}>
                        Action
                      </label>
                      <select
                        data-testid="rule-action-select"
                        value={ruleData.action || 'send_notification'}
                        onChange={(e) => handleInputChange('action', e.target.value)}
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
                      >
                        <option value="send_notification">Send Notification</option>
                        <option value="block_transaction">Block Transaction</option>
                        <option value="log_event">Log Event</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="rule-action-value-input" style={{ 
                        display: 'block',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem'
                      }}>
                        Action Value
                      </label>
                      <input
                        id="rule-action-value-input"
                        data-testid="rule-action-value"
                        type="text"
                        value={ruleData.actionValue || ''}
                        onChange={(e) => handleInputChange('actionValue', e.target.value)}
                        placeholder="e.g., Large transaction detected"
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
                      />
                    </div>

                    <div>
                      <label htmlFor="rule-description-input" style={{ 
                        display: 'block',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.5rem'
                      }}>
                        Description
                      </label>
                      <textarea
                        id="rule-description-input"
                        data-testid="rule-description-input"
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
                      />
                    </div>

                    {ruleData.type === 'merchant' && (
                      <div>
                        <label htmlFor="rule-merchant-input" style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                          Merchant Name
                        </label>
                        <input
                          id="rule-merchant-input"
                          type="text"
                          value={ruleData.merchant || ''}
                          onChange={e => handleInputChange('merchant', e.target.value)}
                          placeholder="e.g., Starbucks"
                          required
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-base)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', transition: 'all 0.2s ease', outline: 'none' }}
                        />
                      </div>
                    )}
                    {ruleData.type === 'date' && (
                      <div>
                        <label htmlFor="rule-date-operator" style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                          Date Condition
                        </label>
                        <select
                          id="rule-date-operator"
                          value={ruleData.dateOperator || 'isToday'}
                          onChange={e => handleInputChange('dateOperator', e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-base)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', transition: 'all 0.2s ease', outline: 'none' }}
                        >
                          <option value="isToday">Is Today</option>
                          <option value="isThisWeek">Is This Week</option>
                          <option value="isThisMonth">Is This Month</option>
                        </select>
                      </div>
                    )}
                    {ruleData.type === 'compound' && (
                      <div style={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>Compound Conditions</label>
                        {compoundConditions.map((cond, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            {idx > 0 && (
                              <select value={cond.logical} onChange={e => handleCompoundChange(idx, 'logical', e.target.value)} style={{ width: 70 }}>
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            )}
                            <select value={cond.field} onChange={e => handleCompoundChange(idx, 'field', e.target.value)} style={{ width: 120 }}>
                              <option value="amount">Amount</option>
                              <option value="category">Category</option>
                              <option value="merchant">Merchant</option>
                              <option value="date">Date</option>
                            </select>
                            <select value={cond.operator} onChange={e => handleCompoundChange(idx, 'operator', e.target.value)} style={{ width: 80 }}>
                              <option value=">">&gt;</option>
                              <option value="<">&lt;</option>
                              <option value=">=">&gt;=</option>
                              <option value="<=">&lt;=</option>
                              <option value="===">===</option>
                              <option value="!==">!==</option>
                              <option value="contains">contains</option>
                            </select>
                            <input type="text" value={cond.value} onChange={e => handleCompoundChange(idx, 'value', e.target.value)} placeholder="Value" style={{ width: 100 }} />
                            {compoundConditions.length > 1 && (
                              <button type="button" onClick={() => removeCompoundCondition(idx)} style={{ color: 'red', border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
                            )}
                          </div>
                        ))}
                        <StyledButton type="button" variant="outline" size="sm" onClick={addCompoundCondition} style={{ marginTop: '0.5rem' }}>+ Add Condition</StyledButton>
                      </div>
                    )}
                  </div>
                )}

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
                    data-testid="save-rule-btn"
                    disabled={isLoading || 
                      (showCustomForm && (!ruleData.name || !ruleData.amount)) ||
                      (showCustomization && selectedTemplate?.customizationOptions?.some(opt => opt.required && !customizations[opt.key]))
                    }
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
                        <ArrowRight size={16} />
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